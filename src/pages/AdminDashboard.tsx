import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { adminApi } from '../lib/api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LayoutDashboard, Users, MapPin, Heart, CalendarDays, Clock, TrendingUp, Smile, DollarSign, Archive, Search, UserX, FileDown, Sheet, MessageSquare, Mail, Filter, Tag, ChevronDown, Hash, Ticket } from 'lucide-react';
import { gerarTicket, canalConfig, mascaraCPF } from '../utils/ticketUtils';
import {
  exportarPacientesPDF, exportarPacientesCSV,
  exportarDentistasPDF, exportarDentistasCSV,
  exportarAtendimentosPDF, exportarAtendimentosCSV,
} from '../utils/adminExportUtils';
import { Skeleton, EmptyState } from '../components/ui';
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
  cpf?: string;        // identificador único do paciente
}

interface UsuarioDentista {
  id: number;
  nomeDentista?: string;
  nome?: string;
  email: string;
  cidade: string;
  cro?: string;
}

interface MensagemContato {
  id?: number;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  criadoEm?: string;
  canal?: string;      // 'web' | 'telegram' | 'email' | 'whatsapp'
  ticket?: string;     // Ex.: "TDB-2026-00001"
}

type StatusContato = 'aberto' | 'em_andamento' | 'concluido';

const CONTATOS_MOCK: MensagemContato[] = [
  { id: 1, nome: 'Maria Silva',    email: 'maria@email.com',       assunto: 'Quero ser Doador',        canal: 'web',      ticket: 'TDB-2026-00001', mensagem: 'Gostaria de saber como fazer uma doação mensal. Tenho interesse em apoiar a causa dos jovens em vulnerabilidade.',              criadoEm: '2026-05-20T10:30:00' },
  { id: 2, nome: 'Dr. João Santos', email: 'joao@clinica.com.br',  assunto: 'Parcerias com Clínicas',  canal: 'email',    ticket: 'TDB-2026-00002', mensagem: 'Tenho uma clínica odontológica em São Paulo e gostaria de firmar parceria com a Turma do Bem. Como proceder?',                 criadoEm: '2026-05-21T14:00:00' },
  { id: 3, nome: 'Ana Oliveira',   email: 'ana@gmail.com',          assunto: 'Dúvida Geral',            canal: 'telegram', ticket: 'TDB-2026-00003', mensagem: 'Minha filha tem 15 anos e nunca foi ao dentista. Como faço para cadastrá-la na plataforma?',                                    criadoEm: '2026-05-22T09:15:00' },
  { id: 4, nome: 'Pedro Lima',     email: 'pedro@jornal.com',       assunto: 'Imprensa',                canal: 'email',    ticket: 'TDB-2026-00004', mensagem: 'Faço parte da equipe do G1 e gostaria de realizar uma reportagem sobre o trabalho da ONG. Há contato disponível?',            criadoEm: '2026-05-23T11:00:00' },
  { id: 5, nome: 'Carla Mendes',   email: 'carla@empresa.com',      assunto: 'Outros',                  canal: 'telegram', ticket: 'TDB-2026-00005', mensagem: 'Representamos uma empresa de materiais odontológicos e gostaríamos de fazer doações de insumos. Como podemos contribuir?',  criadoEm: '2026-05-23T15:30:00' },
];

function corAssunto(assunto: string): { bg: string; text: string; border: string; label: string } {
  if (assunto === 'Quero ser Doador') return { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50', label: 'Doador' };
  if (assunto === 'Parcerias com Clínicas') return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900/50', label: 'Parceria' };
  if (assunto === 'Imprensa') return { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-900/50', label: 'Imprensa' };
  return { bg: 'bg-gray-50 dark:bg-slate-700/40', text: 'text-gray-600 dark:text-slate-400', border: 'border-gray-200 dark:border-slate-600', label: assunto === 'Dúvida Geral' ? 'Dúvida' : 'Outros' };
}

function statusConfig(status: StatusContato) {
  if (status === 'concluido') return { label: 'Concluído', cls: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' };
  if (status === 'em_andamento') return { label: 'Em Andamento', cls: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' };
  return { label: 'Aberto', cls: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' };
}

function BotoesExportar({ onPDF, onCSV }: { onPDF: () => void; onCSV: () => void }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
      >
        <FileDown size={13} /> PDF
      </button>
      <button
        onClick={onCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
      >
        <Sheet size={13} /> CSV
      </button>
    </div>
  );
}

export function AdminDashboard() {
  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'usuarios' | 'contatos'>('painel');
  const [pacientes, setPacientes] = useState<UsuarioPaciente[]>([]);
  const [dentistas, setDentistas] = useState<UsuarioDentista[]>([]);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [confirmacaoPendente, setConfirmacaoPendente] = useState<{
    tipo: 'pacientes' | 'dentistas';
    id: number;
    nome: string;
  } | null>(null);

  const [contatos, setContatos] = useState<MensagemContato[]>([]);
  const [carregandoContatos, setCarregandoContatos] = useState(false);
  const [filtroAssunto, setFiltroAssunto] = useState('todos');
  const [expandido, setExpandido] = useState<string | null>(null);
  const [statusContatos, setStatusContatos] = useState<Record<string, StatusContato>>(() => {
    try { return JSON.parse(localStorage.getItem('tdb_status_contatos') || '{}'); } catch { return {}; }
  });

  const [statsAdmin, setStatsAdmin] = useState({
    total_beneficiarios: 0,
    total_dentistas: 0,
    por_cidade: {} as Record<string, number>,
    ultimos_agendamentos: [] as AgendamentoAdmin[],
    coordenadas: {} as Record<string, [number, number]>,
  });

  useEffect(() => {
    adminApi.getEstatisticas()
      .then(data => {
        setStatsAdmin({
          total_beneficiarios: data.total_beneficiarios || 0,
          total_dentistas:     data.total_dentistas || 0,
          por_cidade:          data.por_cidade || {},
          ultimos_agendamentos: data.ultimos_agendamentos || [],
          coordenadas:         data.coordenadas || {},
        });
      })
      .catch(() => {
        setStatsAdmin({ total_beneficiarios: 0, total_dentistas: 0, por_cidade: {}, ultimos_agendamentos: [], coordenadas: {} });
      });
  }, []);

  const fetchTodos = () =>
    Promise.all([
      adminApi.getPacientes().catch((): UsuarioPaciente[] => []),
      adminApi.getDentistas().catch((): UsuarioDentista[] => []),
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

  // Abre o modal de confirmação — o fetch só acontece em handleConfirmarInativacao.
  const deletarUsuario = (tipo: 'pacientes' | 'dentistas', id: number, nome: string) => {
    setConfirmacaoPendente({ tipo, id, nome });
  };

  // Chamada HTTP idêntica à anterior (DELETE) — apenas renomeada e movida para cá.
  const handleConfirmarInativacao = async () => {
    if (!confirmacaoPendente) return;
    const { tipo, id, nome } = confirmacaoPendente;
    setConfirmacaoPendente(null);
    try {
      await adminApi.deletarUsuario(tipo, id);
      if (tipo === 'pacientes') setPacientes(prev => prev.filter(p => p.id !== id));
      else setDentistas(prev => prev.filter(d => d.id !== id));
      toast.success(`Conta de ${nome} inativada com sucesso.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro de conexão';
      toast.error(`Erro ao inativar "${nome}": ${msg}`);
    }
  };

  // Carrega contatos ao entrar na aba — tenta API, usa mock como fallback.
  // Mescla também mensagens enviadas pelos pacientes via dashboard (localStorage).
  useEffect(() => {
    if (telaAtiva !== 'contatos') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCarregandoContatos(true);

    const msgsPacientes: MensagemContato[] = (() => {
      try { return JSON.parse(localStorage.getItem('tdb_msgs_admin') || '[]'); } catch { return []; }
    })();

    adminApi.getMensagens()
      .then(data => {
        const base = Array.isArray(data) && data.length > 0 ? data : CONTATOS_MOCK;
        setContatos([...msgsPacientes, ...base]);
      })
      .catch(() => setContatos([...msgsPacientes, ...CONTATOS_MOCK]))
      .finally(() => setCarregandoContatos(false));
  }, [telaAtiva]);

  const alterarStatus = (key: string, novoStatus: StatusContato) => {
    const novo = { ...statusContatos, [key]: novoStatus };
    setStatusContatos(novo);
    localStorage.setItem('tdb_status_contatos', JSON.stringify(novo));
  };


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

  const contatosAbertos = contatos.filter(c => {
    const key = String(c.id ?? `${c.nome}_${c.email}`);
    return (statusContatos[key] ?? 'aberto') === 'aberto';
  }).length;

  const navItems = [
    { id: 'painel',   icon: <LayoutDashboard size={20} />, label: 'Visão Geral', badge: 0 },
    { id: 'usuarios', icon: <Users size={20} />,           label: 'Usuários',    badge: pacientes.length + dentistas.length },
    { id: 'contatos', icon: <MessageSquare size={20} />,   label: 'Contatos',    badge: contatosAbertos },
  ];

  const pacientesFiltrados = pacientes.filter(p =>
  (p.nomePaciente || p.nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
  (p.email || '').toLowerCase().includes(filtroBusca.toLowerCase()) 
);

const dentistasFiltrados = dentistas.filter(d =>
  (d.nomeDentista || d.nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
  (d.email || '').toLowerCase().includes(filtroBusca.toLowerCase()) 
);

  return (
    <DashboardLayout
      navItems={navItems}
      telaAtiva={telaAtiva}
      onTelaChange={(id) => {
        setTelaAtiva(id as typeof telaAtiva);
        if (id === 'usuarios') setCarregandoUsuarios(true);
      }}
      roleName="Administrador"
    >

        {telaAtiva === 'usuarios' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Gerenciar Usuários</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Visualize e remova contas de pacientes e dentistas.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar por nome ou e-mail..." value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 w-full md:w-[280px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
              </div>
            </div>

            {carregandoUsuarios ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton variant="card" className="h-64" />
                <Skeleton variant="card" className="h-64" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pacientes */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Users size={18} className="text-[#8dc63f]" /> Pacientes ({pacientesFiltrados.length})</h3>
                    <BotoesExportar
                      onPDF={() => exportarPacientesPDF(pacientesFiltrados)}
                      onCSV={() => exportarPacientesCSV(pacientesFiltrados)}
                    />
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                    {pacientesFiltrados.length === 0 ? (
                      <EmptyState icon={UserX} title="Nenhum paciente encontrado" />
                    ) : pacientesFiltrados.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF8C00] flex items-center justify-center font-bold text-sm shrink-0">
                            {(p.nomePaciente || p.nome || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{p.nomePaciente || p.nome}</p>
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-600">
                                <Hash size={8} />{gerarTicket(p.id)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{p.email}</p>
                            <p className="text-[11px] text-gray-400 dark:text-slate-500">
                              {p.cidade}, {p.pais}
                              {p.cpf && <span className="ml-2 font-mono opacity-70">· CPF: {mascaraCPF(p.cpf)}</span>}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => deletarUsuario('pacientes', p.id, p.nomePaciente || p.nome || '')}
                          className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          title="Inativar conta">
                          <Archive size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dentistas */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Heart size={18} className="text-[#FF8C00]" /> Dentistas ({dentistasFiltrados.length})</h3>
                    <BotoesExportar
                      onPDF={() => exportarDentistasPDF(dentistasFiltrados)}
                      onCSV={() => exportarDentistasCSV(dentistasFiltrados)}
                    />
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                    {dentistasFiltrados.length === 0 ? (
                      <EmptyState icon={UserX} title="Nenhum dentista encontrado" />
                    ) : dentistasFiltrados.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF8C00] flex items-center justify-center font-bold text-sm shrink-0">
                            {(d.nomeDentista || d.nome || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{d.nomeDentista || d.nome}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{d.email}</p>
                            {d.cro && <p className="text-[11px] text-gray-400 dark:text-slate-500">CRO: {d.cro}</p>}
                          </div>
                        </div>
                        <button onClick={() => deletarUsuario('dentistas', d.id, d.nomeDentista || d.nome || '')}
                          className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          title="Inativar conta">
                          <Archive size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'contatos' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Contatos Recebidos</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Mensagens da plataforma com roteamento automático por assunto e rastreamento de status.</p>
              </div>
              {/* Filtro por assunto — roteamento automático */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-gray-400" />
                {['todos', 'Quero ser Doador', 'Parcerias com Clínicas', 'Imprensa', 'Dúvida Geral', 'Outros'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFiltroAssunto(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filtroAssunto === f ? 'bg-[#FF8C00] text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                  >
                    {f === 'todos' ? 'Todos' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Legenda de roteamento */}
            <div className="mb-5 flex flex-wrap gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-full flex items-center gap-1.5"><Tag size={12} /> Roteamento Automático por Assunto:</p>
              {[
                { label: 'Doador → Fila de Doações', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
                { label: 'Parcerias → Comercial', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' },
                { label: 'Imprensa → Comunicação', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
                { label: 'Outros → Geral', color: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400' },
              ].map(r => (
                <span key={r.label} className={`text-[11px] font-bold px-3 py-1 rounded-full ${r.color}`}>{r.label}</span>
              ))}
            </div>

            {carregandoContatos ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} variant="card" className="h-20" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {contatos
                  .filter(c => filtroAssunto === 'todos' || c.assunto === filtroAssunto)
                  .map((c) => {
                    const key = String(c.id ?? `${c.nome}_${c.email}`);
                    const status = statusContatos[key] ?? 'aberto';
                    const cor = corAssunto(c.assunto);
                    const st = statusConfig(status);
                    const isOpen = expandido === key;
                    const dataFmt = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
                    const ticket = c.ticket ?? gerarTicket(c.id ?? key);
                    const canal  = canalConfig(c.canal ?? 'web');
                    return (
                      <div key={key} className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden transition-all ${cor.border}`}>
                        {/* Header clicável */}
                        <button
                          className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
                          onClick={() => setExpandido(isOpen ? null : key)}
                          aria-expanded={isOpen}
                        >
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-xl ${cor.bg} ${cor.text} flex items-center justify-center font-black text-base flex-shrink-0 border ${cor.border}`}>
                            {c.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{c.nome}</p>
                              {/* Ticket */}
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-mono tracking-tight border border-slate-200 dark:border-slate-600">
                                <Hash size={9} />{ticket}
                              </span>
                              {/* Canal de origem */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${canal.cls}`}>{canal.label}</span>
                              {/* Assunto */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cor.bg} ${cor.text} border ${cor.border}`}>{cor.label}</span>
                              {/* Status */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                              <Mail size={11} /> {c.email}
                              {dataFmt && <><span className="opacity-30">·</span> <Clock size={11} /> {dataFmt}</>}
                            </p>
                          </div>
                          <ChevronDown size={18} className={`flex-shrink-0 text-gray-400 transition-transform mt-1 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Corpo expandido */}
                        {isOpen && (
                          <div className={`border-t ${cor.border} px-5 pb-5 pt-4 space-y-4 ${cor.bg}`}>
                            {/* Linha de identificação do ticket */}
                            <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                              <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400 font-mono">
                                <Ticket size={13} className="text-[#FF8C00]" />
                                Ticket: <span className="text-[#FF8C00]">{ticket}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${canal.cls}`}>{canal.label}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{c.mensagem}</p>
                            {/* Controle de status */}
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status:</p>
                              {(['aberto', 'em_andamento', 'concluido'] as StatusContato[]).map(s => {
                                const sc = statusConfig(s);
                                return (
                                  <button
                                    key={s}
                                    onClick={() => alterarStatus(key, s)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${status === s ? sc.cls + ' ring-2 ring-offset-1' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                                  >
                                    {sc.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                {contatos.filter(c => filtroAssunto === 'todos' || c.assunto === filtroAssunto).length === 0 && (
                  <EmptyState icon={MessageSquare} title="Nenhuma mensagem encontrada" description="Não há contatos com este filtro." />
                )}
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'painel' && <>
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-white">Painel Administrativo</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Visão geral da operação global do Dentista na Nuvem.</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><TrendingUp size={22} className="text-[#FF8C00]"/> Relatório de Impacto (2026)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#FF8C00] to-orange-600 p-6 rounded-2xl shadow-[0_8px_32px_rgba(255,140,0,0.28)] text-white relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(255,140,0,0.38)] hover:-translate-y-0.5 transition-all duration-300">
              <Smile className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform duration-300" size={100} />
              <p className="text-orange-100 font-bold text-[10px] uppercase tracking-[0.15em] mb-2">Sorrisos Transformados</p>
              <h4 className="text-4xl font-display font-black">{sorrisosTransformados}</h4>
              <p className="text-xs text-orange-200 mt-2">+12% este mês</p>
            </div>
            <div className="bg-gradient-to-br from-[#8dc63f] to-green-600 p-6 rounded-2xl shadow-[0_8px_32px_rgba(141,198,63,0.28)] text-white relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(141,198,63,0.38)] hover:-translate-y-0.5 transition-all duration-300">
              <Clock className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform duration-300" size={100} />
              <p className="text-green-100 font-bold text-[10px] uppercase tracking-[0.15em] mb-2">Horas Clínicas Doadas</p>
              <h4 className="text-4xl font-display font-black">{horasDoadas}h</h4>
              <p className="text-xs text-green-200 mt-2">Pelos Dentistas Voluntários</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300">
              <DollarSign className="absolute -right-4 -bottom-4 text-gray-100 dark:text-slate-700 group-hover:scale-110 transition-transform duration-300" size={100} />
              <p className="text-gray-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-2">Economia Social Gerada</p>
              <h4 className="text-3xl font-display font-black text-[#FF8C00]">{economiaGerada}</h4>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Valor poupado pelas famílias</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-[0_4px_24px_rgba(0,0,0,0.05)] flex items-center justify-between hover:shadow-[0_8px_32px_rgba(141,198,63,0.12)] hover:-translate-y-0.5 transition-all duration-300">
            <div>
              <h3 className="text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">Jovens na Fila</h3>
              <p className="text-5xl font-display font-black text-gray-800 dark:text-white">{statsAdmin.total_beneficiarios}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl"><Users size={36} className="text-[#8dc63f]"/></div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-[0_4px_24px_rgba(0,0,0,0.05)] flex items-center justify-between hover:shadow-[0_8px_32px_rgba(255,140,0,0.12)] hover:-translate-y-0.5 transition-all duration-300">
            <div>
              <h3 className="text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">Dentistas Voluntários</h3>
              <p className="text-5xl font-display font-black text-gray-800 dark:text-white">{statsAdmin.total_dentistas}</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl"><Heart size={36} className="text-[#FF8C00]"/></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-slate-700 h-full flex flex-col">
            <h3 className="text-xl font-display font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#FF8C00]"/> Mapa de Calor (Demandas)</h3>
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-600 relative" style={{ minHeight: '380px' }}>
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
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-4 text-center font-medium">Zonas quentes indicam maior concentração de jovens na fila. Passe o mouse sobre os pontos para ver detalhes.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-slate-700 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-gray-800 dark:text-white flex items-center gap-2"><CalendarDays size={24} className="text-[#8dc63f]"/> Agenda da Rede</h3>
              <BotoesExportar
                onPDF={() => exportarAtendimentosPDF(statsAdmin.ultimos_agendamentos)}
                onCSV={() => exportarAtendimentosCSV(statsAdmin.ultimos_agendamentos)}
              />
            </div>
            <div className="space-y-4">
              {statsAdmin.ultimos_agendamentos && statsAdmin.ultimos_agendamentos.map((ag: AgendamentoAdmin, index: number) => (
                <div key={index} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 dark:bg-slate-700/50 shadow-sm hover:border-orange-200 dark:hover:border-orange-700/60 transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{ag.paciente}</p>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-md ${ag.prioridade === 'Urgente' ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400' : ag.prioridade === 'Alta' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' : 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400'}`}>{ag.prioridade}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{ag.proc} com <strong className="text-gray-700 dark:text-slate-200">{ag.dentista}</strong></p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14}/> {ag.data}</span>
                    <span className="text-xs font-bold text-[#FF8C00] flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1.5 rounded-lg"><Clock size={14}/> {ag.hora}</span>
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><MapPin size={14}/> {ag.cidade}</span>
                  </div>
                </div>
              ))}
              {(!statsAdmin.ultimos_agendamentos || statsAdmin.ultimos_agendamentos.length === 0) && (
                <EmptyState
                  icon={CalendarDays}
                  title="Sem atendimentos previstos"
                  description="Os próximos agendamentos da rede aparecerão aqui."
                />
              )}
            </div>
          </div>
        </div>
        </>}
      {/* ── Modal de confirmação de inativação ── */}
      {confirmacaoPendente && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setConfirmacaoPendente(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-100 dark:border-slate-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl shrink-0">
                <Archive size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Inativar Conta</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 truncate max-w-xs">{confirmacaoPendente.nome}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm mb-8 leading-relaxed">
              Deseja inativar este usuário? Ele perderá acesso à plataforma mas seus dados serão preservados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmacaoPendente(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmarInativacao}
                className="flex-1 px-4 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-colors"
              >
                Inativar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}