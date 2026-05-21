import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Navigation, Car, Footprints, ExternalLink, AlertCircle, ArrowRight } from 'lucide-react';
import { LATAM_COORDINATES, normalizarCidade } from '../data/latamCoordinates';

// ── Ícones customizados (evita problema do import de PNG no Vite) ──────────
const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(59,130,246,0.25)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  className: '',
});

const destIcon = L.divIcon({
  html: `<div style="background:#FF8C00;color:white;padding:5px 10px;border-radius:10px;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.3)">🦷 Consultório</div>`,
  iconSize: [120, 30],
  iconAnchor: [60, 30],
  className: '',
});

// ── Sub-componente: ajusta o zoom para mostrar os dois pontos ─────────────
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 2) {
      map.fitBounds(points, { padding: [60, 60] });
    }
  }, [map, points]);
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatarDistancia(metros: number): string {
  return metros < 1000
    ? `${Math.round(metros)} m`
    : `${(metros / 1000).toFixed(1)} km`;
}

function formatarDuracao(segundos: number): string {
  if (segundos < 60) return `${Math.round(segundos)} seg`;
  if (segundos < 3600) return `${Math.round(segundos / 60)} min`;
  const h = Math.floor(segundos / 3600);
  const m = Math.round((segundos % 3600) / 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

type Modo = 'car' | 'foot';
type Status = 'localizando' | 'geocodificando' | 'calculando' | 'pronto' | 'erro';

const STATUS_LABEL: Record<Status, string> = {
  localizando:    'Obtendo sua localização…',
  geocodificando: 'Localizando o destino…',
  calculando:     'Calculando a melhor rota…',
  pronto: '',
  erro:   '',
};

interface RouteInfo {
  distancia: string;
  duracao: string;
  instrucao: string;
  coords: [number, number][]; // [lat, lng] para o Leaflet
}

interface Props {
  dentistaCidade: string;
  dentistaPais: string;
  dentistaNome: string;
  data: string;
  hora: string;
  onClose: () => void;
}

// ── Geocoding: dicionário local primeiro, Nominatim como fallback ─────────
async function geocodeCidade(cidade: string, pais: string): Promise<[number, number]> {
  // Tenta o dicionário local (coordenadas de centros urbanos, sempre na malha viária)
  const cidadeNormalizada = normalizarCidade(cidade);
  const local = LATAM_COORDINATES[cidadeNormalizada] ?? LATAM_COORDINATES[cidade];
  if (local) return local;

  // Fallback: Nominatim com país para evitar geocoding em continente errado
  const query = `${cidade}, ${pais}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&featuretype=city`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
  if (!res.ok) throw new Error(`Geocoding falhou (${res.status})`);
  const json = await res.json();
  if (!json.length) throw new Error(`Cidade "${cidade}" não encontrada. Verifique o cadastro do dentista.`);
  return [parseFloat(json[0].lat), parseFloat(json[0].lon)]; // [lat, lng]
}

// ── Rota via OpenRouteService ─────────────────────────────────────────────
const ORS_KEY = (import.meta.env.VITE_ORS_API_KEY as string | undefined) ?? '';

async function buscarRota(
  origem: [number, number],
  destino: [number, number],
  modo: Modo,
): Promise<RouteInfo> {
  if ([origem[0], origem[1], destino[0], destino[1]].some(isNaN))
    throw new Error('Coordenadas inválidas. Tente novamente.');

  // ORS usa [lng, lat] nos parâmetros; perfis: driving-car | foot-walking
  const profile = modo === 'foot' ? 'foot-walking' : 'driving-car';
  const start = `${origem[1]},${origem[0]}`;
  const end   = `${destino[1]},${destino[0]}`;
  const url   = `https://api.openrouteservice.org/v2/directions/${profile}?start=${start}&end=${end}`;

  const res = await fetch(url, {
    headers: { Authorization: ORS_KEY, Accept: 'application/geo+json' },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Rota indisponível (${res.status}). ${body.slice(0, 120)}`.trim());
  }

  const json = await res.json();
  const feature = json.features?.[0];
  if (!feature) throw new Error('Sem rota disponível');

  const summary  = feature.properties?.summary ?? {};
  const instrucao = feature.properties?.segments?.[0]?.steps?.[0]?.instruction ?? 'Siga em frente';

  // ORS retorna coordenadas como [lng, lat] → converter para [lat, lng] (Leaflet)
  const coords: [number, number][] = feature.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng],
  );

  return {
    distancia: formatarDistancia(summary.distance ?? 0),
    duracao:   formatarDuracao(summary.duration ?? 0),
    instrucao,
    coords,
  };
}

// ── Componente principal ──────────────────────────────────────────────────
export function MapaRota({ dentistaCidade, dentistaPais, dentistaNome, data, hora, onClose }: Props) {
  const [status, setStatus]           = useState<Status>('localizando');
  const [erroMsg, setErroMsg]         = useState('');
  const [userLoc, setUserLoc]         = useState<[number, number] | null>(null);
  const [destLoc, setDestLoc]         = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo]     = useState<RouteInfo | null>(null);
  const [modo, setModo]               = useState<Modo>('car');

  // ── Passo a passo: GPS → geocoding → rota ────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('erro');
      setErroMsg('Geolocalização não suportada neste dispositivo.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const origem: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLoc(origem);
        setStatus('geocodificando');

        let dest: [number, number];
        try {
          dest = await geocodeCidade(dentistaCidade, dentistaPais);
          setDestLoc(dest);
        } catch (err) {
          // Geocoding falhou: não temos destino, erro fatal
          setStatus('erro');
          setErroMsg(err instanceof Error ? err.message : 'Cidade do dentista não encontrada.');
          return;
        }

        setStatus('calculando');
        try {
          const info = await buscarRota(origem, dest, 'car');
          setRouteInfo(info);
        } catch {
          // OSRM falhou mas temos origem e destino — mostra mapa com marcadores + apps externos
        }
        setStatus('pronto');
      },
      () => {
        setStatus('erro');
        setErroMsg('Permissão de localização negada. Ative o GPS e tente novamente.');
      },
      { enableHighAccuracy: true, timeout: 15_000 },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recalcula ao trocar modo ──────────────────────────────────────────
  useEffect(() => {
    if (!userLoc || !destLoc || status !== 'pronto') return;
    setStatus('calculando');
    buscarRota(userLoc, destLoc, modo)
      .then((info) => { setRouteInfo(info); setStatus('pronto'); })
      .catch(() => { setRouteInfo(null); setStatus('pronto'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  const isLoading = status === 'localizando' || status === 'geocodificando' || status === 'calculando';

  const wazeUrl = destLoc
    ? `https://waze.com/ul?ll=${destLoc[0]},${destLoc[1]}&navigate=yes`
    : '#';
  const gmapsUrl = destLoc
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dentistaCidade + ', ' + dentistaPais)}&travelmode=${modo === 'foot' ? 'walking' : 'driving'}`
    : '#';

  // Centro inicial (Brasil)
  const center: [number, number] = userLoc ?? [-15.793889, -47.882778];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">

      {/* ── Mapa ── */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={userLoc ? 12 : 4}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Ajusta zoom para mostrar os dois pontos */}
          {userLoc && destLoc && (
            <FitBounds points={[userLoc, destLoc]} />
          )}

          {/* Marcador do usuário */}
          {userLoc && <Marker position={userLoc} icon={userIcon} />}

          {/* Marcador do destino */}
          {destLoc && <Marker position={destLoc} icon={destIcon} />}

          {/* Linha da rota */}
          {routeInfo && (
            <>
              {/* Glow */}
              <Polyline
                positions={routeInfo.coords}
                pathOptions={{ color: '#FF8C00', weight: 14, opacity: 0.15 }}
              />
              {/* Linha principal */}
              <Polyline
                positions={routeInfo.coords}
                pathOptions={{ color: '#FF8C00', weight: 5, opacity: 1 }}
              />
            </>
          )}
        </MapContainer>

        {/* ── Header flutuante ── */}
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4 flex items-start justify-between pointer-events-none">
          <div className="bg-gray-900/85 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 shadow-2xl pointer-events-auto" style={{ maxWidth: 'calc(100% - 60px)' }}>
            <div className="flex items-center gap-2 mb-0.5">
              <Navigation size={14} className="text-[#FF8C00] flex-shrink-0" />
              <span className="text-white font-bold text-sm">Rota para a Consulta</span>
            </div>
            <p className="text-white/60 text-xs">
              Dr(a). {dentistaNome} · {data.split('-').reverse().join('/')} às {hora}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-900/85 backdrop-blur-md hover:bg-gray-800 border border-white/10 rounded-full p-2.5 text-white transition-colors shadow-2xl pointer-events-auto"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Overlay de carregamento ── */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-7 flex flex-col items-center gap-4 shadow-2xl mx-6 w-full max-w-xs">
              <div className="w-12 h-12 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-white font-bold text-sm">{STATUS_LABEL[status]}</p>
                <p className="text-white/40 text-xs mt-1">OpenStreetMap · OSRM · Sem custo</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay de erro ── */}
        {status === 'erro' && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-7 flex flex-col items-center gap-4 shadow-2xl mx-6 w-full max-w-xs text-center">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold">Ops!</p>
                <p className="text-white/60 text-sm mt-1">{erroMsg}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-colors border border-white/10"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Painel inferior ── */}
      {status === 'pronto' && (
        <div className="bg-gray-900 border-t border-white/10 rounded-t-3xl px-5 pt-5 pb-6 shadow-2xl">
          {routeInfo ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <span className="text-white font-black text-3xl">{routeInfo.duracao}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 bg-[#FF8C00] rounded-full" />
                    <span className="text-white/50 text-sm">{routeInfo.distancia} até {dentistaCidade}</span>
                  </div>
                </div>

                {/* Toggle modo */}
                <div className="flex bg-white/10 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setModo('car')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${modo === 'car' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <Car size={13} /> Carro
                  </button>
                  <button
                    onClick={() => setModo('foot')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${modo === 'foot' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <Footprints size={13} /> A Pé
                  </button>
                </div>
              </div>

              {/* Próxima instrução */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF8C00]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={16} className="text-[#FF8C00]" />
                </div>
                <p className="text-white/90 text-sm font-medium">{routeInfo.instrucao}</p>
              </div>
            </>
          ) : (
            /* Rota automática indisponível — mostra destino no mapa + apps externos */
            <div className="flex items-center gap-3 mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <AlertCircle size={18} className="text-yellow-400 flex-shrink-0" />
              <p className="text-white/70 text-sm">Rota automática indisponível. Use um dos apps abaixo para navegar até <span className="text-white font-bold">{dentistaCidade}</span>.</p>
            </div>
          )}

          {/* Links externos — sempre visíveis quando temos o destino */}
          <div className="grid grid-cols-2 gap-3">
            <a href={wazeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md">
              <ExternalLink size={14} /> Abrir no Waze
            </a>
            <a href={gmapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl text-sm transition-colors border border-white/10">
              <ExternalLink size={14} /> Google Maps
            </a>
          </div>

          <p className="text-white/20 text-[10px] text-center mt-3">
            Mapa via OpenStreetMap · Rotas via OSRM · 100% gratuito
          </p>
        </div>
      )}
    </div>
  );
}
