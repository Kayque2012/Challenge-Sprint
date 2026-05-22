import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { calcularScore, type TipoDor } from '../utils/scoreUtils';
import { imprimirRelatorio } from '../utils/relatorioUtils';
import { StatusAgendamento } from '../components/StatusAgendamento';
import { ModalAvaliarPaciente } from '../components/ModalAvaliarPaciente';
import { ModalFichaAtiva } from '../components/ModalFichaAtiva';
import { Skeleton, EmptyState, Badge } from '../components/ui';
import {
  LayoutDashboard, Users, Calendar, LogOut,
  Search, MessageSquare, Send,
  MapPin, Phone, AlertCircle, Star, Filter, Clock, CheckCircle2, X,
  Heart, FileText, SearchX, CalendarDays,
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  pais: string;
  cidade: string;
  tipo_dor: string;
  score_match: number;
  renda: number;
  tempo_dor: number;
  telefone?: string;
  historico?: HistoricoConsulta[];
}

interface Agendamento {
  id: number;
  paciente: Paciente;
  data: string;
  hora: string;
  tipo: string;
}

interface SlotProposto {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  dentistaNome: string;
  dentistaCidade: string;
  procedimento: string;
  slots: SlotProposto[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

// ─── Funções puras ────────────────────────────────────────────────────────────

function mapearPaciente(p: Record<string, unknown>): Paciente {
  let idadeCalculada = p.idade as number | undefined;
  if (!idadeCalculada && p.dataNascimento) {
    const nasc = new Date(p.dataNascimento as string);
    const hoje = new Date();
    idadeCalculada = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idadeCalculada--;
  }
  return {
    id:          p.id as number,
    nome:        p.nome as string,
    idade:       idadeCalculada ?? 0,
    pais:        (p.pais as string)      || 'Não informado',
    cidade:      (p.cidade as string)    || 'Não informado',
    tipo_dor:    ((p.tipoDor ?? p.tipo_dor) as string)                   || 'Não informado',
    renda:       ((p.rendaSalarioMinimo ?? p.renda) as number)           ?? 0,
    tempo_dor:   ((p.tempoDorDias ?? p.tempo_dor) as number)             ?? 0,
    score_match: ((p.scoreMatch ?? p.score_match) as number)             ?? 50,
    telefone:    p.telefone as string | undefined,
    historico:   p.historico as HistoricoConsulta[] | undefined,
  };
}

function formatarDataAgenda(dataISO: string) {
  if (!dataISO) return { diaSemana: 'DIA', diaMes: '00' };
  const [ano, mes, dia] = dataISO.split('-');
  const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return { diaSemana: dias[dataObj.getDay()], diaMes: dia };
}

function mapDorParaEnum(tipoDor: string): TipoDor {
  const d = tipoDor.toLowerCase();
  if (d.includes('quebrado') || d === 'urgente') return 'urgente';
  if (d === 'forte') return 'forte';
  if (d === 'moderada') return 'moderada';
  return 'leve';
}

function calcularScorePaciente(p: Paciente): number {
  return calcularScore(mapDorParaEnum(p.tipo_dor || ''), p.renda ?? 0, typeof p.idade === 'number' ? p.idade : 0);
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DentistaDashboard() {
  const navigate = useNavigate();

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'pacientes' | 'agenda'>('painel');
  const [pesquisa, setPesquisa] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [respostaIA, setRespostaIA] = useState('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [meusPacientes, setMeusPacientes] = useState<Paciente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [slotsPropostos, setSlotsPropostos] = useState<SlotProposto[]>([]);
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [procedimentoOferta, setProcedimentoOferta] = useState('Primeira Consulta - Avaliação');
  const [ofertasMapa, setOfertasMapa] = useState<Record<string, OfertaAgendamento>>({});
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [fichaAtiva, setFichaAtiva] = useState<Paciente | null>(null);
  const [carregandoPacientes, setCarregandoPacientes] = useState(true);
  const [carregandoMeusPacientes, setCarregandoMeusPacientes] = useState(true);

  const dentistId = sessionStorage.getItem('userId') || '0';
  const usuarioLogado = sessionStorage.getItem('usuarioLogado') || 'Dentista';
  const userRole = sessionStorage.getItem('userRole');
  const [cidadeAtiva, setCidadeAtiva] = useState(sessionStorage.getItem('dentistaCidade') || 'São Paulo');

  const showMensagem = (msg: string, ms = 3500) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), ms);
  };

  const handleConcluirConsulta = async (idOferta: number) => {
    try {
      const res = await fetch(`${API_URL}/ofertas/${idOferta}/concluir`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      setAgendamentos(prev => prev.filter(a => a.id !== idOferta));
      showMensagem('Consulta marcada como concluída!');
    } catch {
      showMensagem('Erro ao concluir consulta. Tente novamente.');
    }
  };

  // Limpa contexto da IA ao trocar o prontuário aberto
  useEffect(() => {
    if (fichaAtiva) { setRespostaIA(''); setPergunta(''); }
  }, [fichaAtiva]);

  // Cache local como fallback para reloads rápidos
  useEffect(() => { localStorage.setItem('tdb_agendamentos', JSON.stringify(agendamentos)); }, [agendamentos]);
  useEffect(() => { localStorage.setItem('tdb_ofertasHorario', JSON.stringify(ofertasMapa)); }, [ofertasMapa]);

  // Carrega pacientes adotados por este dentista
  useEffect(() => {
    const idNum = Number(dentistId);
    if (!idNum) { setCarregandoMeusPacientes(false); return; }
    fetch(`${API_URL}/pacientes/adotados?idDentista=${idNum}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMeusPacientes(data.map(mapearPaciente));
        setCarregandoMeusPacientes(false);
      })
      .catch(() => { setCarregandoMeusPacientes(false); });
  }, [dentistId]);

  // Carrega ofertas e agenda confirmada da API
  useEffect(() => {
    const idDentista = sessionStorage.getItem('userId');
    if (!idDentista) return;
    fetch(`${API_URL}/ofertas/dentista/${idDentista}`)
      .then(res => res.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((ofertas: any[]) => {
        if (!Array.isArray(ofertas)) return;
        const mapa: Record<string, OfertaAgendamento> = {};
        const agendados: Agendamento[] = [];
        for (const o of ofertas) {
          mapa[o.pacienteNome] = {
            dentistaNome: usuarioLogado, dentistaCidade: cidadeAtiva,
            procedimento: o.procedimento, slots: [],
            status: o.status as 'pendente' | 'confirmado',
            slotEscolhido: o.status === 'confirmado' ? { data: o.data, hora: o.hora } : undefined,
            criadaEm: '',
          };
          if (o.status === 'confirmado') {
            agendados.push({
              id: o.id,
              paciente: { id: o.idPaciente, nome: o.pacienteNome, idade: 0, pais: '', cidade: '', tipo_dor: '', score_match: 0, renda: 0, tempo_dor: 0 },
              data: o.data, hora: o.hora, tipo: o.procedimento,
            });
          }
        }
        setOfertasMapa(mapa);
        setAgendamentos(agendados);
      })
      .catch(() => {});
  }, [usuarioLogado, cidadeAtiva]);

  // Carrega fila de triagem (auth centralizada em ProtectedRoute)
  useEffect(() => {
    setCarregandoPacientes(true);
    fetch(`${API_URL}/pacientes?cidade=${cidadeAtiva}`)
      .then(res => res.json())
      .then(data => {
        setPacientes(Array.isArray(data) ? data.map(mapearPaciente) : []);
        setCarregandoPacientes(false);
      })
      .catch(() => { setCarregandoPacientes(false); });
  }, [cidadeAtiva]);

  // Recarrega dados ao voltar para a aba
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      fetch(`${API_URL}/pacientes?cidade=${cidadeAtiva}`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setPacientes(data.map(mapearPaciente)); })
        .catch(() => {});
      const idNum = Number(dentistId);
      if (idNum) {
        fetch(`${API_URL}/pacientes/adotados?idDentista=${idNum}`)
          .then(r => r.json())
          .then(data => { if (Array.isArray(data)) setMeusPacientes(data.map(mapearPaciente)); })
          .catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [cidadeAtiva, dentistId]);

  // ─── Derivados ──────────────────────────────────────────────────────────────

  const slotsOcupados = agendamentos.map(a => `${a.data}|${a.hora}`);
  const slotsLivres   = slotsPropostos.filter(s => !slotsOcupados.includes(`${s.data}|${s.hora}`));
  const dataHoje      = new Date().toISOString().split('T')[0];
  const ofertaAtiva   = fichaAtiva ? ofertasMapa[fichaAtiva.nome] : undefined;

  const pacientesFiltrados = pacientes
    .filter(p => p.nome.toLowerCase().includes(pesquisa.toLowerCase()))
    .sort((a, b) => calcularScorePaciente(b) - calcularScorePaciente(a))
    .map(p => ({ ...p, score_match: calcularScorePaciente(p) }));

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const handleAdicionarSlot = () => {
    if (!novaData || !novaHora) return;
    const chave = `${novaData}|${novaHora}`;
    if (slotsPropostos.find(s => `${s.data}|${s.hora}` === chave)) return;
    setSlotsPropostos(prev => [...prev, { id: Date.now().toString(), data: novaData, hora: novaHora }]);
    setNovaHora('');
  };

  const handleRemoverSlot = (id: string) => setSlotsPropostos(prev => prev.filter(s => s.id !== id));

  const handleEnviarOferta = async () => {
    if (!fichaAtiva || slotsLivres.length === 0) return;
    try {
      const res = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idDentista: Number(dentistId), idPaciente: fichaAtiva.id,
          procedimento: procedimentoOferta,
          slots: slotsLivres.map(s => ({ data: s.data, hora: s.hora })),
        }),
      });
      if (!res.ok) throw new Error('API error');
      setOfertasMapa(prev => ({ ...prev, [fichaAtiva.nome]: {
        dentistaNome: usuarioLogado, dentistaCidade: cidadeAtiva,
        procedimento: procedimentoOferta, slots: slotsLivres,
        status: 'pendente', criadaEm: new Date().toISOString(),
      }}));
      setSlotsPropostos([]); setNovaData(''); setNovaHora('');
      showMensagem(`Horários enviados para ${fichaAtiva.nome} com sucesso!`);
    } catch {
      showMensagem('Erro ao enviar proposta. Tente novamente.');
    }
  };

  // Unifica adotar e cancelar adoção — mesma chamada PUT com status diferente
  const atualizarStatusPaciente = async (
    paciente: Paciente,
    acao: 'adotado' | 'disponivel'
  ) => {
    const idNum = Number(dentistId);
    if (acao === 'adotado' && !idNum) { alert('Erro: ID do dentista não encontrado. Por favor, faça login novamente.'); return; }
    if (acao === 'disponivel' && !window.confirm(`Tem certeza que deseja cancelar a adoção de ${paciente.nome}? Ele voltará para a fila de triagem.`)) return;

    try {
      const res = await fetch(`${API_URL}/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: paciente.nome, cidade: paciente.cidade, pais: paciente.pais,
          tipoDor: paciente.tipo_dor !== 'Não informado' ? paciente.tipo_dor : undefined,
          tempoDorDias: paciente.tempo_dor || 0,
          rendaSalarioMinimo: paciente.renda || 0,
          telefone: paciente.telefone,
          status: acao,
          ...(acao === 'adotado' ? { idDentistaResponsavel: idNum } : {}),
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as { erro?: string; causa?: string }).causa || (errBody as { erro?: string }).erro || `Erro HTTP ${res.status}`);
      }

      if (acao === 'adotado') {
        setPacientes(prev => prev.filter(p => p.id !== paciente.id));
        setMeusPacientes(prev => [...prev, { ...paciente }]);
        setPacienteSelecionado(null);
        setTelaAtiva('pacientes');
        showMensagem(`${paciente.nome} adotado com sucesso!`);
      } else {
        setMeusPacientes(prev => prev.filter(p => p.id !== paciente.id));
        setAgendamentos(prev => prev.filter(a => a.paciente.nome !== paciente.nome));
        fetch(`${API_URL}/pacientes?cidade=${cidadeAtiva}`)
          .then(r => r.json())
          .then(data => { if (Array.isArray(data)) setPacientes(data.map(mapearPaciente)); })
          .catch(() => {});
        showMensagem(`Adoção de ${paciente.nome} cancelada. Paciente retornou à fila.`, 4000);
      }
    } catch {
      showMensagem(acao === 'adotado' ? 'Erro ao adotar paciente. Tente novamente.' : 'Erro ao cancelar adoção. Tente novamente.');
    }
  };

  const enviarPerguntaIA = async () => {
    if (!pergunta.trim()) return;
    setCarregandoIA(true);
    try {
      const res = await fetch(`${API_URL}/IA/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: pergunta, fila_json: JSON.stringify(pacientesFiltrados) }),
      });
      const data = await res.json();
      let textoFinal = '';
      if (data.candidates?.length > 0) textoFinal = data.candidates[0].content.parts[0].text;
      else if (data.resposta) textoFinal = data.resposta;
      else if (data.error) textoFinal = 'Erro do servidor: ' + data.error;
      else textoFinal = 'A IA processou, mas não retornou um formato legível.';
      setRespostaIA(textoFinal);
      setPergunta('');
    } catch {
      setRespostaIA('Desculpe, Doutor. Tive um erro de conexão ao consultar a IA.');
    } finally {
      setCarregandoIA(false);
    }
  };

  const abrirFicha = (p: Paciente) => {
    setFichaAtiva(p);
    setSlotsPropostos([]);
    setNovaData('');
    setNovaHora('');
    setProcedimentoOferta('Primeira Consulta - Avaliação');
  };

  // ─── Nav ─────────────────────────────────────────────────────────────────────

  const navItems = [
    { id: 'painel',    icon: <LayoutDashboard size={20} />, label: 'Fila de Triagem',    badge: 0 },
    { id: 'pacientes', icon: <Users size={20} />,           label: 'Meus Pacientes',      badge: meusPacientes.length },
    { id: 'agenda',    icon: <Calendar size={20} />,        label: 'Agenda de Consultas', badge: agendamentos.length },
  ] as const;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans items-start">

      {/* Sidebar */}
      <aside className="w-64 min-w-64 bg-slate-800 border-r border-slate-700 hidden md:flex flex-col sticky top-0 self-start h-screen z-10 shadow-sm">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-700 text-orange-400 flex items-center justify-center font-bold text-xl border border-slate-600">
            {usuarioLogado.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white truncate w-40">{usuarioLogado}</p>
            <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold">{userRole === 'dev' ? 'Desenvolvedor' : 'Dentista Voluntário'}</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTelaAtiva(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === item.id ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600' : 'text-slate-300 hover:bg-slate-700'}`}>
              {item.icon} {item.label}
              {item.badge > 0 && <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative">
        {mensagem && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-50 text-green-700 border border-green-200 px-6 py-3 rounded-xl shadow-lg font-bold animate-fade-in flex items-center gap-2">
            <CheckCircle2 size={20} /> {mensagem}
          </div>
        )}

        {/* ── Fila de Triagem ── */}
        {telaAtiva === 'painel' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Fila de Triagem Inteligente</h2>
                {userRole === 'dev' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Filter size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Simular Localidade:</span>
                    <select value={cidadeAtiva} onChange={(e) => setCidadeAtiva(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-2 py-1 text-orange-500 font-bold outline-none cursor-pointer hover:border-orange-500 transition-colors">
                      <option value="São Paulo">São Paulo (BR)</option>
                      <option value="Rio de Janeiro">Rio de Janeiro (BR)</option>
                      <option value="Bogotá">Bogotá (CO)</option>
                      <option value="Buenos Aires">Buenos Aires (AR)</option>
                      <option value="Cidade do México">Cidade do México (MX)</option>
                      <option value="Santiago">Santiago (CL)</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">Cidade de Atuação: <span className="font-bold text-gray-700">{cidadeAtiva}</span></p>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Buscar paciente..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Lista de pacientes */}
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Ordenado por IA (Score TdB)</span>

                {carregandoPacientes ? (
                  <>
                    <Skeleton variant="card" />
                    <Skeleton variant="card" />
                    <Skeleton variant="card" />
                  </>
                ) : pacientesFiltrados.length === 0 ? (
                  <EmptyState
                    icon={SearchX}
                    title="Nenhum paciente na fila"
                    description="Quando pacientes desta região entrarem na fila, aparecerão aqui priorizados pelo Score TdB."
                  />
                ) : (
                  pacientesFiltrados.map((p, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.score_match >= 70 ? 'bg-red-400' : p.score_match >= 40 ? 'bg-orange-400' : 'bg-green-400'}`} />
                      <div className="flex items-center gap-4 pl-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${p.score_match >= 70 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                          {p.nome.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800 leading-tight cursor-pointer hover:text-orange-500 hover:underline" onClick={() => navigate(`/prontuario/${p.nome}`)}>
                              {p.nome}
                            </h4>
                            <span className="bg-slate-50 text-gray-500 text-xs px-2 py-0.5 rounded-md font-semibold border border-slate-100">{p.idade} anos</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <p className="text-xs text-gray-500 flex items-center gap-1 font-medium"><MapPin size={12} /> {p.cidade}, {p.pais}</p>
                            <p className={`text-xs font-bold flex items-center gap-1 uppercase ${(p.tipo_dor || '').includes('quebrado') || p.tipo_dor === 'forte' ? 'text-red-500' : 'text-gray-500'}`}>
                              <AlertCircle size={12} /> {p.tipo_dor}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Match</p>
                          <div className="flex items-center justify-end gap-1">
                            <span className={`text-sm font-bold ${p.score_match >= 70 ? 'text-gray-800' : 'text-gray-500'}`}>{p.score_match}%</span>
                            {p.score_match >= 70 && <Star size={12} className="text-orange-500 fill-orange-500" />}
                          </div>
                        </div>
                        <button onClick={() => setPacienteSelecionado(p)} className="bg-white text-orange-500 border border-orange-500 px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-500 hover:text-white transition-colors">
                          Avaliar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat IA */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[550px] sticky top-4 overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-orange-500"><MessageSquare size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Assistente TdB</h3>
                      <p className="text-xs text-gray-400 font-semibold">Gemini 2.5</p>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
                    <div className="self-start bg-slate-50 p-3.5 rounded-2xl rounded-tl-sm text-sm text-gray-600 border border-slate-100">
                      Doutor, a fila já está priorizada para jovens em vulnerabilidade perto de <strong>{cidadeAtiva}</strong>. Posso te ajudar a analisar algum caso?
                    </div>
                    {respostaIA && (
                      <div className="self-start bg-orange-50/50 p-3.5 rounded-2xl rounded-tl-sm text-sm text-gray-700 border border-orange-100 whitespace-pre-wrap">{respostaIA}</div>
                    )}
                    {carregandoIA && <div className="text-xs text-gray-400 font-medium animate-pulse pl-2">A pensar...</div>}
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input type="text" placeholder="Ex: Qual o caso mais grave?" value={pergunta}
                      onChange={(e) => setPergunta(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && enviarPerguntaIA()}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                    <button onClick={enviarPerguntaIA} className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors"><Send size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Meus Pacientes ── */}
        {telaAtiva === 'pacientes' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><Users size={24} /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Meus Pacientes Adotados</h2>
                <p className="text-gray-500 text-sm">Jovens que assumiu o tratamento até aos 18 anos.</p>
              </div>
            </div>

            {carregandoMeusPacientes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
            ) : meusPacientes.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Ainda não adotou pacientes"
                description="Acesse a Fila de Triagem, avalie um caso e clique em Adotar para iniciar o tratamento."
                action={{ label: 'Ver Fila de Triagem', onClick: () => setTelaAtiva('painel') }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meusPacientes.map((p, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{p.nome.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-gray-800 leading-tight">{p.nome}</h4>
                            <span className="text-xs text-gray-500 font-medium">{p.idade} anos</span>
                          </div>
                        </div>
                        <Badge variant="success">Adotado</Badge>
                      </div>
                      <div className="space-y-2 mb-3">
                        <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {p.telefone || '(11) 90000-0000'}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {p.cidade}, {p.pais}</p>
                      </div>
                      <StatusAgendamento oferta={ofertasMapa[p.nome]} temAgendamento={agendamentos.some(a => a.paciente?.nome === p.nome)} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => abrirFicha(p)} className="flex-1 bg-slate-50 text-orange-500 border border-orange-200 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 hover:border-orange-500 flex items-center justify-center gap-2 transition-all">
                        <Calendar size={16} /> Prontuário
                      </button>
                      <button onClick={() => imprimirRelatorio(p, usuarioLogado)} className="bg-slate-50 text-gray-500 border border-slate-200 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center" title="Gerar Relatório">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => atualizarStatusPaciente(p, 'disponivel')} className="bg-red-50 text-red-500 border border-red-200 px-3 py-2.5 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all flex items-center justify-center" title="Remover paciente">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Agenda ── */}
        {telaAtiva === 'agenda' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><Calendar size={24} /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">A Minha Agenda Voluntária</h2>
                <p className="text-gray-500 text-sm">Próximos agendamentos vinculados ao projeto Turma do Bem.</p>
              </div>
            </div>

            {agendamentos.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Agenda livre"
                description="Ainda não há consultas agendadas. Vá a Meus Pacientes para propor um horário."
                action={{
                  label: 'Ir para Meus Pacientes',
                  onClick: () => {
                    if (meusPacientes.length === 0) { alert('Precisa de adotar um paciente na Triagem primeiro!'); setTelaAtiva('painel'); }
                    else setTelaAtiva('pacientes');
                  },
                }}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Próximos Agendamentos</h3>
                  <button onClick={() => setTelaAtiva('pacientes')} className="text-orange-500 font-bold text-sm hover:underline">+ Novo Agendamento</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {agendamentos.sort((a, b) => a.data.localeCompare(b.data)).map((ag) => {
                    const { diaSemana, diaMes } = formatarDataAgenda(ag.data);
                    return (
                      <div key={ag.id} className="p-6 flex items-start gap-6 hover:bg-slate-50 transition-colors animate-fade-in">
                        <div className="text-center min-w-16">
                          <p className="text-xs font-bold text-gray-400 uppercase">{diaSemana}</p>
                          <p className="text-2xl font-black text-orange-500">{diaMes}</p>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg">{ag.tipo}</h4>
                          <p className="text-gray-500 text-sm">Paciente: {ag.paciente.nome}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><Clock size={14} /> {ag.hora}</span>
                            <span className="bg-slate-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><MapPin size={14} /> O seu Consultório</span>
                          </div>
                          <button
                            onClick={() => handleConcluirConsulta(ag.id)}
                            className="mt-3 text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={13} /> Marcar como Concluída
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Modais ── */}
      {pacienteSelecionado && (
        <ModalAvaliarPaciente
          paciente={pacienteSelecionado}
          onClose={() => setPacienteSelecionado(null)}
          onAdotar={(p) => atualizarStatusPaciente(p, 'adotado')}
        />
      )}

      {fichaAtiva && (
        <ModalFichaAtiva
          ficha={fichaAtiva}
          usuarioLogado={usuarioLogado}
          slotsPropostos={slotsPropostos}
          novaData={novaData}
          novaHora={novaHora}
          procedimentoOferta={procedimentoOferta}
          slotsOcupados={slotsOcupados}
          slotsLivres={slotsLivres}
          dataHoje={dataHoje}
          ofertaAtiva={ofertaAtiva}
          onClose={() => setFichaAtiva(null)}
          onGerarRelatorio={(p) => imprimirRelatorio(p, usuarioLogado)}
          onAdicionarSlot={handleAdicionarSlot}
          onRemoverSlot={handleRemoverSlot}
          onEnviarOferta={handleEnviarOferta}
          setNovaData={setNovaData}
          setNovaHora={setNovaHora}
          setProcedimentoOferta={setProcedimentoOferta}
        />
      )}

    </div>
  );
}
