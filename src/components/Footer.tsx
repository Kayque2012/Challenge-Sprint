import { Link, useLocation } from 'react-router-dom';
import { Heart, ChevronUp, MapPin, Globe, Mail, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';


export function Footer() {
  const location    = useLocation();
  const isApolonias = location.pathname === '/apolonias-do-bem';

  const brand      = isApolonias ? '#C084FC' : '#FF8C00';
  const brandLight = isApolonias ? '#E9D5FF' : '#FFBA38';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = isApolonias
    ? [
        { label: 'O Programa',             href: '#o-programa',    isAnchor: true  },
        { label: 'Como funciona',          href: '#como-funciona', isAnchor: true  },
        { label: 'Quem pode ser atendida', href: '#quem-pode',     isAnchor: true  },
        { label: 'Parceiros',              href: '#parceiros',     isAnchor: true  },
        { label: 'Contato',                href: '/contato',       isAnchor: false },
        { label: '← Site principal',       href: '/',              isAnchor: false },
      ]
    : [
        { label: 'Início',          href: '/',               isAnchor: false },
        { label: 'Sobre o Projeto', href: '/sobre',          isAnchor: false },
        { label: 'Quem Somos',      href: '/quem-somos',     isAnchor: false },
        { label: 'FAQ',             href: '/faq',            isAnchor: false },
        { label: 'Reconhecimentos', href: '/reconhecimentos',isAnchor: false },
        { label: 'Cadastro',        href: '/cadastro',       isAnchor: false },
        { label: 'Contato',         href: '/contato',        isAnchor: false },
      ];

  const socialLinks = [
    { label: 'Instagram',    href: 'https://www.instagram.com/ongturmadobem/' },
    { label: 'Site Oficial', href: 'https://turmadobem.org.br/' },
    { label: 'LinkedIn',     href: 'https://br.linkedin.com/company/turma-do-bem' },
    { label: 'Facebook',     href: 'https://www.facebook.com/turmadobem/' },
    { label: 'Atados',       href: 'https://www.atados.com.br/ong/turma-do-bem-1' },
  ];

  return (
    <footer className="w-full px-3 md:px-6 pb-0 font-sans mt-auto">
      <div
        className="relative max-w-[1400px] mx-auto bg-slate-950/95 backdrop-blur-xl border border-white/10 border-b-0 rounded-t-[3rem] p-8 md:p-12"
        style={{ boxShadow: '0 -30px 60px -15px rgba(0,0,0,0.40)' }}
      >
        {/* Linha top com gradiente da cor da marca */}
        <div
          className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full opacity-50"
          style={{ background: `linear-gradient(to right, transparent, ${brand} 30%, ${brandLight} 50%, ${brand} 70%, transparent)` }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── Col 1–2: Identidade ── */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center lg:items-start space-y-5 text-center lg:text-left">
            {isApolonias ? (
              /* Apolônias page keeps its own distinct identity */
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${brand}, ${brandLight})`, boxShadow: `0 4px 14px ${brand}50` }}
                >
                  <span className="text-white font-display font-black text-sm leading-none">A</span>
                </div>
                <span className="text-white font-display font-black text-lg leading-tight">
                  Apolônias do Bem
                </span>
              </div>
            ) : (
              /* Main brand: cloud-horizon mark + wordmark */
              <Logo variant="full" size={32} color={brand} textColor="white" />
            )}

            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 leading-relaxed max-w-[260px]">
              {isApolonias ? (
                <>Reconstrução dentária gratuita para mulheres vítimas de violência — <span style={{ color: brand }}>desde 2012.</span></>
              ) : (
                <>Conectando jovens em vulnerabilidade a dentistas voluntários com <span style={{ color: brand }}>tecnologia e humanidade.</span></>
              )}
            </p>

            <div className="flex flex-col items-center lg:items-start gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <MapPin size={11} style={{ color: brand }} /> São Paulo, Brasil
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Globe size={11} className="text-green-500" /> Presente em todo o Brasil
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Mail size={11} style={{ color: brand }} /> contato@turmadobem.org.br
              </div>
            </div>
          </div>

          {/* ── Col 3–4: Navegar + Conectar ── */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-8 w-full">

            {/* Navegar */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <h3
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: brand }}
              >
                Navegar
              </h3>
              <nav className="flex flex-col items-center lg:items-start gap-3">
                {navLinks.map(({ label, href, isAnchor }) =>
                  isAnchor ? (
                    <a
                      key={href}
                      href={href}
                      className="group flex items-center gap-2.5 text-[13px] font-medium text-slate-400 hover:text-white transition-all"
                    >
                      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-slate-600 group-hover:text-white group-hover:border-white/15 transition-all text-[11px]">
                        →
                      </span>
                      <span className="whitespace-nowrap">{label}</span>
                    </a>
                  ) : (
                    <Link
                      key={href}
                      to={href}
                      className="group flex items-center gap-2.5 text-[13px] font-medium text-slate-400 hover:text-white transition-all"
                    >
                      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-slate-600 group-hover:text-white group-hover:border-white/15 transition-all text-[11px]">
                        →
                      </span>
                      <span className="whitespace-nowrap">{label}</span>
                    </Link>
                  )
                )}
              </nav>
            </div>

            {/* Conectar */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">
                Conectar
              </h3>
              <div className="flex flex-col items-center lg:items-start gap-3">
                {socialLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2.5 text-[13px] font-medium text-slate-400 hover:text-green-400 transition-all"
                  >
                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-slate-600 group-hover:text-green-400 group-hover:border-green-500/20 transition-all">
                      <ExternalLink size={11} />
                    </span>
                    <span className="whitespace-nowrap">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 5: Scroll to top ── */}
          <div className="col-span-1 flex flex-col items-center lg:items-end justify-center lg:h-full py-2 lg:py-0">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--brand)] hover:border-[var(--brand)] transition-all duration-400 cursor-pointer active:scale-95"
              style={{ '--brand': brand } as React.CSSProperties}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = brand;
                btn.style.borderColor = brand;
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
              }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                Topo
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                style={{ backgroundColor: brand }}
              >
                <ChevronUp size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-6 border-t border-white/8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-5 text-center lg:text-left">

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Projeto acadêmico</span>
                <p className="text-[11px] text-slate-500 font-medium">Challenge FIAP — Análise e Desenvolvimento de Sistemas</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/8 font-bold text-[11px]">
              © 2026 • FEITO COM
              <Heart size={10} className="fill-red-500 text-red-500 animate-pulse mx-0.5" />
              PARA A TURMA DO BEM
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
