import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useForm } from 'react-hook-form';
import { LayoutDashboard, LogOut, Clock, CalendarDays, Users, ClipboardList, Activity, CheckCircle2, AlertCircle, TrendingUp, Bell, CalendarCheck, ChevronRight, Phone, Mail, Navigation, MapPin, Sparkles } from 'lucide-react';
import { MapaRota } from '../components/MapaRota';
import { Skeleton, EmptyState } from '../components/ui';

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

interface SlotOferta {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  id?: number;
  dentistaNome: string;
  dentistaCidade?: string;
  dentistaPais?: string;
  procedimento: string;
  slots: SlotOferta[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

interface TriagemFormData {
  idade: string;
  renda: string;
  tipoDor: string;
  diasDor: string;
  telefone: string;
  email: string;
}

const TOTAL_CONSULTAS_PLANO = 5;

export function PacienteDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  const userId = sessionStorage.getItem('userId');

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem' | 'consultas'>('painel');
  const [historicoPaciente, setHistoricoPaciente] = useState<HistoricoConsulta[]>([]);
  const [fichaEnviada, setFichaEnviada] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [ofertaRecebida, setOfertaRecebida] = useState<OfertaAgendamento | null>(null);
  const [slotEscolhidoId, setSlotEscolhidoId] = useState<string>('');
  const [mapaRotaAberto, setMapaRotaAberto] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TriagemFormData>({ defaultValues: { tipoDor: 'leve' } });

  const aplicarMascaraTelefone = (valor: string): string => {
    const d = valor.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const [pacienteInfo, setPacienteInfo] = useState<{ cidade: string; pais: string }>({ cidade: '', pais: 'Brasil' });

  // Carrega todos os dados do paciente ao montar o dashboard:
  //   1. Cidade/país → filtra a fila de dentistas da região
  //   2. Histórico de consultas → linha do tempo e cálculo de progresso
  //   3. Oferta de agendamento → proposta de horário enviada por algum dentista
  //   4. Lembretes de e-mail → verifica se há consulta hoje e dispara e-mail se necessário
  // Carrega dados do paciente (auth centralizada em ProtectedRoute)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!userId) { setCarregandoDados(false); return; }

    const fetchInfo = fetch(`${API_URL}/pacientes/${userId}`)
      .then(res => res.json())
      .then(data => { if (data?.cidade) setPacienteInfo({ cidade: data.cidade, pais: data.pais || 'Brasil' }); })
      .catch(() => {});

    const fetchHistorico = fetch(`${API_URL}/pacientes/${userId}/historico`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setHistoricoPaciente(data); })
      .catch(() => {});

    const fetchOferta = fetch(`${API_URL}/ofertas/paciente/${userId}`)
      .then(res => res.json())
      .then(data => {
        // Sempre atualiza — inclusive limpando se a oferta foi cancelada pelo dentista
        setOfertaRecebida(data && data.id ? (data as OfertaAgendamento) : null);
      })
      .catch(() => {});

    Promise.allSettled([fetchInfo, fetchHistorico, fetchOferta])
      .finally(() => setCarregandoDados(false));

  }, [userId]);

  // Re-busca a oferta sempre que o paciente abre a aba "consultas".
  // Garante que cancelamentos feitos pelo dentista sejam refletidos sem precisar recarregar a página.
  useEffect(() => {
    if (telaAtiva !== 'consultas' || !userId) return;
    fetch(`${API_URL}/ofertas/paciente/${userId}`)
      .then(res => res.json())
      .then(data => {
        setOfertaRecebida(data && data.id ? (data as OfertaAgendamento) : null);
      })
      .catch(() => {});
  }, [telaAtiva, userId]);

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const consultasConcluidas = historicoPaciente.filter(h => h.status === 'Concluído').length;
  const consultasAgendadas = historicoPaciente.filter(h => h.status === 'Agendado').length;
  const progressoPct = Math.min(Math.round((consultasConcluidas / TOTAL_CONSULTAS_PLANO) * 100), 100);

  const onSubmit = async (data: TriagemFormData) => {
    const payload = {
      nome: usuarioLogado,
      idade: Number(data.idade),
      rendaSalarioMinimo: Number(data.renda),
      tipoDor: data.tipoDor,
      tempoDorDias: Number(data.diasDor),
      pais: pacienteInfo.pais || 'Brasil',
      cidade: pacienteInfo.cidade || 'Não informada',
      telefone: data.telefone,
      email: data.email,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${API_URL}/pacientes/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        if (usuarioLogado) {
          localStorage.setItem(`tdb_contato_${usuarioLogado}`, JSON.stringify({ email: data.email, telefone: data.telefone }));
          localStorage.setItem(`tdb_triagem_${usuarioLogado}`, JSON.stringify(payload));
        }
        setMensagemSucesso('Ficha de triagem enviada com sucesso! Aguarde o contacto de um dentista voluntário.');
        setFichaEnviada(true);
        setTimeout(() => { setTelaAtiva('painel'); setMensagemSucesso(''); }, 4000);
      } else {
        const err = await response.json().catch(() => null);
        setMensagemSucesso('__erro__' + (err?.erro || 'Erro ao enviar triagem. Tente novamente.'));
        setTimeout(() => setMensagemSucesso(''), 4000);
      }
    } catch {
      setMensagemSucesso('__erro__Sem conexão com o servidor. Verifique sua internet e tente novamente.');
      setTimeout(() => setMensagemSucesso(''), 4000);
    }
  };

  const handleConfirmarSlot = async () => {
    if (!ofertaRecebida || !slotEscolhidoId || !usuarioLogado) return;
    const slot = ofertaRecebida.slots.find(s => s.id === slotEscolhidoId);
    if (!slot) return;

    const dataParts = slot.data.split('-');
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

    // Confirm via API — só atualiza estado local após confirmação do servidor
    if (ofertaRecebida.id) {
      try {
        const res = await fetch(`${API_URL}/ofertas/${ofertaRecebida.id}/confirmar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: slot.data, hora: slot.hora }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          setMensagemSucesso('__erro__' + (err?.erro || 'Erro ao confirmar agendamento. Tente novamente.'));
          setTimeout(() => setMensagemSucesso(''), 4000);
          return;
        }
      } catch {
        setMensagemSucesso('__erro__Sem conexão com o servidor. Tente novamente.');
        setTimeout(() => setMensagemSucesso(''), 4000);
        return;
      }
    }

    // Atualiza estado local somente após backend confirmar
    const ofertaAtualizada = { ...ofertaRecebida, status: 'confirmado' as const, slotEscolhido: { data: slot.data, hora: slot.hora } };
    setOfertaRecebida(ofertaAtualizada);
    setHistoricoPaciente(prev => [...prev, { status: 'Agendado', data: dataFormatada, hora: slot.hora, proc: ofertaRecebida.procedimento, dentista: ofertaRecebida.dentistaNome }]);
    setMensagemSucesso(`Consulta confirmada para ${dataFormatada} às ${slot.hora}! O seu dentista foi notificado.`);
    setTimeout(() => { setTelaAtiva('painel'); setMensagemSucesso(''); }, 4000);

  };

  const inputClass = 'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 outline-none';

  // Dados derivados para o card "Consulta Confirmada"
  const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const slotConfirmado = ofertaRecebida?.status === 'confirmado' ? ofertaRecebida.slotEscolhido : null;
  let confirmedDiaSemana = '';
  let confirmedDataFormatada = '';
  let confirmedDiasAte: number | null = null;
  if (slotConfirmado) {
    const [cAno, cMes, cDia] = slotConfirmado.data.split('-');
    const cObj = new Date(Number(cAno), Number(cMes) - 1, Number(cDia));
    confirmedDiaSemana    = DIAS_SEMANA[cObj.getDay()];
    confirmedDataFormatada = `${cDia}/${cMes}/${cAno}`;
    confirmedDiasAte      = Math.ceil((cObj.getTime() - Date.now()) / 86_400_000);
  }

  const navItems = [
    { id: 'painel',    icon: <LayoutDashboard size={20} />, label: 'Meu Painel', badge: 0 },
    { id: 'triagem',   icon: <ClipboardList size={20} />,   label: 'Triagem',    badge: 0 },
    { id: 'consultas', icon: <CalendarCheck size={20} />,   label: 'Consultas',  badge: ofertaRecebida?.status === 'pendente' ? 1 : 0 },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-16 md:pb-0 transition-colors duration-300">

      {/* ── Top navigation bar ── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">

          {/* User info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl text-white flex items-center justify-center font-black text-base shadow-sm">
              {usuarioLogado?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate max-w-[140px]">{usuarioLogado}</p>
              <p className="text-xs text-orange-500 font-semibold mt-0.5">Beneficiário TdB</p>
            </div>
          </div>

          {/* Tab navigation — desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mx-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setTelaAtiva(item.id)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  telaAtiva === item.id
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-600/60'
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none animate-pulse">
                    !
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
            title="Sair"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Toast */}
      {mensagemSucesso && (() => {
        const isErro = mensagemSucesso.startsWith('__erro__');
        const texto = isErro ? mensagemSucesso.replace('__erro__', '') : mensagemSucesso;
        return (
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 w-max ${isErro ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            <CheckCircle2 size={20} /> {texto}
          </div>
        );
      })()}

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 w-full">

        {telaAtiva === 'painel' && (
          <div className="animate-fade-in space-y-8">
            {carregandoDados && (
              <>
                <Skeleton variant="card" />
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </>
            )}
            {!carregandoDados && (<>

            {/* Oferta de agendamento pendente */}
            {ofertaRecebida?.status === 'pendente' && (
              <button onClick={() => setTelaAtiva('consultas')}
                className="w-full bg-gradient-to-r from-[#8dc63f] to-[#7ebd34] text-white p-5 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition-all text-left animate-fade-in">
                <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                  <Bell size={24} className="text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-lg">Novo horário disponível!</p>
                  <p className="text-green-100 text-sm mt-0.5">Dr(a). {ofertaRecebida.dentistaNome} enviou {ofertaRecebida.slots.length} opção(ões) para <strong>{ofertaRecebida.procedimento}</strong>. Escolha o melhor horário.</p>
                </div>
                <ChevronRight size={24} className="flex-shrink-0 text-white/80" />
              </button>
            )}

            {/* Boas-vindas */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">Olá, {usuarioLogado}! 👋</h2>
                <p className="text-gray-500 dark:text-slate-400 text-lg">Bem-vindo ao seu painel do Dentista na Nuvem.</p>
              </div>
              {!fichaEnviada && (
                <button onClick={() => setTelaAtiva('triagem')}
                  className="bg-[#FF8C00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E67E22] transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                  <ClipboardList size={20} /> Preencher Triagem
                </button>
              )}
            </div>

            {/* Status da Solicitação — narrativa do fluxo */}
            {(() => {
              const triagemLocal = usuarioLogado ? localStorage.getItem(`tdb_triagem_${usuarioLogado}`) : null;
              const triagemEnviada = fichaEnviada || !!triagemLocal || historicoPaciente.length > 0;
              const etapa = ofertaRecebida?.status === 'confirmado' ? 4 : ofertaRecebida ? 3 : triagemEnviada ? 2 : 1;
              const etapas = [
                { num: 1, label: 'Cadastro', desc: 'Conta criada' },
                { num: 2, label: 'Triagem', desc: 'Ficha enviada' },
                { num: 3, label: 'Dentista', desc: 'Atribuído' },
                { num: 4, label: 'Consulta', desc: 'Confirmada' },
              ];
              return (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-950/40 p-2 rounded-lg text-blue-500"><Activity size={20} aria-hidden="true" /></div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">Status da sua Solicitação</h3>
                  </div>
                  <div className="relative">
                    {/* Linha de conexão */}
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 dark:bg-slate-700" aria-hidden="true">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF8C00] to-[#8dc63f] rounded-full transition-all duration-700"
                        style={{ width: `${((etapa - 1) / 3) * 100}%` }}
                      />
                    </div>
                    <div className="relative flex justify-between">
                      {etapas.map(e => {
                        const done = etapa > e.num;
                        const active = etapa === e.num;
                        return (
                          <div key={e.num} className="flex flex-col items-center text-center" style={{ width: '25%' }}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 relative transition-all duration-500 ${done ? 'bg-[#8dc63f] text-white shadow-md shadow-green-200 dark:shadow-green-900/30' : active ? 'bg-[#FF8C00] text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30 ring-4 ring-orange-100 dark:ring-orange-950/40' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}`}>
                              {done ? <CheckCircle2 size={18} aria-hidden="true" /> : <span>{e.num}</span>}
                            </div>
                            <p className={`text-xs font-black mt-2 leading-none ${active ? 'text-[#FF8C00]' : done ? 'text-[#8dc63f]' : 'text-gray-400 dark:text-slate-500'}`}>{e.label}</p>
                            <p className={`text-[10px] mt-0.5 font-medium ${active || done ? 'text-gray-500 dark:text-slate-400' : 'text-gray-300 dark:text-slate-600'}`}>{e.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {etapa < 4 && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-5 font-medium">
                      {etapa === 1 && 'Preencha a Ficha de Triagem para avançar para a próxima etapa.'}
                      {etapa === 2 && 'Sua ficha está em análise. Um dentista voluntário será atribuído em breve.'}
                      {etapa === 3 && 'Um dentista enviou opções de horário. Acesse a aba Consultas para confirmar.'}
                    </p>
                  )}
                  {etapa === 4 && (
                    <p className="text-xs text-[#8dc63f] font-bold text-center mt-5 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={13} aria-hidden="true" /> Consulta confirmada! Boa sorte no atendimento.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Barra de progresso do tratamento */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-orange-100 dark:bg-orange-950/40 p-2 rounded-lg text-[#FF8C00]"><TrendingUp size={20} /></div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Progresso do Tratamento</h3>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-4xl font-black text-[#FF8C00]">{consultasConcluidas}
                    <span className="text-lg font-semibold text-gray-400"> / {TOTAL_CONSULTAS_PLANO}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">consultas realizadas</p>
                </div>
                <div className="text-right space-y-1">
                  {consultasAgendadas > 0 && (
                    <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950/40 text-[#FF8C00] dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/40">
                      <Clock size={12} /> {consultasAgendadas} agendada{consultasAgendadas > 1 ? 's' : ''}
                    </span>
                  )}
                  {consultasConcluidas >= TOTAL_CONSULTAS_PLANO && (
                    <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-100 dark:border-green-900/40">
                      <CheckCircle2 size={12} /> Tratamento concluído!
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressoPct}%`,
                    background: progressoPct >= 100 ? '#8dc63f' : 'linear-gradient(90deg, #FF8C00, #f39c12)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {Array.from({ length: TOTAL_CONSULTAS_PLANO }).map((_, i) => (
                  <span key={i} className={`text-[10px] font-bold ${i < consultasConcluidas ? 'text-[#FF8C00]' : 'text-gray-300 dark:text-slate-600'}`}>
                    {i + 1}ª
                  </span>
                ))}
              </div>
              {historicoPaciente.length === 0 && !carregandoDados && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 text-center">Preencha a triagem para iniciar o seu tratamento.</p>
              )}
            </div>

            {/* Histórico */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-950/40 p-2 rounded-lg text-[#FF8C00]"><Activity size={20} /></div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">O Meu Histórico e Consultas</h3>
              </div>
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 dark:border-slate-700 ml-4 space-y-8">
                  {historicoPaciente.length === 0 ? (
                    <EmptyState
                      icon={ClipboardList}
                      title="Sem histórico de consultas"
                      description="Preencha a Ficha de Triagem para que a nossa IA encontre o dentista certo para si."
                      action={{ label: 'Preencher Triagem', onClick: () => setTelaAtiva('triagem') }}
                    />
                  ) : (
                    historicoPaciente.map((item, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className={`absolute w-6 h-6 rounded-full -left-[13px] top-0 border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`}>
                          {item.status === 'Agendado' ? <Clock size={10} className="text-white" /> : <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 dark:text-white text-lg">{item.titulo}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.status === 'Agendado' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/40' : 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40'}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.proc && <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 font-medium">{item.proc}</p>}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14} /> {item.data}</span>
                            {item.hora && <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><Clock size={14} /> {item.hora}</span>}
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><Users size={14} /> Dr(a). {item.dentista}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            </>)}
          </div>
        )}

        {telaAtiva === 'consultas' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-950/40 p-3 rounded-xl text-[#8dc63f]">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Consultas</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm">Escolha o melhor horário ou veja os agendamentos.</p>
              </div>
            </div>

            {/* Pending offer */}
            {ofertaRecebida?.status === 'pendente' ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[#8dc63f]/10 to-transparent border-b border-gray-100 dark:border-slate-700">
                  <p className="text-[11px] font-bold text-[#8dc63f] uppercase tracking-wider mb-1">Proposta do seu dentista</p>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">{ofertaRecebida.procedimento}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Dr(a). {ofertaRecebida.dentistaNome} disponibilizou {ofertaRecebida.slots.length} opção(ões). Escolha a que melhor se adequa à sua agenda.</p>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Selecione um horário:</p>
                  {ofertaRecebida.slots.map(slot => {
                    const [ano, mes, dia] = slot.data.split('-');
                    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
                    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
                    const diaSemana = diasSemana[dataObj.getDay()];
                    const selecionado = slotEscolhidoId === slot.id;
                    return (
                      <label key={slot.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selecionado ? 'border-[#8dc63f] bg-green-50 dark:bg-green-950/20' : 'border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/40 hover:border-gray-300 dark:hover:border-slate-500'}`}>
                        <input type="radio" name="slot" value={slot.id} checked={selecionado}
                          onChange={() => setSlotEscolhidoId(slot.id)}
                          className="accent-[#8dc63f] w-4 h-4 flex-shrink-0" />
                        <div className="flex-1">
                          <p className={`font-bold text-base ${selecionado ? 'text-[#8dc63f]' : 'text-gray-800 dark:text-white'}`}>
                            {diaSemana}, {dia}/{mes}/{ano}
                          </p>
                          <p className="text-gray-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                            <Clock size={13} /> {slot.hora}
                          </p>
                        </div>
                        {selecionado && <CheckCircle2 size={22} className="text-[#8dc63f] flex-shrink-0" />}
                      </label>
                    );
                  })}
                </div>

                <div className="p-6 pt-0">
                  <button onClick={handleConfirmarSlot} disabled={!slotEscolhidoId}
                    className="w-full bg-[#8dc63f] text-white font-bold py-4 rounded-xl hover:bg-[#7ebd34] transition-colors shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed">
                    <CheckCircle2 size={20} /> Confirmar este Horário
                  </button>
                </div>
              </div>
            ) : ofertaRecebida?.status === 'confirmado' ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">

                {/* Barra de destaque no topo */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-[#8dc63f] to-emerald-500" />

                {/* Ícone + título */}
                <div className="px-8 py-8 text-center border-b border-gray-50 dark:border-slate-700">
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center ring-4 ring-emerald-50 dark:ring-emerald-950/30">
                      <CheckCircle2 size={34} className="text-emerald-500" strokeWidth={2.5} />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 rounded-full p-1 shadow-sm">
                      <Sparkles size={11} className="text-white" />
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Consulta Confirmada!</h3>
                  <p className="text-gray-400 dark:text-slate-400 text-sm">{ofertaRecebida.procedimento}</p>
                  {confirmedDiasAte !== null && confirmedDiasAte >= 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                      <Clock size={11} />
                      {confirmedDiasAte === 0 ? 'Hoje!' : confirmedDiasAte === 1 ? 'Amanhã!' : `Em ${confirmedDiasAte} dias`}
                    </div>
                  )}
                </div>

                {/* Info rows */}
                <div className="p-6 space-y-3">

                  {/* Data e hora */}
                  {slotConfirmado && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="bg-emerald-100 dark:bg-emerald-950/30 rounded-xl p-2.5 flex-shrink-0">
                        <CalendarDays size={20} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Data e Hora</p>
                        <p className="font-bold text-gray-900 dark:text-white">{confirmedDiaSemana}, {confirmedDataFormatada}</p>
                        <p className="text-gray-400 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {slotConfirmado.hora}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Dentista */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                      {ofertaRecebida.dentistaNome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Dentista</p>
                      <p className="font-bold text-gray-900 dark:text-white truncate">Dr(a). {ofertaRecebida.dentistaNome}</p>
                      {ofertaRecebida.dentistaCidade && (
                        <p className="text-gray-400 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {ofertaRecebida.dentistaCidade}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Lembrete */}
                  <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4">
                    <Bell size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-600 dark:text-blue-300 text-xs font-medium leading-relaxed">
                      Você receberá lembretes por e-mail <strong>3, 2 e 1 dia(s)</strong> antes da consulta. Fique atento à sua caixa de entrada.
                    </p>
                  </div>

                  {/* Botão Ver Rota */}
                  <button
                    onClick={() => setMapaRotaAberto(true)}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#FF8C00] hover:bg-orange-500 active:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-orange-200 text-sm mt-1"
                  >
                    <Navigation size={16} className="text-white" />
                    Ver Rota até a Consulta
                    <span className="ml-1 bg-white/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full">NOVO</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
                <EmptyState
                  icon={CalendarCheck}
                  title="Sem propostas pendentes"
                  description="Quando um dentista voluntário enviar opções de horário, elas aparecerão aqui para você escolher."
                />
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-950/40 p-3 rounded-xl text-[#FF8C00]">
                <ClipboardList size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ficha de Triagem</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm">Responda para que a nossa IA encontre o dentista mais adequado.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
              {fichaEnviada ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ficha Recebida!</h3>
                  <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto">A sua situação foi registada e priorizada pelo nosso sistema. Um dentista da sua região entrará em contacto em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Contato */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" /> Telefone para Contato
                      </label>
                      <input type="tel" placeholder="(11) 99999-9999"
                        {...register('telefone', {
                          required: 'Telefone obrigatório',
                          pattern: { value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato inválido. Use (11) 99999-9999' }
                        })}
                        onChange={e => setValue('telefone', aplicarMascaraTelefone(e.target.value), { shouldValidate: !!errors.telefone })}
                        className={`${inputClass} ${errors.telefone ? 'border-red-500' : ''}`} />
                      {errors.telefone && <span className="text-red-500 text-xs mt-1">{errors.telefone.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" /> E-mail para Lembretes
                      </label>
                      <input type="email" placeholder="seu@email.com"
                        {...register('email', {
                          required: 'E-mail obrigatório',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
                        })}
                        className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">Você receberá lembretes 3, 2 e 1 dia(s) antes da consulta.</p>
                    </div>
                  </div>

                  {/* Dados pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">A sua Idade (11–17 anos)</label>
                      <input type="number" min="11" max="17" placeholder="Ex: 15"
                        {...register('idade', { required: true, min: 11, max: 17 })}
                        className={`${inputClass} ${errors.idade ? 'border-red-500' : ''}`} />
                      {errors.idade && <span className="text-red-500 text-xs mt-1">Entre 11 e 17 anos</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">Renda Familiar (Salários Mínimos)</label>
                      <input type="number" step="0.5" min="0" placeholder="Ex: 1.5"
                        {...register('renda', {
                          required: 'Campo obrigatório',
                          min: { value: 0, message: 'Renda não pode ser negativa' }
                        })}
                        className={`${inputClass} ${errors.renda ? 'border-red-500' : ''}`} />
                      {errors.renda && <span className="text-red-500 text-xs mt-1">{errors.renda.message}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-orange-50/50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-700/50 rounded-2xl">
                    <div className="md:col-span-2">
                      <h4 className="font-bold text-orange-700 dark:text-orange-400 text-sm flex items-center gap-2 mb-4"><AlertCircle size={16} className="text-orange-500 dark:text-orange-400" /> Avaliação da Dor</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-1.5">Intensidade da Dor</label>
                      <select {...register('tipoDor', { required: true })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-100 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none">
                        <option value="leve">Leve (Apenas incômodo)</option>
                        <option value="moderada">Moderada (Dói ao mastigar)</option>
                        <option value="forte">Forte (Não consegue dormir)</option>
                        <option value="dente quebrado">Dente Quebrado/Acidente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-1.5">Dias com Dor</label>
                      <input type="number" min="0" placeholder="Ex: 5"
                        {...register('diasDor', {
                          required: 'Campo obrigatório',
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                        className={`${inputClass.replace('dark:bg-slate-700', 'dark:bg-slate-800')} ${errors.diasDor ? 'border-red-500' : ''}`} />
                      {errors.diasDor && <span className="text-red-500 text-xs mt-1">{errors.diasDor.message}</span>}
                    </div>
                  </div>


                  <button type="submit"
                    className="w-full bg-[#FF8C00] text-white font-bold py-4 rounded-xl hover:bg-[#E67E22] transition-colors shadow-md text-lg mt-4">
                    Enviar para Avaliação
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTelaAtiva(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
                telaAtiva === item.id ? 'text-orange-500' : 'text-slate-400'
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none animate-pulse">
                    !
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold leading-none">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Modal de Rota (fullscreen, estilo Waze) ── */}
      {mapaRotaAberto && ofertaRecebida?.slotEscolhido && (
        <MapaRota
          dentistaCidade={ofertaRecebida.dentistaCidade || 'São Paulo'}
          dentistaPais={ofertaRecebida.dentistaPais || 'Brasil'}
          dentistaNome={ofertaRecebida.dentistaNome}
          data={ofertaRecebida.slotEscolhido.data}
          hora={ofertaRecebida.slotEscolhido.hora}
          onClose={() => setMapaRotaAberto(false)}
        />
      )}
    </div>
  );
}
