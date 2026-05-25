import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Heart, Cloud, Mail, ExternalLink, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  const userRole = sessionStorage.getItem('userRole');

  const handleLogout = () => {
    sessionStorage.clear();
    setIsMenuOpen(false);
    navigate('/');
  };

  let rotaDashboard = '/login';
  if (userRole === 'admin')    rotaDashboard = '/dashboard/admin';
  else if (userRole === 'dentista') rotaDashboard = '/dashboard/dentista';
  else if (userRole === 'paciente') rotaDashboard = '/dashboard/paciente';
  else if (userRole === 'dev')      rotaDashboard = '/dashboard/dentista';

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `font-semibold text-[15px] transition-colors duration-200 ${
      isActive(path) ? 'text-[#FF8C00]' : 'text-white/90 hover:text-[#FF8C00]'
    }`;

  const navLinks = [
    { to: '/',               label: 'Início' },
    { to: '/quem-somos',     label: 'Quem Somos' },
    { to: '/sobre',          label: 'Sobre' },
    { to: '/reconhecimentos',label: 'Reconhecimentos' },
    { to: '/faq',            label: 'FAQ' },
  ];

  return (
    <>
      <header className="flex justify-between items-center px-[5%] h-[65px] fixed top-0 left-0 w-full box-border z-[1000] bg-black/25 backdrop-blur-[14px] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.08)]">

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-[22px] md:text-[26px] font-black tracking-tight text-[#FF8C00] hover:text-orange-400 transition-colors flex items-center gap-2"
            style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
          >
            <Cloud size={20} className="text-[#FF8C00]" />
            Dentista na Nuvem
          </Link>
        </div>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-[18px] xl:gap-[24px]">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={navLinkClass(to)}>
              {label}
            </Link>
          ))}

          {userRole === 'dev' && (
            <div className="flex gap-3 border-l border-white/20 pl-4">
              <Link to="/dashboard/admin"    className="text-[#FF8C00] font-black text-[13px] hover:text-white transition-colors">👑 Admin</Link>
              <Link to="/dashboard/dentista" className="text-[#FF8C00] font-black text-[13px] hover:text-white transition-colors">🦷 Dentista</Link>
              <Link to="/dashboard/paciente" className="text-[#FF8C00] font-black text-[13px] hover:text-white transition-colors">👤 Paciente</Link>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/contato"
            className="hidden sm:block text-white/90 hover:text-[#FF8C00] font-semibold text-[14px] transition-colors"
          >
            Contato
          </Link>

          {usuarioLogado ? (
            /* Usuário logado: pill com nome + dashboard link */
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={rotaDashboard}
                className="flex items-center gap-2 bg-[#FF8C00] hover:bg-orange-500 text-white text-[13px] font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-black">
                  {usuarioLogado.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{usuarioLogado.split(' ')[0]}</span>
                <LayoutDashboard size={13} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-white/60 hover:text-red-400 transition-colors p-1.5"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            /* Visitante: botão entrar */
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 bg-[#FF8C00] hover:bg-orange-500 text-white font-bold text-[13px] px-4 py-1.5 rounded-full transition-colors shadow-sm"
            >
              Entrar
            </Link>
          )}

          {/* Hambúrguer — sempre visível para acesso ao drawer (conta/impacto) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center justify-center text-white/90 hover:text-[#FF8C00] transition-colors p-1"
            aria-label="Abrir menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      {/* Drawer */}
      <div className={`fixed top-0 w-[85%] max-w-[320px] h-screen bg-white dark:bg-slate-900 z-[2000] shadow-[-5px_0_30px_rgba(0,0,0,0.15)] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isMenuOpen ? 'right-0' : 'right-[-100%]'}`}>

        {/* Drawer header */}
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 px-6 py-5">
          <div className="flex items-center gap-2">
            <Cloud size={18} className="text-[#FF8C00]" />
            <span className="font-black text-gray-900 dark:text-white">Dentista na Nuvem</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Conta */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Minha Conta</p>
            {usuarioLogado ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="w-9 h-9 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-black text-sm">
                    {usuarioLogado.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{usuarioLogado}</p>
                    <p className="text-xs text-[#FF8C00] font-semibold capitalize">{userRole === 'dev' ? 'Desenvolvedor' : userRole}</p>
                  </div>
                </div>

                {userRole !== 'dev' ? (
                  <Link
                    to={rotaDashboard}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 w-full p-3 bg-[#FF8C00] text-white font-bold rounded-xl text-sm hover:bg-[#E67E22] transition-colors"
                  >
                    <LayoutDashboard size={16} /> Meu Painel
                  </Link>
                ) : (
                  <div className="space-y-2">
                    {[
                      { to: '/dashboard/admin',    label: '👑 Painel Admin' },
                      { to: '/dashboard/dentista', label: '🦷 Painel Dentista' },
                      { to: '/dashboard/paciente', label: '👤 Painel Paciente' },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setIsMenuOpen(false)}
                        className="block w-full p-2.5 bg-orange-50 text-[#FF8C00] border border-orange-100 font-bold rounded-xl text-sm text-center hover:bg-orange-100 transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-3 bg-red-50 text-red-600 border border-red-100 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} /> Sair da conta
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-500 text-sm mb-3">Acesse o painel ou crie sua conta.</p>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center p-3 bg-[#FF8C00] text-white font-bold rounded-xl text-sm hover:bg-[#E67E22] transition-colors">
                  Entrar
                </Link>
                <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center p-3 bg-gray-50 text-gray-700 border border-gray-200 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors">
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Navegação — só aparece no mobile (lg+ já tem a barra horizontal) */}
          <div className="lg:hidden">
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Navegação</p>
            <div className="space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive(to)
                      ? 'bg-orange-50 text-[#FF8C00] border border-orange-100'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/contato"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  isActive('/contato')
                    ? 'bg-orange-50 text-[#FF8C00] border border-orange-100'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Contato
              </Link>
            </div>
          </div>

          {/* Aparência / Modo escuro */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Aparência</p>

            <button
              onClick={toggleDark}
              aria-label="Alternar modo escuro"
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-[#FF8C00]/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-slate-700 text-yellow-300' : 'bg-orange-100 text-orange-500'}`}>
                  {isDark ? <Moon size={17} /> : <Sun size={17} />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-gray-900 dark:text-white leading-none">
                    {isDark ? 'Modo Escuro' : 'Modo Claro'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Toque para alternar</p>
                </div>
              </div>
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${isDark ? 'bg-[#FF8C00]' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <div className="space-y-1 mt-3">
              <Link
                to="/contato"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail size={15} className="text-gray-400" /> Contato
              </Link>
              <a
                href="https://turmadobem.org.br"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ExternalLink size={15} className="text-gray-400" /> Site Oficial TdB
              </a>
            </div>
          </div>

          {/* Doação */}
          <Link
            to="/Doador"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 w-full p-3.5 bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white font-bold rounded-xl text-sm"
          >
            <Heart size={16} className="fill-white" />
            Apoiar a Causa — Seja um Doador
          </Link>
        </div>
      </div>
    </>
  );
}
