import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useForm } from 'react-hook-form';
import { LayoutDashboard, LogOut, Clock, CalendarDays, Users, ClipboardList, Activity, CheckCircle2, AlertCircle, TrendingUp, Bell, CalendarCheck, ChevronRight, Phone, Mail, Navigation } from 'lucide-react';
import { MapaRota } from '../components/MapaRota';

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
  const userRole = sessionStorage.getItem('userRole');
  const userId = sessionStorage.getItem('userId');

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem' | 'consultas'>('painel');
  const [historicoPaciente, setHistoricoPaciente] = useState<HistoricoConsulta[]>([]);
  const [fichaEnviada, setFichaEnviada] = useState(false);
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
  useEffect(() => {
    if (!usuarioLogado || userRole !== 'paciente' || !userId) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/pacientes/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.cidade) setPacienteInfo({ cidade: data.cidade, pais: data.pais || 'Brasil' });
      })
      .catch(() => {});

    fetch(`${API_URL}/pacientes/${userId}/historico`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setHistoricoPaciente(data); })
      .catch(() => {});

    fetch(`${API_URL}/ofertas/paciente/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setOfertaRecebida(data as OfertaAgendamento);
      })
      .catch(() => {});

  }, [navigate, userRole, userId, usuarioLogado]);

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

  const navBtnClass = (ativa: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${ativa ? 'bg-[#FF8C00] text-white shadow-sm hover:bg-[#E67E22]' : 'text-gray-500 hover:bg-gray-50'}`;

  const inputClass = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none';

  return (
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF8C00] flex items-center justify-center font-bold text-xl border border-orange-100">
            {usuarioLogado?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 truncate w-[160px]">{usuarioLogado}</p>
            <p className="text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">Beneficiário TdB</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button onClick={() => setTelaAtiva('painel')} className={navBtnClass(telaAtiva === 'painel')}>
            <LayoutDashboard size={20} /> O Meu Painel
          </button>
          <button onClick={() => setTelaAtiva('triagem')} className={navBtnClass(telaAtiva === 'triagem')}>
            <ClipboardList size={20} /> Ficha de Triagem
          </button>
          <button onClick={() => setTelaAtiva('consultas')} className={`${navBtnClass(telaAtiva === 'consultas')} relative`}>
            <CalendarCheck size={20} /> Consultas
            {ofertaRecebida?.status === 'pendente' && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#FF8C00] text-[10px] font-black animate-pulse">!</span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-[1000px] mx-auto w-full relative">
        {mensagemSucesso && (() => {
          const isErro = mensagemSucesso.startsWith('__erro__');
          const texto = isErro ? mensagemSucesso.replace('__erro__', '') : mensagemSucesso;
          return (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 w-max ${isErro ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'}`}>
              <CheckCircle2 size={20} /> {texto}
            </div>
          );
        })()}

        {telaAtiva === 'painel' && (
          <div className="animate-fade-in space-y-8">

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
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Olá, {usuarioLogado}! 👋</h2>
                <p className="text-gray-500 text-lg">Bem-vindo ao seu painel da Turma do Bem.</p>
              </div>
              {!fichaEnviada && (
                <button onClick={() => setTelaAtiva('triagem')}
                  className="bg-[#FF8C00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E67E22] transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                  <ClipboardList size={20} /> Preencher Triagem
                </button>
              )}
            </div>

            {/* Barra de progresso do tratamento */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-orange-100 p-2 rounded-lg text-[#FF8C00]"><TrendingUp size={20} /></div>
                <h3 className="font-bold text-gray-800 text-lg">Progresso do Tratamento</h3>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-4xl font-black text-[#FF8C00]">{consultasConcluidas}
                    <span className="text-lg font-semibold text-gray-400"> / {TOTAL_CONSULTAS_PLANO}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">consultas realizadas</p>
                </div>
                <div className="text-right space-y-1">
                  {consultasAgendadas > 0 && (
                    <span className="inline-flex items-center gap-1 bg-orange-50 text-[#FF8C00] text-xs font-bold px-3 py-1 rounded-full">
                      <Clock size={12} /> {consultasAgendadas} agendada{consultasAgendadas > 1 ? 's' : ''}
                    </span>
                  )}
                  {consultasConcluidas >= TOTAL_CONSULTAS_PLANO && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Tratamento concluído!
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
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
                  <span key={i} className={`text-[10px] font-bold ${i < consultasConcluidas ? 'text-[#FF8C00]' : 'text-gray-300'}`}>
                    {i + 1}ª
                  </span>
                ))}
              </div>
              {historicoPaciente.length === 0 && (
                <p className="text-xs text-gray-400 mt-3 text-center">Preencha a triagem para iniciar o seu tratamento.</p>
              )}
            </div>

            {/* Histórico */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-[#FF8C00]"><Activity size={20} /></div>
                <h3 className="font-bold text-gray-800 text-lg">O Meu Histórico e Consultas</h3>
              </div>
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                  {historicoPaciente.length > 0 ? (
                    historicoPaciente.map((item, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className={`absolute w-6 h-6 rounded-full -left-[13px] top-0 border-4 border-white shadow-sm flex items-center justify-center ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`}>
                          {item.status === 'Agendado' ? <Clock size={10} className="text-white" /> : <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 text-lg">{item.titulo}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.status === 'Agendado' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.proc && <p className="text-gray-600 text-sm mb-3 font-medium">{item.proc}</p>}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14} /> {item.data}</span>
                            {item.hora && <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg"><Clock size={14} /> {item.hora}</span>}
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg"><Users size={14} /> Dr(a). {item.dentista}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm pl-4">Ainda não possui histórico de consultas. Preencha a Ficha de Triagem.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {telaAtiva === 'consultas' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl text-[#8dc63f]">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Consultas</h2>
                <p className="text-gray-500 text-sm">Escolha o melhor horário ou veja os agendamentos.</p>
              </div>
            </div>

            {/* Pending offer */}
            {ofertaRecebida?.status === 'pendente' ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[#8dc63f]/10 to-transparent border-b border-gray-100">
                  <p className="text-[11px] font-bold text-[#8dc63f] uppercase tracking-wider mb-1">Proposta do seu dentista</p>
                  <h3 className="text-xl font-black text-gray-800">{ofertaRecebida.procedimento}</h3>
                  <p className="text-gray-500 text-sm mt-1">Dr(a). {ofertaRecebida.dentistaNome} disponibilizou {ofertaRecebida.slots.length} opção(ões). Escolha a que melhor se adequa à sua agenda.</p>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Selecione um horário:</p>
                  {ofertaRecebida.slots.map(slot => {
                    const [ano, mes, dia] = slot.data.split('-');
                    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
                    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
                    const diaSemana = diasSemana[dataObj.getDay()];
                    const selecionado = slotEscolhidoId === slot.id;
                    return (
                      <label key={slot.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selecionado ? 'border-[#8dc63f] bg-green-50' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                        <input type="radio" name="slot" value={slot.id} checked={selecionado}
                          onChange={() => setSlotEscolhidoId(slot.id)}
                          className="accent-[#8dc63f] w-4 h-4 flex-shrink-0" />
                        <div className="flex-1">
                          <p className={`font-bold text-base ${selecionado ? 'text-[#8dc63f]' : 'text-gray-800'}`}>
                            {diaSemana}, {dia}/{mes}/{ano}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
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
              <div className="space-y-4">
                {/* Card de confirmação */}
                <div className="bg-white p-8 rounded-3xl border border-green-200 shadow-sm text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-[#8dc63f]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Consulta Confirmada!</h3>
                  <p className="text-gray-500 text-sm">{ofertaRecebida.procedimento}</p>
                  {ofertaRecebida.slotEscolhido && (
                    <div className="mt-4 inline-flex items-center gap-3 bg-green-50 border border-green-200 px-5 py-3 rounded-xl">
                      <CalendarDays size={18} className="text-[#8dc63f]" />
                      <div className="text-left">
                        <p className="font-bold text-gray-800">
                          {ofertaRecebida.slotEscolhido.data.split('-').reverse().join('/')}
                        </p>
                        <p className="text-gray-500 text-sm">{ofertaRecebida.slotEscolhido.hora} · Dr(a). {ofertaRecebida.dentistaNome}</p>
                      </div>
                    </div>
                  )}

                  {/* Botão Ver Rota */}
                  <button
                    onClick={() => setMapaRotaAberto(true)}
                    className="mt-5 w-full flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg text-sm"
                  >
                    <Navigation size={17} className="text-[#FF8C00]" />
                    Ver Rota até a Consulta
                    <span className="ml-1 bg-[#FF8C00] text-white text-[10px] font-black px-2 py-0.5 rounded-full">NOVO</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center min-h-[350px] justify-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <CalendarCheck size={48} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sem propostas pendentes</h3>
                <p className="text-gray-500 max-w-sm">Quando um dentista voluntário enviar opções de horário, elas aparecerão aqui para você escolher.</p>
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl text-[#FF8C00]">
                <ClipboardList size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Ficha de Triagem</h2>
                <p className="text-gray-500 text-sm">Responda para que a nossa IA encontre o dentista mais adequado.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              {fichaEnviada ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ficha Recebida!</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">A sua situação foi registada e priorizada pelo nosso sistema. Um dentista da sua região entrará em contacto em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Contato */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
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
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" /> E-mail para Lembretes
                      </label>
                      <input type="email" placeholder="seu@email.com"
                        {...register('email', {
                          required: 'E-mail obrigatório',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
                        })}
                        className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                      <p className="text-[11px] text-gray-400 mt-1">Você receberá lembretes 3, 2 e 1 dia(s) antes da consulta.</p>
                    </div>
                  </div>

                  {/* Dados pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">A sua Idade (11–17 anos)</label>
                      <input type="number" min="11" max="17" placeholder="Ex: 15"
                        {...register('idade', { required: true, min: 11, max: 17 })}
                        className={`${inputClass} ${errors.idade ? 'border-red-500' : ''}`} />
                      {errors.idade && <span className="text-red-500 text-xs mt-1">Entre 11 e 17 anos</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Renda Familiar (Salários Mínimos)</label>
                      <input type="number" step="0.5" min="0" placeholder="Ex: 1.5"
                        {...register('renda', {
                          required: 'Campo obrigatório',
                          min: { value: 0, message: 'Renda não pode ser negativa' }
                        })}
                        className={`${inputClass} ${errors.renda ? 'border-red-500' : ''}`} />
                      {errors.renda && <span className="text-red-500 text-xs mt-1">{errors.renda.message}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-orange-50/50 border border-orange-100 rounded-2xl">
                    <div className="md:col-span-2">
                      <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2 mb-4"><AlertCircle size={16} /> Avaliação da Dor</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Intensidade da Dor</label>
                      <select {...register('tipoDor', { required: true })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none">
                        <option value="leve">Leve (Apenas incômodo)</option>
                        <option value="moderada">Moderada (Dói ao mastigar)</option>
                        <option value="forte">Forte (Não consegue dormir)</option>
                        <option value="dente quebrado">Dente Quebrado/Acidente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Dias com Dor</label>
                      <input type="number" min="0" placeholder="Ex: 5"
                        {...register('diasDor', {
                          required: 'Campo obrigatório',
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                        className={`${inputClass} ${errors.diasDor ? 'border-red-500' : ''}`} />
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
