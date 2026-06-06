import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { pacientesApi, ofertasApi } from '../lib/api';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
  LayoutDashboard, Users, Clock, CalendarDays, ClipboardList,
  Activity, CheckCircle2, AlertCircle, TrendingUp, Bell, CalendarCheck,
  ChevronRight, Phone, Mail, Navigation, MapPin, Sparkles, Hash,
  MessageSquare, Send, Star, Zap,
} from 'lucide-react';
import { gerarTicket, mascaraCPF } from '../utils/ticketUtils';
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

interface MensagemPaciente {
  id: number;
  assunto: string;
  texto: string;
  criadoEm: string;
}

const TOTAL_CONSULTAS_PLANO = 5;

export function PacienteDashboard() {
  const { user } = useAuth();
  const usuarioLogado = user?.nome ?? null;
  const userId = user?.id ?? null;

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem' | 'mensagens' | 'consultas'>('painel');
  const [historicoPaciente, setHistoricoPaciente] = useState<HistoricoConsulta[]>([]);
  const [fichaEnviada, setFichaEnviada] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
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

  const [pacienteInfo, setPacienteInfo] = useState<{ cidade: string; pais: string; cpf?: string }>({ cidade: '', pais: 'Brasil' });

  const [mensagens, setMensagens] = useState<MensagemPaciente[]>(() => {
    try { return JSON.parse(localStorage.getItem(`tdb_msgs_${userId}`) || '[]'); } catch { return []; }
  });
  const [textoMensagem, setTextoMensagem] = useState('');
  const [assuntoMensagem, setAssuntoMensagem] = useState('Dúvida sobre consulta');
  const [enviandoMsg, setEnviandoMsg] = useState(false);

  useEffect(() => {
    if (!userId) { setCarregandoDados(false); return; }

    const fetchInfo = pacientesApi.get(userId)
      .then(data => {
        if (data?.cidade) setPacienteInfo({ cidade: data.cidade, pais: data.pais || 'Brasil', cpf: data.cpf ?? '' });
      })
      .catch(() => {});

    const fetchHistorico = pacientesApi.getHistorico(userId)
      .then(data => { setHistoricoPaciente(data); })
      .catch(() => {});

    const fetchOferta = ofertasApi.getByPaciente(userId)
      .then(data => {
        setOfertaRecebida(data?.id ? (data as unknown as OfertaAgendamento) : null);
      })
      .catch(() => {});

    Promise.allSettled([fetchInfo, fetchHistorico, fetchOferta])
      .finally(() => setCarregandoDados(false));
  }, [userId]);

  useEffect(() => {
    if (telaAtiva !== 'consultas' || !userId) return;
    ofertasApi.getByPaciente(userId)
      .then(data => {
        setOfertaRecebida(data?.id ? (data as unknown as OfertaAgendamento) : null);
      })
      .catch(() => {});
  }, [telaAtiva, userId]);


  const handleEnviarMensagem = () => {
    if (!textoMensagem.trim() || !userId) return;
    setEnviandoMsg(true);
    const nova: MensagemPaciente = {
      id: Date.now(),
      assunto: assuntoMensagem,
      texto: textoMensagem.trim(),
      criadoEm: new Date().toISOString(),
    };
    const atualizadas = [...mensagens, nova];
    setMensagens(atualizadas);
    localStorage.setItem(`tdb_msgs_${userId}`, JSON.stringify(atualizadas));
    const filaAdmin: object[] = JSON.parse(localStorage.getItem('tdb_msgs_admin') || '[]');
    filaAdmin.push({
      id: nova.id, nome: usuarioLogado || 'Paciente', email: '',
      assunto: nova.assunto, mensagem: nova.texto,
      canal: 'web', ticket: gerarTicket(userId), criadoEm: nova.criadoEm,
    });
    localStorage.setItem('tdb_msgs_admin', JSON.stringify(filaAdmin));
    setTextoMensagem('');
    setTimeout(() => setEnviandoMsg(false), 600);
  };

  const triagemLocal = usuarioLogado ? localStorage.getItem(`tdb_triagem_${usuarioLogado}`) : null;
  const triagemEnviada = fichaEnviada || !!triagemLocal || historicoPaciente.length > 0;

  const consultasConcluidas = historicoPaciente.filter(h => h.status === 'Concluído').length;
  const consultasAgendadas  = historicoPaciente.filter(h => h.status === 'Agendado').length;
  const progressoPct        = Math.min(Math.round((consultasConcluidas / TOTAL_CONSULTAS_PLANO) * 100), 100);

  const onSubmit = async (data: TriagemFormData) => {
    if (!userId) return;
    const payload = {
      nome: usuarioLogado ?? undefined,
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
      await pacientesApi.update(userId, payload);
      if (usuarioLogado) {
        localStorage.setItem(`tdb_contato_${usuarioLogado}`, JSON.stringify({ email: data.email, telefone: data.telefone }));
        localStorage.setItem(`tdb_triagem_${usuarioLogado}`, JSON.stringify(payload));
      }
      toast.success('Ficha de triagem enviada com sucesso! Aguarde o contacto de um dentista voluntário.');
      setFichaEnviada(true);
      setTimeout(() => setTelaAtiva('painel'), 4000);
    } catch {
      toast.error('Sem conexão com o servidor. Verifique sua internet e tente novamente.');
    }
  };

  const handleConfirmarSlot = async () => {
    if (!ofertaRecebida || !slotEscolhidoId || !usuarioLogado) return;
    const slot = ofertaRecebida.slots.find(s => s.id === slotEscolhidoId);
    if (!slot) return;

    const dataParts = slot.data.split('-');
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

    if (ofertaRecebida.id) {
      try {
        await ofertasApi.confirmar(ofertaRecebida.id, slot.data, slot.hora);
      } catch {
        toast.error('Sem conexão com o servidor. Tente novamente.');
        return;
      }
    }

    const ofertaAtualizada = { ...ofertaRecebida, status: 'confirmado' as const, slotEscolhido: { data: slot.data, hora: slot.hora } };
    setOfertaRecebida(ofertaAtualizada);
    setHistoricoPaciente(prev => [...prev, { status: 'Agendado', data: dataFormatada, hora: slot.hora, proc: ofertaRecebida.procedimento, dentista: ofertaRecebida.dentistaNome }]);
    toast.success(`Consulta confirmada para ${dataFormatada} às ${slot.hora}! O seu dentista foi notificado.`);
    setTimeout(() => setTelaAtiva('painel'), 4000);
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 outline-none transition-all duration-200';

  const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const slotConfirmado = ofertaRecebida?.status === 'confirmado' ? ofertaRecebida.slotEscolhido : null;
  let confirmedDiaSemana = '';
  let confirmedDataFormatada = '';
  let confirmedDiasAte: number | null = null;
  if (slotConfirmado) {
    const [cAno, cMes, cDia] = slotConfirmado.data.split('-');
    const cObj = new Date(Number(cAno), Number(cMes) - 1, Number(cDia));
    confirmedDiaSemana     = DIAS_SEMANA[cObj.getDay()];
    confirmedDataFormatada = `${cDia}/${cMes}/${cAno}`;
    // eslint-disable-next-line react-hooks/purity
    confirmedDiasAte       = Math.ceil((cObj.getTime() - Date.now()) / 86_400_000);
  }

  const etapa = ofertaRecebida?.status === 'confirmado' ? 4 : ofertaRecebida ? 3 : triagemEnviada ? 2 : 1;

  const navItems: Array<{ id: 'painel' | 'triagem' | 'mensagens' | 'consultas'; icon: React.ReactNode; label: string; badge: number }> = [
    { id: 'painel',    icon: <LayoutDashboard size={20} />, label: 'Meu Painel', badge: 0 },
    triagemEnviada
      ? { id: 'mensagens', icon: <MessageSquare size={20} />, label: 'Mensagens',  badge: 0 }
      : { id: 'triagem',   icon: <ClipboardList size={20} />, label: 'Triagem',    badge: 0 },
    { id: 'consultas', icon: <CalendarCheck size={20} />,  label: 'Consultas',  badge: ofertaRecebida?.status === 'pendente' ? 1 : 0 },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      telaAtiva={telaAtiva}
      onTelaChange={(id) => setTelaAtiva(id as typeof telaAtiva)}
      roleName="Beneficiário TdB"
      maxWidth="max-w-4xl"
    >

        {/* ══════════════════════ PAINEL ══════════════════════ */}
        {telaAtiva === 'painel' && (
          <div className="space-y-6">
            {carregandoDados && (
              <><Skeleton variant="card" /><Skeleton variant="card" /><Skeleton variant="card" /></>
            )}

            {!carregandoDados && (<>

              {/* Alerta oferta pendente */}
              {ofertaRecebida?.status === 'pendente' && (
                <button
                  onClick={() => setTelaAtiva('consultas')}
                  className="w-full bg-gradient-to-r from-[#8dc63f] to-emerald-500 text-white p-5 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl hover:scale-[1.01] transition-all text-left animate-fade-in-down"
                >
                  <div className="relative flex-shrink-0">
                    <div className="bg-white/20 p-3 rounded-xl"><Bell size={22} className="text-white" /></div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ring-ping" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-base">Novo horário disponível!</p>
                    <p className="text-green-100 text-xs mt-0.5">Dr(a). {ofertaRecebida.dentistaNome} enviou {ofertaRecebida.slots.length} opção(ões) para <strong>{ofertaRecebida.procedimento}</strong></p>
                  </div>
                  <ChevronRight size={22} className="flex-shrink-0 text-white/70" />
                </button>
              )}

              {/* ── Hero card ── */}
              {(() => {
                const configs = {
                  1: {
                    bg: 'from-[#FF8C00] via-orange-500 to-amber-500',
                    icon: <ClipboardList size={26} className="text-white" />,
                    badge: null,
                    titulo: `Olá, ${usuarioLogado?.split(' ')[0]}! 👋`,
                    sub: 'Para começar seu atendimento gratuito, preencha a Ficha de Triagem. Leva menos de 2 minutos.',
                    cta: (
                      <button
                        onClick={() => setTelaAtiva('triagem')}
                        className="mt-5 inline-flex items-center gap-2 bg-white text-[#FF8C00] font-black px-6 py-3 rounded-xl hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
                      >
                        <Zap size={15} className="fill-[#FF8C00]" /> Preencher Triagem agora
                      </button>
                    ),
                  },
                  2: {
                    bg: 'from-blue-600 via-blue-600 to-indigo-600',
                    icon: <Activity size={26} className="text-white" />,
                    badge: <span className="text-[10px] font-black bg-blue-500/40 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30 animate-pulse">Em análise</span>,
                    titulo: `Ficha recebida!`,
                    sub: 'Sua situação está sendo analisada. Um dentista voluntário da sua região será atribuído em breve.',
                    cta: null,
                  },
                  3: {
                    bg: 'from-amber-500 via-orange-500 to-orange-600',
                    icon: <Bell size={26} className="text-white animate-float" />,
                    badge: <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full">Ação necessária</span>,
                    titulo: 'Dentista encontrado! 🎉',
                    sub: `Dr(a). ${ofertaRecebida?.dentistaNome} enviou opções de horário. Confirme sua consulta agora.`,
                    cta: (
                      <button
                        onClick={() => setTelaAtiva('consultas')}
                        className="mt-5 inline-flex items-center gap-2 bg-white text-amber-600 font-black px-6 py-3 rounded-xl hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
                      >
                        <CalendarCheck size={15} /> Ver horários disponíveis
                      </button>
                    ),
                  },
                  4: {
                    bg: 'from-[#8dc63f] via-emerald-500 to-green-600',
                    icon: <CheckCircle2 size={26} className="text-white" />,
                    badge: <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles size={9} /> Confirmada</span>,
                    titulo: 'Consulta confirmada! ✨',
                    sub: `Sua consulta com Dr(a). ${ofertaRecebida?.dentistaNome} está marcada. Cuide bem do seu sorriso!`,
                    cta: (
                      <button
                        onClick={() => setTelaAtiva('consultas')}
                        className="mt-5 inline-flex items-center gap-2 bg-white text-green-600 font-black px-6 py-3 rounded-xl hover:bg-green-50 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
                      >
                        <CalendarDays size={15} /> Ver detalhes da consulta
                      </button>
                    ),
                  },
                }[etapa];

                return (
                  <div className={`bg-gradient-to-br ${configs.bg} p-7 rounded-3xl shadow-xl text-white relative overflow-hidden animate-fade-in-up`}>
                    {/* Orbs decorativos */}
                    <div className="absolute -right-12 -top-12 w-52 h-52 bg-white/10 rounded-full pointer-events-none animate-orb-pulse" />
                    <div className="absolute right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full pointer-events-none animate-orb-pulse" style={{ animationDelay: '1.5s' }} />
                    <div className="absolute -left-6 bottom-4 w-16 h-16 bg-white/5 rounded-full pointer-events-none" />

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl flex-shrink-0 mt-0.5 shadow-inner">
                        {configs.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                          <h2 className="text-2xl font-black leading-tight">{configs.titulo}</h2>
                          <div className="flex items-center gap-2 flex-wrap">
                            {configs.badge}
                            {triagemEnviada && userId && (
                              <span className="inline-flex items-center gap-1 bg-white/20 text-white/90 text-[10px] font-black px-2.5 py-1 rounded-lg font-mono">
                                <Hash size={9} />{gerarTicket(userId)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed max-w-lg">{configs.sub}</p>
                        {pacienteInfo.cpf && triagemEnviada && (
                          <p className="text-white/50 text-xs mt-1.5 font-mono">CPF: {mascaraCPF(pacienteInfo.cpf)}</p>
                        )}
                        {configs.cta}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Stepper ── */}
              {(() => {
                const etapas = [
                  { num: 1, label: 'Cadastro', desc: 'Conta criada', icon: <Star size={12} /> },
                  { num: 2, label: 'Triagem',  desc: 'Ficha enviada', icon: <ClipboardList size={12} /> },
                  { num: 3, label: 'Dentista', desc: 'Atribuído',     icon: <Users size={12} /> },
                  { num: 4, label: 'Consulta', desc: 'Confirmada',    icon: <CalendarCheck size={12} /> },
                ];
                return (
                  <div className="bg-white dark:bg-slate-800 px-6 py-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm animate-fade-in-up delay-150">
                    <div className="relative">
                      {/* Track */}
                      <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-gray-100 dark:bg-slate-700" aria-hidden="true">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF8C00] to-[#8dc63f] rounded-full progress-animated"
                          style={{ width: `${((etapa - 1) / 3) * 100}%` }}
                        />
                      </div>
                      <div className="relative flex justify-between">
                        {etapas.map((e, i) => {
                          const done   = etapa > e.num;
                          const active = etapa === e.num;
                          return (
                            <div key={e.num} className={`flex flex-col items-center text-center animate-fade-in-up`} style={{ width: '25%', animationDelay: `${150 + i * 80}ms` }}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs z-10 relative transition-all duration-500 ${
                                done   ? 'bg-[#8dc63f] text-white shadow-md shadow-green-200 dark:shadow-green-900/30' :
                                active ? 'bg-[#FF8C00] text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30 ring-4 ring-orange-100 dark:ring-orange-950/40 scale-110' :
                                         'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'
                              }`}>
                                {done ? <CheckCircle2 size={14} /> : e.icon}
                              </div>
                              <p className={`text-[11px] font-black mt-1.5 leading-none transition-colors ${active ? 'text-[#FF8C00]' : done ? 'text-[#8dc63f]' : 'text-gray-400 dark:text-slate-500'}`}>{e.label}</p>
                              <p className={`text-[9px] mt-0.5 ${active || done ? 'text-gray-400 dark:text-slate-500' : 'text-gray-300 dark:text-slate-600'}`}>{e.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Stats ── */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Realizadas', value: consultasConcluidas, color: 'text-[#8dc63f]', bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10', border: 'border-green-100 dark:border-green-900/30', icon: <CheckCircle2 size={18} className="text-[#8dc63f]" />, delay: 'delay-200' },
                  { label: 'Agendadas',  value: consultasAgendadas,  color: 'text-[#FF8C00]', bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10', border: 'border-orange-100 dark:border-orange-900/30', icon: <Clock size={18} className="text-[#FF8C00]" />, delay: 'delay-300' },
                  { label: 'Restantes',  value: Math.max(0, TOTAL_CONSULTAS_PLANO - consultasConcluidas), color: 'text-slate-500 dark:text-slate-400', bg: 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-700/40 dark:to-slate-700/20', border: 'border-slate-100 dark:border-slate-600', icon: <CalendarDays size={18} className="text-slate-400" />, delay: 'delay-400' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 animate-scale-in ${s.delay} hover:scale-105 transition-transform duration-200 cursor-default`}>
                    {s.icon}
                    <p className={`text-3xl font-black leading-none ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ── Progresso ── */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm animate-fade-in-up delay-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#FF8C00]" />
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-200">Progresso do Tratamento</span>
                  </div>
                  <span className="text-sm font-black text-[#FF8C00]">{consultasConcluidas}<span className="text-gray-400 font-semibold">/{TOTAL_CONSULTAS_PLANO}</span></span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{
                      width: `${progressoPct || (triagemEnviada ? 4 : 0)}%`,
                      background: progressoPct >= 100 ? '#8dc63f' : 'linear-gradient(90deg, #FF8C00, #f59e0b)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2.5">
                  {Array.from({ length: TOTAL_CONSULTAS_PLANO }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${i < consultasConcluidas ? 'bg-[#FF8C00]' : 'bg-gray-200 dark:bg-slate-600'}`} />
                      <span className={`text-[9px] font-bold ${i < consultasConcluidas ? 'text-[#FF8C00]' : 'text-gray-300 dark:text-slate-600'}`}>{i + 1}ª</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Histórico ── */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in-up delay-400">
                <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/10 flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-950/40 p-2.5 rounded-xl text-[#FF8C00]"><Activity size={18} /></div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Histórico de Consultas</h3>
                </div>
                <div className="p-6">
                  {historicoPaciente.length === 0 ? (
                    <EmptyState
                      icon={ClipboardList}
                      title="Sem histórico de consultas"
                      description="Preencha a Ficha de Triagem para que a nossa IA encontre o dentista certo para si."
                      action={{ label: 'Preencher Triagem', onClick: () => setTelaAtiva('triagem') }}
                    />
                  ) : (
                    <div className="relative border-l-2 border-gray-100 dark:border-slate-700 ml-4 space-y-6">
                      {historicoPaciente.map((item, idx) => (
                        <div key={idx} className="relative pl-8 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                          <div className={`absolute w-6 h-6 rounded-full -left-[13px] top-1 border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`}>
                            {item.status === 'Agendado' ? <Clock size={10} className="text-white" /> : <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <div className="bg-gray-50 dark:bg-slate-700/40 p-5 rounded-2xl border border-gray-100 dark:border-slate-600 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-200">
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <h4 className="font-bold text-gray-800 dark:text-white">{item.titulo || item.proc || 'Consulta'}</h4>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex-shrink-0 ${item.status === 'Agendado' ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400'}`}>
                                {item.status}
                              </span>
                            </div>
                            {item.proc && <p className="text-gray-500 dark:text-slate-400 text-sm mb-3">{item.proc}</p>}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400">
                              <span className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2.5 py-1.5 rounded-lg shadow-sm"><CalendarDays size={12} /> {item.data}</span>
                              {item.hora && <span className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2.5 py-1.5 rounded-lg shadow-sm"><Clock size={12} /> {item.hora}</span>}
                              <span className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2.5 py-1.5 rounded-lg shadow-sm"><Users size={12} /> Dr(a). {item.dentista}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>)}
          </div>
        )}

        {/* ══════════════════════ TRIAGEM ══════════════════════ */}
        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in-up max-w-2xl mx-auto">

            {/* Cabeçalho */}
            <div className="relative bg-gradient-to-br from-[#FF8C00] to-amber-500 p-7 rounded-3xl shadow-xl text-white overflow-hidden mb-6">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none animate-orb-pulse" />
              <div className="absolute right-6 bottom-0 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl shadow-inner flex-shrink-0">
                  <ClipboardList size={26} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-tight">Ficha de Triagem</h2>
                  <p className="text-orange-100 text-sm mt-0.5">A nossa IA usa estes dados para te encontrar o melhor dentista.</p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {fichaEnviada ? (
                <div className="text-center py-16 px-8 animate-scale-in">
                  <div className="relative inline-flex mb-6">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={48} className="text-green-500" strokeWidth={2} />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-[#FF8C00] rounded-full p-1.5 shadow-md animate-pop-in">
                      <Sparkles size={14} className="text-white" />
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Ficha Recebida!</h3>
                  <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">A sua situação foi registada e priorizada pelo nosso sistema. Um dentista da sua região entrará em contacto em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-100 dark:divide-slate-700">

                  {/* Secção 1 — Contato */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-[#FF8C00] font-black text-xs">1</div>
                      <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Dados de Contacto</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" /> Telefone
                        </label>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          {...register('telefone', {
                            required: 'Telefone obrigatório',
                            pattern: { value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato inválido' }
                          })}
                          onChange={e => setValue('telefone', aplicarMascaraTelefone(e.target.value), { shouldValidate: !!errors.telefone })}
                          className={`${inputClass} ${errors.telefone ? 'border-red-400 ring-2 ring-red-200 dark:ring-red-900/40' : ''}`}
                        />
                        {errors.telefone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.telefone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-400" /> E-mail
                        </label>
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          {...register('email', {
                            required: 'E-mail obrigatório',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
                          })}
                          className={`${inputClass} ${errors.email ? 'border-red-400 ring-2 ring-red-200 dark:ring-red-900/40' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.email.message}</p>}
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">Lembretes 3, 2 e 1 dia(s) antes da consulta.</p>
                      </div>
                    </div>
                  </div>

                  {/* Secção 2 — Dados pessoais */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-[#FF8C00] font-black text-xs">2</div>
                      <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Dados Pessoais</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Sua Idade (11–17 anos)</label>
                        <input
                          type="number" min="11" max="17" placeholder="Ex: 15"
                          {...register('idade', { required: true, min: 11, max: 17 })}
                          className={`${inputClass} ${errors.idade ? 'border-red-400' : ''}`}
                        />
                        {errors.idade && <p className="text-red-500 text-xs mt-1">Entre 11 e 17 anos</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Renda Familiar (Salários Mínimos)</label>
                        <input
                          type="number" step="0.5" min="0" placeholder="Ex: 1.5"
                          {...register('renda', { required: 'Obrigatório', min: { value: 0, message: 'Não pode ser negativo' } })}
                          className={`${inputClass} ${errors.renda ? 'border-red-400' : ''}`}
                        />
                        {errors.renda && <p className="text-red-500 text-xs mt-1">{errors.renda.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Secção 3 — Dor */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-500 font-black text-xs">3</div>
                      <p className="text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-orange-500" /> Avaliação da Dor
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Intensidade da Dor</label>
                        <select
                          {...register('tipoDor', { required: true })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 outline-none transition-all duration-200"
                        >
                          <option value="leve">Leve (Apenas incômodo)</option>
                          <option value="moderada">Moderada (Dói ao mastigar)</option>
                          <option value="forte">Forte (Não consegue dormir)</option>
                          <option value="dente quebrado">Dente Quebrado / Acidente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Dias com Dor</label>
                        <input
                          type="number" min="0" placeholder="Ex: 5"
                          {...register('diasDor', { required: 'Obrigatório', min: { value: 0, message: 'Não pode ser negativo' } })}
                          className={`${inputClass} ${errors.diasDor ? 'border-red-400' : ''}`}
                        />
                        {errors.diasDor && <p className="text-red-500 text-xs mt-1">{errors.diasDor.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="p-6">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#FF8C00] to-amber-500 text-white font-black py-4 rounded-2xl hover:from-orange-600 hover:to-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/30 text-base flex items-center justify-center gap-2"
                    >
                      <Zap size={18} className="fill-white" /> Enviar para Avaliação
                    </button>
                    <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-3">Seus dados são tratados com total sigilo (LGPD).</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════ MENSAGENS ══════════════════════ */}
        {telaAtiva === 'mensagens' && (
          <div className="animate-fade-in-up max-w-2xl mx-auto space-y-5">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl shadow-xl text-white overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none animate-orb-pulse" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl shadow-inner flex-shrink-0">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Falar com a TdB</h2>
                  <p className="text-blue-100 text-sm mt-0.5">Envie uma mensagem para a nossa equipe.</p>
                </div>
                {userId && (
                  <span className="ml-auto text-[10px] font-mono bg-white/10 text-blue-100 px-2.5 py-1 rounded-lg flex items-center gap-1 hidden sm:flex">
                    <Hash size={9} />{gerarTicket(userId)}
                  </span>
                )}
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-700 overflow-hidden">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Assunto</label>
                  <select
                    value={assuntoMensagem}
                    onChange={e => setAssuntoMensagem(e.target.value)}
                    className={`${inputClass} pr-8`}
                  >
                    <option>Dúvida sobre consulta</option>
                    <option>Reagendar consulta</option>
                    <option>Informação geral</option>
                    <option>Problema com cadastro</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Mensagem</label>
                  <textarea
                    value={textoMensagem}
                    onChange={e => setTextoMensagem(e.target.value)}
                    placeholder="Escreva aqui a sua mensagem..."
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-700/20 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden sm:flex items-center gap-1">
                  <Hash size={10} className="text-[#FF8C00]" />{userId ? gerarTicket(userId) : '—'}
                  <span className="text-slate-300 dark:text-slate-600 ml-1">· vinculado automaticamente</span>
                </span>
                <button
                  onClick={handleEnviarMensagem}
                  disabled={!textoMensagem.trim() || enviandoMsg}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                >
                  <Send size={14} />
                  {enviandoMsg ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </div>
            </div>

            {/* Histórico */}
            {mensagens.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-1">Mensagens enviadas</h3>
                {[...mensagens].reverse().map((msg, i) => {
                  const statusKey = String(msg.id);
                  const statusAdmin: string = (() => {
                    try { return (JSON.parse(localStorage.getItem('tdb_status_contatos') || '{}'))[statusKey] ?? 'aberto'; }
                    catch { return 'aberto'; }
                  })();
                  const statusCfg = statusAdmin === 'concluido'
                    ? { label: 'Respondido', cls: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400', dot: 'bg-green-400' }
                    : statusAdmin === 'em_andamento'
                    ? { label: 'Em análise',  cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',  dot: 'bg-amber-400 animate-pulse' }
                    : { label: 'Aguardando',  cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',      dot: 'bg-slate-300' };
                  const dataFmt = new Date(msg.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={msg.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{msg.assunto}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusCfg.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} /> {statusCfg.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-1"><Clock size={10} /> {dataFmt}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{msg.texto}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-slate-500">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-20 animate-float" />
                <p className="text-sm font-medium">Nenhuma mensagem enviada ainda.</p>
                <p className="text-xs mt-1 opacity-60">Usa o formulário acima para contactar a equipa.</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ CONSULTAS ══════════════════════ */}
        {telaAtiva === 'consultas' && (
          <div className="animate-fade-in-up max-w-2xl mx-auto">

            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#8dc63f] to-emerald-600 p-6 rounded-3xl shadow-xl text-white overflow-hidden mb-6">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none animate-orb-pulse" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl shadow-inner flex-shrink-0">
                  <CalendarCheck size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Consultas</h2>
                  <p className="text-green-100 text-sm mt-0.5">
                    {ofertaRecebida?.status === 'pendente'
                      ? 'Escolha o melhor horário para si.'
                      : ofertaRecebida?.status === 'confirmado'
                      ? 'A sua consulta está confirmada!'
                      : 'Aqui aparecerão as propostas do seu dentista.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Oferta pendente */}
            {ofertaRecebida?.status === 'pendente' ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-green-50/70 to-transparent dark:from-green-950/20">
                  <p className="text-[11px] font-bold text-[#8dc63f] uppercase tracking-wider mb-1">Proposta do seu dentista</p>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">{ofertaRecebida.procedimento}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                    Dr(a). <strong>{ofertaRecebida.dentistaNome}</strong> disponibilizou {ofertaRecebida.slots.length} opção(ões). Escolha a que melhor se adequa.
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Selecione um horário:</p>
                  {ofertaRecebida.slots.map((slot, i) => {
                    const [ano, mes, dia] = slot.data.split('-');
                    const dataObj   = new Date(Number(ano), Number(mes) - 1, Number(dia));
                    const diaSemana = DIAS_SEMANA[dataObj.getDay()];
                    const sel       = slotEscolhidoId === slot.id;
                    return (
                      <label
                        key={slot.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 animate-fade-in-up ${
                          sel
                            ? 'border-[#8dc63f] bg-green-50 dark:bg-green-950/20 shadow-md shadow-green-100 dark:shadow-green-900/20'
                            : 'border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/40 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/30'
                        }`}
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <input
                          type="radio" name="slot" value={slot.id}
                          checked={sel} onChange={() => setSlotEscolhidoId(slot.id)}
                          className="accent-[#8dc63f] w-4 h-4 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className={`font-bold text-base transition-colors ${sel ? 'text-[#8dc63f]' : 'text-gray-800 dark:text-white'}`}>
                            {diaSemana}, {dia}/{mes}/{ano}
                          </p>
                          <p className="text-gray-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                            <Clock size={13} /> {slot.hora}
                          </p>
                        </div>
                        {sel && <CheckCircle2 size={22} className="text-[#8dc63f] flex-shrink-0 animate-pop-in" />}
                      </label>
                    );
                  })}
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={handleConfirmarSlot}
                    disabled={!slotEscolhidoId}
                    className="w-full bg-gradient-to-r from-[#8dc63f] to-emerald-500 text-white font-black py-4 rounded-2xl hover:from-[#7ebd34] hover:to-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30 flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    <CheckCircle2 size={20} /> Confirmar este Horário
                  </button>
                </div>
              </div>

            ) : ofertaRecebida?.status === 'confirmado' ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden animate-scale-in">
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-[#8dc63f] to-emerald-500" />

                <div className="px-8 py-10 text-center border-b border-gray-50 dark:border-slate-700">
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="absolute w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-full animate-orb-pulse" />
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center ring-4 ring-emerald-50 dark:ring-emerald-950/30 relative z-10">
                      <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2.5} />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-[#FF8C00] rounded-full p-1.5 shadow-md z-20 animate-pop-in">
                      <Sparkles size={13} className="text-white" />
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

                <div className="p-6 space-y-3">
                  {slotConfirmado && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                      <div className="bg-emerald-100 dark:bg-emerald-950/30 rounded-xl p-2.5 flex-shrink-0">
                        <CalendarDays size={20} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Data e Hora</p>
                        <p className="font-bold text-gray-900 dark:text-white">{confirmedDiaSemana}, {confirmedDataFormatada}</p>
                        <p className="text-gray-400 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5"><Clock size={11} /> {slotConfirmado.hora}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-md">
                      {ofertaRecebida.dentistaNome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Dentista</p>
                      <p className="font-bold text-gray-900 dark:text-white truncate">Dr(a). {ofertaRecebida.dentistaNome}</p>
                      {ofertaRecebida.dentistaCidade && (
                        <p className="text-gray-400 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5"><MapPin size={11} /> {ofertaRecebida.dentistaCidade}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4">
                    <Bell size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-600 dark:text-blue-300 text-xs font-medium leading-relaxed">
                      Receberá lembretes por e-mail <strong>3, 2 e 1 dia(s)</strong> antes da consulta.
                    </p>
                  </div>

                  <button
                    onClick={() => setMapaRotaAberto(true)}
                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FF8C00] to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/30 text-sm"
                  >
                    <Navigation size={16} />
                    Ver Rota até a Consulta
                    <span className="ml-1 bg-white/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full">NOVO</span>
                  </button>
                </div>
              </div>

            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm p-8 animate-scale-in">
                <EmptyState
                  icon={CalendarCheck}
                  title="Sem propostas pendentes"
                  description="Quando um dentista voluntário enviar opções de horário, elas aparecerão aqui para você escolher."
                />
              </div>
            )}
          </div>
        )}
      {/* ── Mapa ── */}
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
    </DashboardLayout>
  );
}
