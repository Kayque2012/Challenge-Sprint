import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, ApiError } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

import type { UserRole } from '../contexts/AuthContext';
import {
  Eye, EyeOff, Smile, Heart, Users, ArrowRight,
  Loader2, CheckCircle2, Sparkles,
} from 'lucide-react';
import { Logo } from '../components/Logo';

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  senha: z.string().min(1, 'Senha obrigatória').min(6, 'Mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const [mensagem, setMensagem]                   = useState({ texto: '', tipo: '' });
  const [mostrarRedefinicao, setMostrarRedefinicao] = useState(false);
  const [novaSenha, setNovaSenha]                 = useState('');
  const [confirmarSenha, setConfirmarSenha]       = useState('');
  const [enviandoRedefinicao, setEnviandoRedefinicao] = useState(false);
  const [carregando, setCarregando]               = useState(false);
  const [mostrarSenha, setMostrarSenha]           = useState(false);
  const navigate   = useNavigate();
  const jaLogouAntes = sessionStorage.getItem('jaLogouAntes');

  /* ── Depoimentos rotacionados ── */
  const depoimentos = [
    { texto: 'A Turma do Bem mudou minha vida. Hoje sorrio sem vergonha.',              autor: 'Ana, 16 anos',     local: 'São Paulo, SP'       },
    { texto: 'Nunca imaginei ter acesso a um dentista. Agora meu sorriso é livre.',     autor: 'Lucas, 14 anos',   local: 'Recife, PE'          },
    { texto: 'O dentista foi incrível. Me tratou com muito cuidado e respeito.',        autor: 'Beatriz, 17 anos', local: 'Fortaleza, CE'       },
    { texto: 'Passei anos com dor. A TdB resolveu o que eu achei que era impossível.',  autor: 'Rafael, 15 anos',  local: 'Salvador, BA'        },
    { texto: 'Graças à Turma do Bem, voltei a sorrir nas fotos da escola.',             autor: 'Júlia, 13 anos',   local: 'Belo Horizonte, MG'  },
  ];
  const [depIdx, setDepIdx]   = useState(0);
  const [depFade, setDepFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setDepFade(false);
      setTimeout(() => {
        setDepIdx(i => (i + 1) % depoimentos.length);
        setDepFade(true);
      }, 380);
    }, 4500);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Handlers ── */
  const handleEsqueciSenha = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!getValues('email')) {
      setMensagem({ texto: 'Digite seu e-mail no campo acima antes de redefinir a senha.', tipo: 'erro' });
      return;
    }
    setMensagem({ texto: '', tipo: '' });
    setNovaSenha('');
    setConfirmarSenha('');
    setMostrarRedefinicao(prev => !prev);
  };

  const handleRedefinirSenha = async () => {
    if (novaSenha.length < 6) { setMensagem({ texto: 'A senha deve ter no mínimo 6 caracteres.', tipo: 'erro' }); return; }
    if (novaSenha !== confirmarSenha) { setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' }); return; }
    setEnviandoRedefinicao(true);
    try {
      await authApi.redefinirSenha(getValues('email') ?? '', novaSenha);
      setMensagem({ texto: 'Senha redefinida com sucesso! Faça login com a nova senha.', tipo: 'sucesso' });
      setMostrarRedefinicao(false); setNovaSenha(''); setConfirmarSenha('');
    } catch (err) {
      setMensagem({ texto: err instanceof ApiError ? err.message : 'Erro ao conectar com o servidor.', tipo: 'erro' });
    } finally { setEnviandoRedefinicao(false); }
  };

  const onSubmit = async (data: LoginFormData) => {
    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });
    try {
      const usuario = await authApi.login(data.email, data.senha);
      const role = (usuario.tipo || 'paciente') as UserRole;
      login({
        nome:           usuario.nome,
        role,
        id:             String(usuario.id || ''),
        dentistaCidade: (role === 'dentista' && usuario.cidade && usuario.cidade !== 'N/A')
                          ? usuario.cidade : undefined,
      }, usuario.token);
      toast.success(`Bem-vindo(a), ${usuario.nome}!`);
      setTimeout(() => {
        if (role === 'admin')                           navigate('/dashboard/admin');
        else if (role === 'dentista' || role === 'dev') navigate('/dashboard/dentista');
        else if (role === 'paciente')                   navigate('/dashboard/paciente');
        else navigate('/');
      }, 800);
    } catch (err) {
      const msg = err instanceof ApiError && err.status === 401
        ? 'E-mail ou senha incorretos. Verifique e tente novamente.'
        : 'Erro ao conectar com o servidor. Verifique sua conexão.';
      setMensagem({ texto: msg, tipo: 'erro' });
      setCarregando(false);
    }
  };

  const stats = [
    { icon: Smile,  value: '2.400+', label: 'Sorrisos' },
    { icon: Heart,  value: '180+',   label: 'Dentistas' },
    { icon: Users,  value: '1.800+', label: 'Jovens' },
  ];

  const inputBase = 'w-full px-4 py-3.5 bg-white dark:bg-slate-800 border-2 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all duration-200';

  return (
    <main className="min-h-screen flex transition-colors duration-300 bg-[#F5F5DC] dark:bg-[#080c17]">

      {/* ══════════ PAINEL ESQUERDO ══════════ */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#FF8C00] via-[#F07800] to-[#D96000] flex-col justify-between relative overflow-hidden min-h-screen">

        {/* Orbs decorativos */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-16 bottom-40  w-64 h-64 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute  right-10 bottom-20 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute  left-1/2 top-1/3   w-20 h-20 bg-white/5  rounded-full pointer-events-none" />

        {/* Conteúdo — padding top grande para descer do header fixo */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 py-16 pt-28 space-y-8">

          {/* Chip */}
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 w-fit">
            <Sparkles size={13} className="text-yellow-200" />
            <span className="text-white/90 text-xs font-bold tracking-wide">Atendimento 100% gratuito</span>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-5xl font-display font-black text-white leading-[1.08] mb-5">
              Sorrisos que<br />transformam<br />vidas
            </h2>
            <p className="text-orange-100 text-base leading-relaxed max-w-sm">
              Conectamos jovens em vulnerabilidade social com dentistas voluntários de forma gratuita e humanizada.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors">
                <Icon size={20} className="text-white/80 mx-auto mb-2" />
                <p className="text-white font-black text-xl leading-none">{value}</p>
                <p className="text-orange-200 text-xs mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Depoimento animado */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 min-h-[108px] flex flex-col justify-between">
            <div
              style={{
                opacity:    depFade ? 1 : 0,
                transform:  depFade ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.38s ease, transform 0.38s ease',
              }}
            >
              <p className="text-white text-sm leading-relaxed italic">
                "{depoimentos[depIdx].texto}"
              </p>
              <p className="text-orange-200 text-xs mt-2.5 font-semibold">
                — {depoimentos[depIdx].autor} · {depoimentos[depIdx].local}
              </p>
            </div>
            {/* Indicadores */}
            <div className="flex gap-1.5 mt-4">
              {depoimentos.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width:      i === depIdx ? '20px' : '6px',
                    height:     '6px',
                    background: i === depIdx ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.35)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-orange-300/70 text-xs relative z-10 px-12 pb-8">
          © 2026 Dentista na Nuvem. Todos os direitos reservados.
        </p>
      </div>

      {/* ══════════ PAINEL DIREITO — FORMULÁRIO ══════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 min-h-screen">
        <div className="w-full max-w-[420px]">

          {/* Logo mobile (só visível em telas menores que lg) */}
          <div className="lg:hidden flex flex-col items-center mb-8 mt-6">
            <Logo variant="full" size={30} color="#FF8C00" />
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Plataforma odontológica na nuvem</p>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white leading-tight">
              {jaLogouAntes ? 'Bem-vindo de volta! 👋' : 'Acessar conta'}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
              Entre para acessar o painel do Dentista na Nuvem.
            </p>
          </div>

          {/* Feedback */}
          {mensagem.texto && (
            <div
              role="alert"
              aria-live="polite"
              className={`flex items-start gap-3 p-4 rounded-xl mb-6 text-sm font-semibold border animate-fade-in-down ${
                mensagem.tipo === 'erro'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'
                  : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'
              }`}
            >
              {mensagem.tipo === 'erro'
                ? <span className="text-lg leading-none mt-0.5">⚠</span>
                : <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />}
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
                className={`${inputBase} ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:border-[#FF8C00]'}`}
                {...register('email', { required: 'O e-mail é obrigatório' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Senha</label>
                <button type="button" onClick={handleEsqueciSenha}
                  className="text-xs text-[#FF8C00] font-semibold hover:underline">
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                  className={`${inputBase} pr-12 ${errors.senha ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:border-[#FF8C00]'}`}
                  {...register('senha', { required: 'A senha é obrigatória' })}
                />
                <button type="button" onClick={() => setMostrarSenha(p => !p)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.senha && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.senha.message}</p>}
            </div>

            {/* Redefinição */}
            {mostrarRedefinicao && (
              <div className="p-5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-2xl space-y-4 animate-fade-in-up">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Redefinir senha</p>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 block">Nova Senha</label>
                  <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-[#FF8C00] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 block">Confirme a Nova Senha</label>
                  <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-[#FF8C00] transition-colors" />
                </div>
                <button type="button" onClick={handleRedefinirSenha} disabled={enviandoRedefinicao}
                  className="w-full bg-[#FF8C00] text-white font-bold py-3 rounded-xl hover:bg-[#E67E22] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {enviandoRedefinicao && <Loader2 size={16} className="animate-spin" />}
                  {enviandoRedefinicao ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </div>
            )}

            {/* Botão entrar */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF8C00] to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-70 text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-orange-200 dark:shadow-orange-900/30 transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] mt-2"
            >
              {carregando
                ? <><Loader2 size={20} className="animate-spin" /> Entrando...</>
                : <>Entrar <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-[#FF8C00] font-bold hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
            <div className="flex items-center gap-2 justify-center bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 rounded-xl py-3 px-4">
              <Heart size={14} className="text-[#FF8C00] fill-[#FF8C00]" />
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Quer apoiar a causa?{' '}
                <Link to="/Doador" className="text-[#FF8C00] font-black hover:underline">
                  Seja um Doador
                </Link>
              </p>
            </div>
          </div>

          {/* Acesso rápido — só em localhost */}
          {import.meta.env.DEV && (
            <div className="mt-6 border-t border-dashed border-gray-200 dark:border-slate-700 pt-5">
              <p className="text-center text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Acesso rápido · apenas em localhost
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Admin',    role: 'admin',    nome: 'Admin TdB',    id: '1', path: '/dashboard/admin'    },
                  { label: 'Dentista', role: 'dentista', nome: 'Dr. Dev',      id: '2', path: '/dashboard/dentista' },
                  { label: 'Paciente', role: 'paciente', nome: 'Paciente Dev', id: '3', path: '/dashboard/paciente' },
                ].map(u => (
                  <button
                    key={u.role}
                    type="button"
                    onClick={() => {
                      login({
                        nome: u.nome,
                        role: u.role as import('../contexts/AuthContext').UserRole,
                        id:   u.id,
                        dentistaCidade: u.role === 'dentista' ? 'São Paulo' : undefined,
                      });
                      navigate(u.path);
                    }}
                    className="py-2.5 rounded-xl text-xs font-bold border-2 border-dashed border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-[#FF8C00] hover:text-[#FF8C00] hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
