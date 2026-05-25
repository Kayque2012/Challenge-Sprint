import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { Eye, EyeOff, Smile, Heart, Cloud, Users, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormData {
  email?: string;
  senha?: string;
}

export function Login() {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormData>();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [mostrarRedefinicao, setMostrarRedefinicao] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [enviandoRedefinicao, setEnviandoRedefinicao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const jaLogouAntes = sessionStorage.getItem('jaLogouAntes');

  const handleEsqueciSenha = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailDigitado = getValues('email');
    if (!emailDigitado) {
      setMensagem({ texto: 'Digite seu e-mail no campo acima antes de redefinir a senha.', tipo: 'erro' });
      return;
    }
    setMensagem({ texto: '', tipo: '' });
    setNovaSenha('');
    setConfirmarSenha('');
    setMostrarRedefinicao(prev => !prev);
  };

  const handleRedefinirSenha = async () => {
    if (novaSenha.length < 6) {
      setMensagem({ texto: 'A senha deve ter no mínimo 6 caracteres.', tipo: 'erro' });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
      return;
    }
    setEnviandoRedefinicao(true);
    try {
      const res = await fetch(`${API_URL}/pacientes/redefinir-senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: getValues('email'), novaSenha }),
      });
      if (res.ok) {
        setMensagem({ texto: 'Senha redefinida com sucesso! Faça login com a nova senha.', tipo: 'sucesso' });
        setMostrarRedefinicao(false);
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        const err = await res.json().catch(() => null);
        setMensagem({ texto: err?.erro || 'Erro ao redefinir senha. Tente novamente.', tipo: 'erro' });
      }
    } catch {
      setMensagem({ texto: 'Erro ao conectar com o servidor.', tipo: 'erro' });
    } finally {
      setEnviandoRedefinicao(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      });

      if (response.ok) {
        const usuario = await response.json();

        sessionStorage.setItem('userRole', usuario.tipo || 'paciente');
        sessionStorage.setItem('usuarioLogado', usuario.nome);
        sessionStorage.setItem('userId', String(usuario.id || ''));

        if (usuario.tipo === 'dentista' && usuario.cidade && usuario.cidade !== 'N/A') {
          sessionStorage.setItem('dentistaCidade', usuario.cidade);
        }

        sessionStorage.setItem('jaLogouAntes', '1');
        setMensagem({ texto: `Bem-vindo(a), ${usuario.nome}!`, tipo: 'sucesso' });

        setTimeout(() => {
          if (usuario.tipo === 'admin') navigate('/dashboard/admin');
          else if (usuario.tipo === 'dentista' || usuario.tipo === 'dev') navigate('/dashboard/dentista');
          else if (usuario.tipo === 'paciente') navigate('/dashboard/paciente');
          else navigate('/');
        }, 1000);
      } else {
        setMensagem({ texto: 'E-mail ou senha incorretos. Verifique e tente novamente.', tipo: 'erro' });
        setCarregando(false);
      }
    } catch {
      setMensagem({ texto: 'Erro ao conectar com o servidor. Verifique sua conexão.', tipo: 'erro' });
      setCarregando(false);
    }
  };

  const stats = [
    { icon: Smile,  value: '2.400+', label: 'Sorrisos' },
    { icon: Heart,  value: '180+',   label: 'Dentistas' },
    { icon: Users,  value: '1.800+', label: 'Jovens' },
  ];

  return (
    <main className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* ── Painel esquerdo — identidade visual ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#FF8C00] via-[#F5820A] to-[#E06000] flex-col justify-between p-12 relative overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-12 bottom-32 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute right-16 bottom-16 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <Cloud size={22} className="text-white flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Dentista na Nuvem</h1>
            <p className="text-orange-100 text-xs mt-0.5">Plataforma odontológica na nuvem</p>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-4">
              Sorrisos que<br />transformam<br />vidas
            </h2>
            <p className="text-orange-100 text-lg leading-relaxed max-w-sm">
              Conectamos jovens em vulnerabilidade social com dentistas voluntários de forma gratuita e humanizada.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                <Icon size={22} className="text-white mx-auto mb-2" />
                <p className="text-white font-black text-xl leading-none">{value}</p>
                <p className="text-orange-200 text-xs mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Depoimento / social proof */}
          <div className="bg-white/15 rounded-2xl p-5 border border-white/20">
            <p className="text-white text-sm leading-relaxed italic">
              "A Turma do Bem mudou minha vida. Hoje sorrio sem vergonha."
            </p>
            <p className="text-orange-200 text-xs mt-2 font-semibold">— Ana, 16 anos · São Paulo, SP</p>
          </div>
        </div>

        <p className="text-orange-300 text-xs relative z-10">© 2026 Dentista na Nuvem. Todos os direitos reservados.</p>
      </div>

      {/* ── Painel direito — formulário ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50 dark:bg-slate-950 min-h-screen">
        <div className="w-full max-w-[420px]">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-black text-[#FF8C00]">Dentista na Nuvem</h1>
            <p className="text-gray-400 text-sm mt-0.5">Plataforma odontológica na nuvem</p>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              {jaLogouAntes ? 'Bem-vindo de volta!' : 'Acessar conta'}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
              Entre para acessar o painel do Dentista na Nuvem.
            </p>
          </div>

          {/* Feedback */}
          {mensagem.texto && (
            <div role="alert" aria-live="polite" className={`flex items-start gap-3 p-4 rounded-xl mb-6 text-sm font-semibold border ${
              mensagem.tipo === 'erro'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              <span className="text-lg leading-none">{mensagem.tipo === 'erro' ? '⚠' : '✓'}</span>
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                className={`w-full px-4 py-3.5 bg-white dark:bg-slate-800 border-2 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-colors ${
                  errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:border-[#FF8C00]'
                }`}
                {...register('email', { required: 'O e-mail é obrigatório' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Senha</label>
                <button
                  type="button"
                  onClick={handleEsqueciSenha}
                  className="text-xs text-[#FF8C00] font-semibold hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3.5 pr-12 bg-white dark:bg-slate-800 border-2 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-colors ${
                    errors.senha ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:border-[#FF8C00]'
                  }`}
                  {...register('senha', { required: 'A senha é obrigatória' })}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(p => !p)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
              {errors.senha && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.senha.message}</p>}
            </div>

            {/* Redefinição de senha */}
            {mostrarRedefinicao && (
              <div className="p-5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-2xl space-y-4">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Redefinir senha</p>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 block">Nova Senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-[#FF8C00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 block">Confirme a Nova Senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-[#FF8C00]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRedefinirSenha}
                  disabled={enviandoRedefinicao}
                  className="w-full bg-[#FF8C00] text-white font-bold py-3 rounded-xl hover:bg-[#E67E22] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {enviandoRedefinicao && <Loader2 size={16} className="animate-spin" />}
                  {enviandoRedefinicao ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </div>
            )}

            {/* Botão entrar */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex items-center justify-center gap-2 bg-[#FF8C00] hover:bg-[#E67E22] disabled:opacity-70 text-white font-bold py-4 rounded-xl text-base shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {carregando ? (
                <><Loader2 size={20} className="animate-spin" /> Entrando...</>
              ) : (
                <>Entrar <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Links secundários */}
          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-[#FF8C00] font-bold hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
            <div className="flex items-center gap-2 justify-center bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 rounded-xl py-3 px-4">
              <Heart size={14} className="text-[#FF8C00]" />
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Quer apoiar a causa?{' '}
                <Link to="/Doador" className="text-[#FF8C00] font-black hover:underline">
                  Seja um Doador
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
