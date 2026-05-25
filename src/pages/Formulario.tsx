import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Calendar, DollarSign, Activity, Clock, MapPin, ShieldAlert, Mail, Lock } from 'lucide-react';
import { API_URL } from '../config';
import { ESTADOS_BRASIL, CIDADES_POR_ESTADO } from '../data/estadosCidades';

interface TriagemFormData {
  nome: string;
  idade: string;
  renda: string;
  tipoDor: string;
  diasDor: string;
  email: string;
  senha: string;
}

export function Formulario() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TriagemFormData>({
    defaultValues: { tipoDor: 'leve' },
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidadeInput, setCidadeInput] = useState('');
  const [cidadeValida, setCidadeValida] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const cidadesFiltradas = estadoSelecionado
    ? (CIDADES_POR_ESTADO[estadoSelecionado] || []).filter(c =>
        c.toLowerCase().includes(cidadeInput.toLowerCase())
      )
    : [];

  const onSubmit = async (data: TriagemFormData) => {
    if (!cidadeValida) {
      setMensagem({ texto: 'Por favor, selecione a sua cidade.', tipo: 'erro' });
      return;
    }
    if (!estadoSelecionado) {
      setMensagem({ texto: 'Por favor, selecione o seu estado.', tipo: 'erro' });
      return;
    }
    setIsSubmitting(true);
    setMensagem({ texto: 'A processar a triagem...', tipo: 'sucesso' });
    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          idade: Number(data.idade),
          rendaSalarioMinimo: Number(data.renda),
          tipoDor: data.tipoDor,
          tempoDorDias: Number(data.diasDor),
          pais: 'Brasil',
          cidade: cidadeValida,
          estado: ESTADOS_BRASIL.find(e => e.sigla === estadoSelecionado)?.nome || estadoSelecionado,
        }),
      });
      if (response.ok) {
        setMensagem({ texto: 'Triagem enviada! Acesse sua conta com o e-mail e senha cadastrados para acompanhar o atendimento.', tipo: 'sucesso' });
        reset();
        setEstadoSelecionado('');
        setCidadeInput('');
        setCidadeValida('');
      } else {
        const err = await response.json().catch(() => null);
        setMensagem({ texto: err?.erro || 'Erro ao enviar triagem. Tente novamente.', tipo: 'erro' });
      }
    } catch {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200';

  return (
    <main className="min-h-screen bg-[#F5F5DC] dark:bg-slate-900 py-12 px-4 font-sans flex justify-center items-start md:items-center pt-[100px] transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-slate-700 overflow-hidden">

        <div className="bg-gray-50/50 dark:bg-slate-700/30 p-8 pb-6 text-center border-b border-gray-100 dark:border-slate-700">
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-200 dark:border-orange-900/50">
            <ShieldAlert size={28} className="text-orange-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">Triagem Odontológica</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base mt-2 max-w-md mx-auto">
            Preencha os dados abaixo com precisão. O nosso algoritmo avaliará o seu caso para priorizar o atendimento.
          </p>
        </div>

        {mensagem.texto && (
          <div className={`mx-8 mt-6 p-4 rounded-xl font-medium text-center text-sm flex items-center justify-center gap-2 ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input type="text" placeholder="Ex: João da Silva"
                  {...register('nome', { required: true })} className={inputClass} />
              </div>
              {errors.nome && <span className="text-red-500 text-xs mt-1.5 block font-medium">Nome é obrigatório</span>}
            </div>

            {/* Idade */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Idade</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input type="number" min="11" max="17" placeholder="Entre 11 e 17 anos"
                  {...register('idade', { required: true, min: 11, max: 17 })} className={inputClass} />
              </div>
              {errors.idade && <span className="text-red-500 text-xs mt-1.5 block font-medium">Idade deve ser entre 11 e 17 anos</span>}
            </div>

            {/* Renda */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Renda Familiar (Salários)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input type="number" min="0" step="0.1" placeholder="Ex: 1.5"
                  {...register('renda', { required: true })} className={inputClass} />
              </div>
              {errors.renda && <span className="text-red-500 text-xs mt-1.5 block font-medium">Renda é obrigatória</span>}
            </div>

            {/* Gravidade da Dor */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Gravidade da Dor</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Activity size={18} className="text-orange-500" />
                </div>
                <select {...register('tipoDor', { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 appearance-none cursor-pointer font-medium">
                  <option value="leve">Leve (Suportável)</option>
                  <option value="moderada">Moderada (Dói ao mastigar)</option>
                  <option value="forte">Forte (Não consegue dormir)</option>
                  <option value="dente quebrado">Dente Quebrado / Urgência</option>
                </select>
              </div>
            </div>

            {/* Dias com a Dor */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Dias com a Dor</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input type="number" min="0" placeholder="Ex: 5"
                  {...register('diasDor', { required: true })} className={inputClass} />
              </div>
              {errors.diasDor && <span className="text-red-500 text-xs mt-1.5 block font-medium">Obrigatório</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input type="email" placeholder="seu@email.com"
                  {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className={inputClass} />
              </div>
              {errors.email && <span className="text-red-500 text-xs mt-1.5 block font-medium">E-mail válido é obrigatório</span>}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Senha (para acessar o painel)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input type="password" placeholder="Mínimo 6 caracteres"
                  {...register('senha', { required: true, minLength: 6 })} className={inputClass} />
              </div>
              {errors.senha && <span className="text-red-500 text-xs mt-1.5 block font-medium">Senha deve ter pelo menos 6 caracteres</span>}
              <p className="text-[11px] text-gray-400 mt-1">Guarde sua senha para acompanhar o atendimento no painel.</p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">Estado</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <select
                  value={estadoSelecionado}
                  onChange={(e) => { setEstadoSelecionado(e.target.value); setCidadeInput(''); setCidadeValida(''); }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 appearance-none cursor-pointer">
                  <option value="">Selecione o estado...</option>
                  {ESTADOS_BRASIL.map(e => (
                    <option key={e.sigla} value={e.sigla}>{e.nome}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Cidade — aparece após selecionar o estado */}
          {estadoSelecionado && (
            <div className="relative">
              <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                Cidade
                {cidadeValida && <span className="ml-2 text-[#FF8C00] normal-case font-semibold">✓ {cidadeValida}</span>}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  <MapPin size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Digite para buscar sua cidade..."
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-slate-700 border ${cidadeValida ? 'border-orange-400 bg-orange-50/30 dark:bg-orange-950/20' : 'border-gray-200 dark:border-slate-600'} rounded-xl text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200`}
                  value={cidadeValida || cidadeInput}
                  onChange={(e) => { setCidadeValida(''); setCidadeInput(e.target.value); setMostrarDropdown(true); }}
                  onFocus={() => setMostrarDropdown(true)}
                  onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
                  autoComplete="off"
                />
                {cidadeValida && (
                  <button
                    type="button"
                    onClick={() => { setCidadeValida(''); setCidadeInput(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                    title="Limpar cidade"
                  >×</button>
                )}
              </div>
              {mostrarDropdown && cidadeInput && !cidadeValida && cidadesFiltradas.length > 0 && (
                <ul className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg mt-1 max-h-[200px] overflow-y-auto">
                  {cidadesFiltradas.map(cidade => (
                    <li key={cidade}
                      className="px-4 py-3 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF8C00] dark:text-slate-200 font-medium text-sm border-b border-gray-50 dark:border-slate-700 last:border-0"
                      onMouseDown={() => { setCidadeValida(cidade); setCidadeInput(''); setMostrarDropdown(false); }}>
                      {cidade}
                    </li>
                  ))}
                </ul>
              )}
              {mostrarDropdown && cidadeInput && !cidadeValida && cidadesFiltradas.length === 0 && (
                <div className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg mt-1 px-4 py-3 text-sm text-gray-500 dark:text-slate-400">
                  Nenhuma cidade encontrada para "{cidadeInput}". Verifique a grafia.
                </div>
              )}
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-700">
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#FF8C00] to-[#f39c12] text-white font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_25px_rgba(255,140,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? 'A enviar...' : 'Enviar para Triagem'}
            </button>
            <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
              Os seus dados estão protegidos e serão utilizados apenas para fins médicos.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
