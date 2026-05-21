import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../config';
import { LayoutDashboard, Users, LogOut, MapPin, Heart, CalendarDays, Clock, TrendingUp, Smile, DollarSign, Trash2, AlertTriangle, Search, UserX } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { LATAM_COORDINATES, normalizarCidade } from '../data/latamCoordinates';

// ─── Componentes internos do mapa de calor (Leaflet) ───────────────────────
// Definidos fora do componente principal para não serem recriados a cada render.

/**
 * Camada de calor (heatmap) renderizada sobre o mapa Leaflet.
 * Recebe `points` como [lat, lng, intensidade] — intensidade normalizada 0–1.
 * O hook useMap() só funciona dentro de um filho de <MapContainer>.
 */
function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, {
      radius: 38,
      blur: 28,
      maxZoom: 10,
      max: 1.0,
      gradient: { 0.0: '#312e81', 0.25: '#4338ca', 0.5: '#8b5cf6', 0.75: '#f97316', 1.0: '#dc2626' }
    }).addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, points]);
  return null;
}

/**
 * Marcadores circulares por cidade com tooltip de contagem.
 * O raio e a cor do círculo são proporcionais à concentração de usuários:
 *   vermelho (#dc2626) = >70% do máximo | laranja = 40–70% | roxo = <40%
 */
function CityMarkers({ porCidade, coordsMap }: { porCidade: Record<string, number>; coordsMap: Record<string, [number, number]> }) {
  const maxQtd = Math.max(1, ...Object.values(porCidade).map(Number));
  return (
    <>
      {Object.entries(porCidade)
        .filter(([cidade]) => coordsMap[cidade])
        .map(([cidade, qtd]) => {
          const [lat, lng] = coordsMap[cidade];
          const ratio = Number(qtd) / maxQtd;
          const radius = 5 + ratio * 18;
          const color = ratio > 0.7 ? '#dc2626' : ratio > 0.4 ? '#f97316' : '#8b5cf6';
          return (
            <CircleMarker
              key={cidade}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 0.85 }}
            >
              <Tooltip direction="top" offset={[0, -4]}>
                <span style={{ fontWeight: 700 }}>{cidade}</span>: {Number(qtd)} paciente{Number(qtd) !== 1 ? 's' : ''}
              </Tooltip>
            </CircleMarker>
          );
        })}
    </>
  );
}

// ------------------------------------------------------------

interface AgendamentoAdmin {
  paciente: string;
  prioridade: string;
  proc: string;
  dentista: string;
  data: string;
  hora: string;
  cidade: string; 
}

interface UsuarioPaciente {
  id: number;
  nomePaciente?: string;
  nome?: string;
  email: string;
  cidade: string;
  pais: string;
  tipoDor?: string;
}

interface UsuarioDentista {
  id: number;
  nomeDentista?: string;
  nome?: string;
  email: string;
  cidade: string;
  cro?: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Admin";

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'usuarios'>('painel');
  const [pacientes, setPacientes] = useState<UsuarioPaciente[]>([]);
  const [dentistas, setDentistas] = useState<UsuarioDentista[]>([]);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [mensagemAdmin, setMensagemAdmin] = useState('');

  const [statsAdmin, setStatsAdmin] = useState({
    total_beneficiarios: 0,
    total_dentistas: 0,
    por_cidade: {} as Record<string, number>,
    ultimos_agendamentos: [] as AgendamentoAdmin[],
    coordenadas: {} as Record<string, [number, number]>,
  });

  // Carrega estatísticas globais (auth centralizada em ProtectedRoute)
  useEffect(() => {
    fetch(`${API_URL}/admin/estatisticas`)
      .then(res => {
        if (!res.ok) throw new Error("Erro 500 do servidor");
        return res.json();
      })
      .then(data => {
        setStatsAdmin({
          total_beneficiarios: data.total_beneficiarios || 0,
          total_dentistas: data.total_dentistas || 0,
          por_cidade: data.por_cidade || {},
          ultimos_agendamentos: data.ultimos_agendamentos || [],
          coordenadas: data.coordenadas || {},
        });
      })
      .catch(() => {
        setStatsAdmin({
          total_beneficiarios: 0,
          total_dentistas: 0,
          por_cidade: {},
          ultimos_agendamentos: [],
          coordenadas: {},
        });
      });
  }, []);

  /**
   * Busca pacientes e dentistas em paralelo — sem setState, só retorna a Promise.
   * Centralizado aqui para ser reutilizado nos 3 useEffects abaixo sem duplicar URLs.
   */
  const fetchTodos = () =>
    Promise.all([
      fetch(`${API_URL}/pacientes`).then(r => r.json()).catch((): UsuarioPaciente[] => []),
      fetch(`${API_URL}/dentistas`).then(r => r.json()).catch((): UsuarioDentista[] => []),
    ]);

  // 1. Mount: alimenta o mapa de calor com dados iniciais.
  //    O flag `live` evita setState em componente desmontado (memory leak / warning do React).
  useEffect(() => {
    let live = true;
    fetchTodos().then(([pacs, dents]) => {
      if (!live) return;
      if (Array.isArray(pacs)) setPacientes(pacs);
      if (Array.isArray(dents)) setDentistas(dents);
    });
    return () => { live = false; };
  }, []);

  // 2. Ao abrir a aba "Usuários": recarrega para exibir dados atualizados.
  //    setCarregandoUsuarios(true) é chamado no onClick do botão de navegação,
  //    antes da mudança de telaAtiva, para mostrar o spinner imediatamente.
  useEffect(() => {
    if (telaAtiva !== 'usuarios') return;
    let live = true;
    fetchTodos().then(([pacs, dents]) => {
      if (!live) return;
      if (Array.isArray(pacs)) setPacientes(pacs);
      if (Array.isArray(dents)) setDentistas(dents);
      setCarregandoUsuarios(false);
    });
    return () => { live = false; };
  }, [telaAtiva]);

  // 3. Refresh automático a cada 30s — mantém o mapa de calor atualizado
  //    sem exigir reload da página. clearInterval no cleanup evita múltiplos timers.
  useEffect(() => {
    const id = setInterval(() => {
      fetchTodos().then(([pacs, dents]) => {
        if (Array.isArray(pacs)) setPacientes(pacs);
        if (Array.isArray(dents)) setDentistas(dents);
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  /**
   * Exclui um usuário (paciente ou dentista) pelo endpoint correto.
   * Após confirmação do admin, chama a API e atualiza o estado local —
   * o mapa de calor recomputa automaticamente via useMemo([pacientes, dentistas]).
   */
  const deletarUsuario = async (
    tipo: 'pacientes' | 'dentistas',
    id: number,
    nome: string
  ) => {
    if (!window.confirm(`Excluir permanentemente a conta de "${nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      const res = await fetch(`${API_URL}/${tipo}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMensagemAdmin(`Erro ao excluir "${nome}": ${(err as {erro?: string}).erro ?? `HTTP ${res.status}`}`);
      } else {
        if (tipo === 'pacientes') setPacientes(prev => prev.filter(p => p.id !== id));
        else setDentistas(prev => prev.filter(d => d.id !== id));
        setMensagemAdmin(`Conta de ${nome} excluída com sucesso.`);
      }
    } catch {
      setMensagemAdmin(`Erro de conexão ao tentar excluir "${nome}".`);
    }
    setTimeout(() => setMensagemAdmin(''), 4000);
  };

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  // KPIs estimados para o painel do admin — baseados no total de beneficiários cadastrados.
  // Fórmulas definidas pela equipe de negócio (Sprint 1):
  //   sorrisos = (beneficiários × 2) + 1450  → cada paciente impacta ~2 pessoas na família + base histórica
  //   horas    = sorrisos × 1.5              → média de 1h30 por atendimento
  //   economia = sorrisos × R$ 250           → custo médio evitado por consulta particular
  const sorrisosTransformados = (statsAdmin.total_beneficiarios * 2) + 1450;
  const horasDoadas = Math.round(sorrisosTransformados * 1.5);
  const economiaGerada = (sorrisosTransformados * 250).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Agrupa pacientes + dentistas por cidade para alimentar o mapa de calor.
  // useMemo garante que o agrupamento só recomputa quando os arrays mudam
  // (ex: após deletarUsuario), não em todo render.
  const allCoords = useMemo(
    () => ({ ...LATAM_COORDINATES, ...statsAdmin.coordenadas }),
    [statsAdmin.coordenadas]
  );

  const porCidadeNormalizado = useMemo(() => {
    const map: Record<string, number> = {};
    const cidades = [
      ...pacientes.map(p => p.cidade),
      ...dentistas.map(d => d.cidade),
    ];
    for (const cidade of cidades) {
      if (!cidade) continue;
      const canonical = normalizarCidade(cidade);
      if (allCoords[canonical]) {
        map[canonical] = (map[canonical] ?? 0) + 1;
      }
    }
    return map;
  }, [pacientes, dentistas, allCoords]);

  const maxQtdCidade = Math.max(1, ...Object.values(porCidadeNormalizado).map(Number));
  const heatPoints: [number, number, number][] = Object.entries(porCidadeNormalizado)
    .map(([cidade, qtd]) => {
      const [lat, lng] = allCoords[cidade];
      return [lat, lng, qtd / maxQtdCidade] as [number, number, number];
    });

  const renderSidebar = () => (
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#FF8C00] flex items-center justify-center font-bold text-xl border-2 border-[#FF8C00]">
          {usuarioLogado.charAt(0).toUpperCase()}
        </div>
        <div><p className="text-sm font-bold text-gray-800 truncate w-[160px]">{usuarioLogado}</p><p className="text-[0.7rem] uppercase tracking-wider text-[#FF8C00] font-bold">Administrador</p></div>
      </div>
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        <button onClick={() => setTelaAtiva('painel')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'painel' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><LayoutDashboard size={20} /> Visão Geral</button>
        <button onClick={() => { setTelaAtiva('usuarios'); setCarregandoUsuarios(true); }} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'usuarios' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={20} /> Gerenciar Usuários</button>
      </nav>
      <div className="p-4 border-t border-gray-100"><button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-red-600"><LogOut size={20} /> Sair</button></div>
    </aside>
  );

  const pacientesFiltrados = pacientes.filter(p =>
  (p.nomePaciente || p.nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
  (p.email || '').toLowerCase().includes(filtroBusca.toLowerCase()) 
);

const dentistasFiltrados = dentistas.filter(d =>
  (d.nomeDentista || d.nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
  (d.email || '').toLowerCase().includes(filtroBusca.toLowerCase()) 
);

  return (
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      {renderSidebar()}
      <main className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full animate-fade-in">

        {mensagemAdmin && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {mensagemAdmin}
          </div>
        )}

        {telaAtiva === 'usuarios' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h2>
                <p className="text-gray-500 text-sm mt-1">Visualize e remova contas de pacientes e dentistas.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar por nome ou e-mail..." value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full md:w-[280px] focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] outline-none" />
              </div>
            </div>

            {carregandoUsuarios ? (
              <div className="text-center py-20 text-gray-400 font-medium">A carregar utilizadores...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pacientes */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} className="text-[#8dc63f]" /> Pacientes ({pacientesFiltrados.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                    {pacientesFiltrados.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <UserX size={32} className="mb-2" />
                        <p className="text-sm font-medium">Nenhum paciente encontrado.</p>
                      </div>
                    ) : pacientesFiltrados.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF8C00] flex items-center justify-center font-bold text-sm shrink-0">
                            {(p.nomePaciente || p.nome || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">{p.nomePaciente || p.nome}</p>
                            <p className="text-xs text-gray-400 truncate">{p.email}</p>
                            <p className="text-[11px] text-gray-400">{p.cidade}, {p.pais}</p>
                          </div>
                        </div>
                        <button onClick={() => deletarUsuario('pacientes', p.id, p.nomePaciente || p.nome || '')}
                          className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Excluir conta">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dentistas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Heart size={18} className="text-[#FF8C00]" /> Dentistas ({dentistasFiltrados.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                    {dentistasFiltrados.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <UserX size={32} className="mb-2" />
                        <p className="text-sm font-medium">Nenhum dentista encontrado.</p>
                      </div>
                    ) : dentistasFiltrados.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF8C00] flex items-center justify-center font-bold text-sm shrink-0">
                            {(d.nomeDentista || d.nome || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">{d.nomeDentista || d.nome}</p>
                            <p className="text-xs text-gray-400 truncate">{d.email}</p>
                            {d.cro && <p className="text-[11px] text-gray-400">CRO: {d.cro}</p>}
                          </div>
                        </div>
                        <button onClick={() => deletarUsuario('dentistas', d.id, d.nomeDentista || d.nome || '')}
                          className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Excluir conta">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'painel' && <>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Painel Administrativo</h2>
          <p className="text-gray-500 mt-1">Visão geral da operação global da Turma do Bem.</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={22} className="text-[#FF8C00]"/> Relatório de Impacto (2026)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#FF8C00] to-orange-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group">
              <Smile className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-1">Sorrisos Transformados</p>
              <h4 className="text-4xl font-black">{sorrisosTransformados}</h4>
              <p className="text-xs text-orange-200 mt-2">+12% este mês</p>
            </div>
            <div className="bg-gradient-to-br from-[#8dc63f] to-green-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group">
              <Clock className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-green-100 font-bold text-sm uppercase tracking-wider mb-1">Horas Clínicas Doadas</p>
              <h4 className="text-4xl font-black">{horasDoadas}h</h4>
              <p className="text-xs text-green-200 mt-2">Pelos Dentistas Voluntários</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <DollarSign className="absolute -right-4 -bottom-4 text-gray-100 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Economia Social Gerada</p>
              <h4 className="text-3xl font-black text-[#FF8C00]">{economiaGerada}</h4>
              <p className="text-xs text-gray-400 mt-2">Valor poupado pelas famílias</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Jovens na Fila</h3>
              <p className="text-5xl font-black text-gray-800">{statsAdmin.total_beneficiarios}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl"><Users size={40} className="text-[#8dc63f]"/></div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Dentistas Voluntários</h3>
              <p className="text-5xl font-black text-gray-800">{statsAdmin.total_dentistas}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl"><Heart size={40} className="text-[#FF8C00]"/></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#FF8C00]"/> Mapa de Calor (Demandas)</h3>
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-200 relative" style={{ minHeight: '380px' }}>
              <MapContainer
                center={[-15.0, -60.0]}
                zoom={3}
                style={{ width: '100%', height: '100%', minHeight: '380px' }}
                scrollWheelZoom={false}
                zoomControl
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  subdomains="abcd"
                  maxZoom={19}
                />
                {heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />}
                <CityMarkers porCidade={porCidadeNormalizado} coordsMap={allCoords} />
              </MapContainer>
              {/* Legenda do mapa */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 pointer-events-none">
                <div className="w-24 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #4338ca, #8b5cf6, #f97316, #dc2626)' }} />
                <span className="text-white text-[10px] font-bold whitespace-nowrap">Baixa → Alta demanda</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center font-medium">Zonas quentes indicam maior concentração de jovens na fila. Passe o mouse sobre os pontos para ver detalhes.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CalendarDays size={24} className="text-[#8dc63f]"/> Agenda da Rede</h3>
            <div className="space-y-4">
              {statsAdmin.ultimos_agendamentos && statsAdmin.ultimos_agendamentos.map((ag: AgendamentoAdmin, index: number) => (
                <div key={index} className="p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800 text-lg">{ag.paciente}</p>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-md ${ag.prioridade === 'Urgente' ? 'bg-red-100 text-red-600' : ag.prioridade === 'Alta' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{ag.prioridade}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{ag.proc} com <strong className="text-gray-700">{ag.dentista}</strong></p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14}/> {ag.data}</span>
                    <span className="text-xs font-bold text-[#FF8C00] flex items-center gap-1 bg-orange-50 px-2.5 py-1.5 rounded-lg"><Clock size={14}/> {ag.hora}</span>
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg"><MapPin size={14}/> {ag.cidade}</span>
                  </div>
                </div>
              ))}
              {(!statsAdmin.ultimos_agendamentos || statsAdmin.ultimos_agendamentos.length === 0) && (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <CalendarDays size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-400 font-bold">Sem atendimentos previstos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </>}
      </main>
    </div>
  );
}