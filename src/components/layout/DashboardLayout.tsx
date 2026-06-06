import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Logo } from '../Logo';

interface NavItem {
  id: string;
  icon: ReactNode;
  label: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  telaAtiva: string;
  onTelaChange: (id: string) => void;
  roleName: string;
  roleColor?: string;
  maxWidth?: string;
}

const ROLE_COLORS: Record<string, { pill: string; avatar: string; active: string }> = {
  admin:    { pill: 'text-rose-500',   avatar: 'from-rose-400   to-rose-600',   active: 'text-rose-500   shadow-rose-100   dark:shadow-rose-950/40'   },
  dentista: { pill: 'text-sky-500',    avatar: 'from-sky-400    to-sky-600',    active: 'text-sky-500    shadow-sky-100    dark:shadow-sky-950/40'    },
  paciente: { pill: 'text-orange-500', avatar: 'from-orange-400 to-orange-600', active: 'text-orange-500 shadow-orange-100 dark:shadow-orange-950/40' },
  dev:      { pill: 'text-violet-500', avatar: 'from-violet-400 to-violet-600', active: 'text-violet-500 shadow-violet-100 dark:shadow-violet-950/40' },
};

export function DashboardLayout({
  children,
  navItems,
  telaAtiva,
  onTelaChange,
  roleName,
  maxWidth = 'max-w-7xl',
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  const colors = ROLE_COLORS[user?.role ?? 'paciente'];
  const initial = (user?.nome ?? 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pb-20 md:pb-0">

      {/* ── Top header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/8 shadow-[0_1px_24px_rgba(0,0,0,0.06)]">
        <div className={`${maxWidth} mx-auto px-4 md:px-8 h-16 flex items-center gap-4`}>

          {/* Logo / brand */}
          <Link
            to="/"
            title="Voltar ao site"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <Logo variant="icon" size={28} color="#FF8C00" className="xl:hidden flex-shrink-0 group-hover:opacity-80 transition-opacity duration-200" />
            <Logo variant="full" size={24} color="#FF8C00" className="hidden xl:flex group-hover:opacity-80 transition-opacity duration-200" />
          </Link>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

          {/* User pill */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className={`w-8 h-8 bg-gradient-to-br ${colors.avatar} rounded-xl text-white flex items-center justify-center font-display font-black text-sm shadow-sm ring-2 ring-white dark:ring-slate-800`}>
              {initial}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-bold font-display text-gray-900 dark:text-white leading-none truncate max-w-[130px]">
                {user?.nome ?? '—'}
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-[0.12em] mt-0.5 ${colors.pill}`}>{roleName}</p>
            </div>
          </div>

          {/* Tab nav — desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-1.5 mx-auto border border-slate-200/60 dark:border-slate-700/40">
            {navItems.map(item => {
              const active = telaAtiva === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTelaChange(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-display transition-all duration-200 ${
                    active
                      ? `bg-white dark:bg-slate-700 ${colors.active} shadow-md`
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className={`transition-colors duration-200 ${active ? colors.pill : ''}`}>
                    {item.icon}
                  </span>
                  <span className="hidden lg:inline">{item.label}</span>
                  {(item.badge ?? 0) > 0 && (
                    <span className="bg-brand text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                      {(item.badge ?? 0) > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={toggle}
              aria-label="Alternar modo escuro"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-brand dark:hover:text-brand hover:border-brand/30 transition-all duration-200 active:scale-95"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={logout}
              title="Sair"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 active:scale-95"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────────────────── */}
      <main className={`${maxWidth} mx-auto px-4 md:px-8 py-8 w-full`}>
        {children}
      </main>

      {/* ── Mobile bottom nav ──────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/8 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex">
          {navItems.map(item => {
            const active = telaAtiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTelaChange(item.id)}
                className={`relative flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold font-display tracking-wide transition-all duration-200 active:scale-95 ${
                  active ? colors.pill : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {/* Indicador ativo no topo */}
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 bg-brand ${active ? 'w-8' : 'w-0'}`} />
                {item.icon}
                {item.label}
                {(item.badge ?? 0) > 0 && (
                  <span className="absolute top-2 right-[calc(50%-18px)] bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
