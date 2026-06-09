import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Heart, Mail, ExternalLink, Sun, Moon, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useTheme();
  const { user, logout, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioLogado = user?.nome ?? null;
  const userRole      = user?.role ?? null;
  const rotaDashboard = dashboardPath;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive    = (path: string) => location.pathname === path;
  const isApolonias = location.pathname === '/apolonias-do-bem';

  const brand    = isApolonias ? '#6B2D8B' : '#FF8C00';
  const brandH   = isApolonias ? '#5B2070' : '#E67E22';
  const brandBg  = isApolonias ? '#F5F0FA' : '#FFF7ED';
  const brandBdr = isApolonias ? '#C4B5FD' : '#FED7AA';

  const defaultNavLinks = [
    { to: '/',               label: 'Início' },
    { to: '/quem-somos',     label: 'Quem Somos' },
    { to: '/sobre',          label: 'Sobre' },
    { to: '/reconhecimentos',label: 'Reconhecimentos' },
    { to: '/faq',            label: 'FAQ' },
  ];

  const apoloniasNavLinks = [
    { href: '#o-programa',    label: 'O Programa' },
    { href: '#como-funciona', label: 'Como funciona' },
    { href: '#quem-pode',     label: 'Quem pode ser atendida' },
    { href: '#parceiros',     label: 'Parceiros' },
  ];

  return (
    <>
      {/* ── Barra flutuante ── */}
      <header className="fixed top-0 left-0 w-full z-[1000] px-3 md:px-6 font-sans">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center h-[65px] px-5 md:px-8 rounded-b-[1.75rem] bg-black/30 dark:bg-slate-950/75 backdrop-blur-xl border border-white/15 dark:border-white/8 border-t-0 shadow-[0_10px_40px_rgba(0,0,0,0.20)]">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <Logo
                variant="full"
                size={44}
                color={brand}
                className="transition-opacity duration-200 group-hover:opacity-80"
              />
            </Link>
          </div>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {isApolonias ? (
              <>
                {apoloniasNavLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="relative group py-2 font-bold text-[12px] tracking-[0.08em] uppercase text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {label}
                    <span
                      className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: brand }}
                    />
                  </a>
                ))}
                <span className="text-white/15 select-none">|</span>
                <Link
                  to="/"
                  className="font-bold text-[12px] tracking-[0.08em] uppercase text-white/35 hover:text-white/75 transition-colors"
                >
                  ← Site principal
                </Link>
              </>
            ) : (
              <>
                {defaultNavLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="relative group py-2 font-bold text-[12px] tracking-[0.08em] uppercase transition-colors duration-200"
                    style={{ color: isActive(to) ? brand : 'rgba(255,255,255,0.82)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = brand; }}
                    onMouseLeave={e => { e.currentTarget.style.color = isActive(to) ? brand : 'rgba(255,255,255,0.82)'; }}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}`}
                      style={{ backgroundColor: brand }}
                    />
                  </Link>
                ))}

                {userRole === 'dev' && (
                  <div className="flex gap-3 border-l border-white/15 pl-4">
                    {[
                      { to: '/dashboard/admin',    label: '👑 Admin' },
                      { to: '/dashboard/dentista', label: '🦷 Dentista' },
                      { to: '/dashboard/paciente', label: '👤 Paciente' },
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="font-black text-[12px] tracking-[0.06em] uppercase transition-colors"
                        style={{ color: brand }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = brand; }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Dark mode toggle — desktop */}
            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo noturno'}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/15 hover:bg-white/20 transition-all cursor-pointer active:scale-95"
            >
              {isDark
                ? <Sun  size={15} className="text-amber-400" />
                : <Moon size={15} className="text-white/70" />
              }
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {isApolonias ? (
              <a
                href="https://wa.me/5511965793913"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-1.5 text-white font-bold text-[13px] px-4 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
                style={{ backgroundColor: brand }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = brandH; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = brand; }}
              >
                <MessageCircle size={13} /> Solicitar atendimento
              </a>
            ) : (
              <>
                <Link
                  to="/contato"
                  className="hidden sm:block font-bold text-[12px] tracking-[0.06em] uppercase transition-colors text-white/80 hover:text-white"
                >
                  Contato
                </Link>

                {usuarioLogado ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      to={rotaDashboard}
                      className="flex items-center gap-2 text-white text-[13px] font-bold px-3 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
                      style={{ backgroundColor: brand }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = brandH; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = brand; }}
                    >
                      <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-black">
                        {usuarioLogado.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate">{usuarioLogado.split(' ')[0]}</span>
                      <LayoutDashboard size={13} />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-white/55 hover:text-red-400 transition-colors p-1.5"
                      title="Sair"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-1.5 text-white font-bold text-[13px] px-4 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
                    style={{ backgroundColor: brand }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = brandH; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = brand; }}
                  >
                    Entrar
                  </Link>
                )}
              </>
            )}

            {/* Hambúrguer */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 transition-all text-white/85 active:scale-95"
              aria-label="Abrir menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      {/* Drawer */}
      <div className={`fixed top-0 w-[85%] max-w-[320px] h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl z-[2000] shadow-[-8px_0_40px_rgba(0,0,0,0.18)] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isMenuOpen ? 'right-0' : 'right-[-100%]'}`}>

        {/* Drawer header */}
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 px-6 py-5">
          <div className="flex items-center">
            <Logo variant="full" size={40} color={brand} />
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Conta / Atendimento ── */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              {isApolonias ? 'Atendimento' : 'Minha Conta'}
            </p>

            {isApolonias ? (
              <div className="space-y-2">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: brandBg, borderColor: brandBdr }}>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">Tratamento gratuito e sigiloso</p>
                  <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">
                    Para mulheres vítimas de violência doméstica que tiveram os dentes afetados.
                  </p>
                </div>
                <a
                  href="https://wa.me/5511965793913"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 w-full p-3 text-white font-bold rounded-xl text-sm transition-colors"
                  style={{ backgroundColor: brand }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = brandH; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = brand; }}
                >
                  <MessageCircle size={16} /> Solicitar atendimento
                </a>
                <Link
                  to="/cadastro"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center p-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 font-bold rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Quero ser voluntária
                </Link>
              </div>
            ) : usuarioLogado ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: brandBg, borderColor: brandBdr }}>
                  <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-sm" style={{ backgroundColor: brand }}>
                    {usuarioLogado.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{usuarioLogado}</p>
                    <p className="text-xs font-semibold capitalize" style={{ color: brand }}>{userRole === 'dev' ? 'Desenvolvedor' : userRole}</p>
                  </div>
                </div>

                {userRole !== 'dev' ? (
                  <Link
                    to={rotaDashboard}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 w-full p-3 text-white font-bold rounded-xl text-sm transition-colors"
                    style={{ backgroundColor: brand }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = brandH; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = brand; }}
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
                        className="block w-full p-2.5 border font-bold rounded-xl text-sm text-center transition-colors"
                        style={{ backgroundColor: brandBg, color: brand, borderColor: brandBdr }}
                        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
                        onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
                      >
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
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-3">Acesse o painel ou crie sua conta.</p>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center p-3 text-white font-bold rounded-xl text-sm transition-colors"
                  style={{ backgroundColor: brand }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = brandH; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = brand; }}
                >
                  Entrar
                </Link>
                <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center p-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 font-bold rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* ── Navegação mobile ── */}
          <div className="lg:hidden">
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Navegação</p>
            <div className="space-y-1">
              {isApolonias ? (
                <>
                  {apoloniasNavLinks.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white border border-transparent"
                    >
                      {label}
                    </a>
                  ))}
                  <div className="my-1 border-t border-gray-100 dark:border-slate-700" />
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent"
                  >
                    ← Site principal
                  </Link>
                </>
              ) : (
                <>
                  {defaultNavLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors border ${
                        isActive(to)
                          ? 'border'
                          : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white border-transparent'
                      }`}
                      style={isActive(to) ? { backgroundColor: brandBg, color: brand, borderColor: brandBdr } : {}}
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    to="/contato"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors border ${
                      isActive('/contato')
                        ? 'border'
                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white border-transparent'
                    }`}
                    style={isActive('/contato') ? { backgroundColor: brandBg, color: brand, borderColor: brandBdr } : {}}
                  >
                    Contato
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── Aparência ── */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Aparência</p>

            <button
              onClick={toggleDark}
              aria-label="Alternar modo escuro"
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 transition-all"
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = brand + '66'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = ''; }}
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
              <div className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0" style={{ backgroundColor: isDark ? brand : undefined }}>
                <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${!isDark ? 'bg-gray-200' : ''}`} />
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 z-10 ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
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

          {/* ── Doação ── */}
          <Link
            to="/Doador"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 w-full p-3.5 text-white font-bold rounded-xl text-sm transition-all active:scale-95"
            style={{ background: `linear-gradient(to right, ${brand}, ${brandH})` }}
          >
            <Heart size={16} className="fill-white" />
            Apoiar a Causa — Seja um Doador
          </Link>
        </div>
      </div>
    </>
  );
}
