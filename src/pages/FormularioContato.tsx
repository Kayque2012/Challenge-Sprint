import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, User, Mail, HelpCircle, MessageSquare, X, Bot, ChevronDown } from 'lucide-react';
import { API_URL } from '../config';

// ── FAQ Bot data ──────────────────────────────────────────────────────────────
const BOT_FAQ: { q: string; a: string }[] = [
  { q: 'Como me cadastrar?', a: 'Clique em "Cadastre-se" no menu principal e preencha o formulário com seus dados. O cadastro é gratuito e leva menos de 2 minutos!' },
  { q: 'O atendimento é gratuito?', a: 'Sim, 100% gratuito! O Dentista na Nuvem conecta jovens de 11 a 17 anos em vulnerabilidade social a dentistas voluntários sem nenhum custo.' },
  { q: 'Como funciona a triagem?', a: 'Após o cadastro, preencha a Ficha de Triagem no seu painel. O algoritmo Score TdB avalia urgência clínica, renda e localização para priorizar seu atendimento.' },
  { q: 'Como ser doador?', a: 'Acesse a página "Seja Doador" para fazer uma doação via PIX. Se você é paulistano, também pode direcionar créditos da Nota Fiscal Paulista para a Turma do Bem sem custo!' },
  { q: 'O que é Apolônias do Bem?', a: 'O Programa Apolônias do Bem oferece atendimento odontológico humanizado e gratuito para mulheres vítimas de violência doméstica, em parceria com casas de acolhimento.' },
  { q: 'Quanto tempo leva?', a: 'O tempo varia conforme a urgência clínica. Casos urgentes (dor forte, dente quebrado) são priorizados pelo sistema. A maioria dos pacientes recebe uma proposta de horário em até 30 dias.' },
  { q: 'Sou dentista, como me voluntariar?', a: 'Cadastre-se como dentista voluntário na página de Cadastro. Após aprovação, você terá acesso ao painel do dentista com a fila de pacientes da sua cidade.' },
];

interface BotMsg { from: 'user' | 'bot'; text: string; }

function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [msgs, setMsgs] = useState<BotMsg[]>([
    { from: 'bot', text: 'Olá! Sou o assistente virtual do Dentista na Nuvem. Selecione uma dúvida abaixo ou faça sua pergunta!' },
  ]);
  const [inputVal, setInputVal] = useState('');

  const responder = (pergunta: string) => {
    setMsgs(prev => [...prev, { from: 'user', text: pergunta }]);
    const match = BOT_FAQ.find(f => f.q.toLowerCase() === pergunta.toLowerCase() || pergunta.toLowerCase().includes(f.q.toLowerCase().split(' ')[0]));
    const resposta = match?.a ?? 'Para essa dúvida específica, recomendo preencher o formulário acima e nossa equipe entrará em contato em até 48 horas!';
    setTimeout(() => setMsgs(prev => [...prev, { from: 'bot', text: resposta }]), 400);
  };

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    responder(inputVal.trim());
    setInputVal('');
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(v => !v)}
        aria-label={aberto ? 'Fechar assistente virtual' : 'Abrir assistente virtual'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF8C00] hover:bg-[#E67E22] text-white rounded-full shadow-xl shadow-orange-300/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {aberto ? <X size={22} aria-hidden="true" /> : <Bot size={22} aria-hidden="true" />}
      </button>

      {/* Painel do chat */}
      {aberto && (
        <div
          role="dialog"
          aria-label="Assistente virtual Dentista na Nuvem"
          className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden"
          style={{ maxHeight: '70vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF8C00] to-[#f39c12] px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Assistente DnN</p>
              <p className="text-orange-100 text-[11px] mt-0.5">Dentista na Nuvem · IA</p>
            </div>
            <button
              onClick={() => setAberto(false)}
              aria-label="Fechar chat"
              className="ml-auto text-white/70 hover:text-white transition-colors"
            >
              <ChevronDown size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite" aria-label="Mensagens do chat">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'user' ? 'bg-[#FF8C00] text-white rounded-br-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Perguntas rápidas */}
          <div className="px-4 pb-2 flex-shrink-0">
            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Dúvidas frequentes:</p>
            <div className="flex flex-wrap gap-1.5">
              {BOT_FAQ.slice(0, 4).map(f => (
                <button
                  key={f.q}
                  onClick={() => responder(f.q)}
                  className="text-[11px] font-semibold bg-orange-50 dark:bg-orange-950/30 text-[#FF8C00] border border-orange-100 dark:border-orange-900/40 px-3 py-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                >
                  {f.q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleInput} className="p-4 pt-2 border-t border-gray-100 dark:border-slate-700 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Digite sua dúvida..."
              aria-label="Digite sua pergunta"
              className="flex-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 outline-none focus:border-[#FF8C00]"
            />
            <button
              type="submit"
              aria-label="Enviar pergunta"
              className="bg-[#FF8C00] text-white p-2.5 rounded-xl hover:bg-[#E67E22] transition-colors"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

interface ContatoFormData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export function FormularioContato() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<ContatoFormData>({
    defaultValues: {
      assunto: ''
    }
  });

  const onSubmit = async (data: ContatoFormData) => {
    setIsLoading(true);
    setErro('');
    try {
      const response = await fetch(`${API_URL}/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao enviar');
      navigate('/contato');
    } catch {
      setErro('Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] dark:bg-slate-900 flex justify-center items-center py-[120px] px-4 font-sans transition-colors duration-300">

      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-slate-700 overflow-hidden relative">

        {/* BOTÃO DE VOLTAR - Modernizado */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/contato"
            className="text-gray-500 dark:text-slate-400 hover:text-[#FF8C00] bg-white/80 dark:bg-slate-700/80 hover:bg-orange-50 dark:hover:bg-orange-950/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-200 no-underline shadow-sm border border-gray-100 dark:border-slate-600"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>

        {/* CABEÇALHO */}
        <div className="bg-gray-50/50 dark:bg-slate-700/30 pt-16 pb-8 px-8 text-center border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">Fale Conosco</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base mt-2 max-w-md mx-auto">
            Tem alguma dúvida, quer ser doador ou falar com a ONG? Preencha os campos abaixo e entraremos em contacto.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva"
                  {...register("nome", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.nome && <span className="text-red-500 text-xs mt-1.5 block font-medium">Nome é obrigatório</span>}
            </div>

            {/* E-mail */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">E-mail de Contato</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="exemplo@email.com"
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.email && <span className="text-red-500 text-xs mt-1.5 block font-medium">E-mail inválido</span>}
            </div>

            {/* Assunto */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Assunto</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <HelpCircle size={18} className="text-orange-500" />
                </div>
                <select 
                  {...register("assunto", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 appearance-none cursor-pointer font-medium"
                >
                  <option value="" disabled>Selecione o motivo do contato...</option>
                  <option value="Dúvida Geral">Dúvida Geral</option>
                  <option value="Quero ser Doador">Quero ser Doador</option>
                  <option value="Imprensa">ONG / Comunicação</option>
                  <option value="Parcerias">Parcerias com Clínicas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              {errors.assunto && <span className="text-red-500 text-xs mt-1.5 block font-medium">Assunto é obrigatório</span>}
            </div>

            {/* Mensagem */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">A sua Mensagem</label>
              <div className="relative group">
                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                  <MessageSquare size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <textarea 
                  rows={5}
                  placeholder="Escreva aqui a sua mensagem..."
                  {...register("mensagem", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 resize-none leading-relaxed"
                />
              </div>
              {errors.mensagem && <span className="text-red-500 text-xs mt-1.5 block font-medium">A mensagem não pode estar vazia</span>}
            </div>

          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-700">
            {erro && (
              <p className="text-red-600 text-sm font-semibold text-center mb-4 bg-red-50 border border-red-200 rounded-xl py-2 px-4">{erro}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF8C00] to-[#f39c12] text-white font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_25px_rgba(255,140,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Send size={20} />
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </div>

        </form>
      </div>
      <ChatBot />
    </main>
  );
}