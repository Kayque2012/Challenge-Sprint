import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Heart, ShieldCheck, Zap,
  Calculator, Users, MessageCircle, MapPin, Star,
  CheckCircle2, ArrowRight, Smile, Link2,
  LayoutDashboard, CalendarCheck, ClipboardList,
} from 'lucide-react';
import turmaDoRemHero from '../img/turma-do-bem-hero.jpg';
import apoloniasHero from '../img/apolonias-hero-roxo.jpg';

export function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth } = carouselRef.current;
      if (scrollLeft <= 10) carouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      else carouselRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      else carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  const impactNumbers = [
    { value: '25.000+', label: 'Jovens atendidos',      icon: <Smile  size={24} />, glow: 'shadow-[0_0_20px_rgba(255,140,0,0.2)]' },
    { value: '6.000+',  label: 'Dentistas voluntários', icon: <Heart  size={24} />, glow: 'shadow-[0_0_20px_rgba(255,140,0,0.2)]' },
    { value: '600+',    label: 'Cidades alcançadas',     icon: <MapPin size={24} />, glow: 'shadow-[0_0_20px_rgba(255,140,0,0.2)]' },
    { value: '27',      label: 'Anos de impacto',        icon: <Star   size={24} />, glow: 'shadow-[0_0_20px_rgba(255,140,0,0.2)]' },
  ];

  const checklist = [
    'Atendimento 100% gratuito para jovens de 11–17 anos',
    'Dentistas voluntários verificados e credenciados',
    'Triagem por urgência clínica e situação socioeconômica',
    'Presente em mais de 600 cidades brasileiras',
    'Prontuário digital para continuidade do tratamento',
    'Parcerias com universidades e empresas do setor odontológico',
  ];

  const steps = [
    { num: '01', title: 'Cadastre-se',        desc: 'Preencha seu perfil com dados socioeconômicos e informações sobre sua necessidade odontológica.', orange: true  },
    { num: '02', title: 'Triagem & Match',     desc: 'Nosso algoritmo avalia urgência, renda e localização para conectar você ao dentista voluntário ideal.', orange: false },
    { num: '03', title: 'Receba Atendimento', desc: 'Confirme o horário, compareça à consulta e receba cuidado odontológico gratuito e de qualidade.', orange: true  },
  ];

  const cards = [
    { num: '1°', icon: <Calculator   size={30} />, title: 'Triagem Inteligente',  desc: 'Algoritmo de priorização para jovens em situação de vulnerabilidade com base em métricas socioeconômicas.', color: 'orange' },
    { num: '2°', icon: <ShieldCheck  size={30} />, title: 'Prontuário Digital',   desc: 'Histórico clínico completo e seguro, garantindo que cada atendimento seja registrado e acompanhado.',        color: 'green'  },
    { num: '3°', icon: <Zap          size={30} />, title: 'Match Geográfico',     desc: 'Conectamos dentistas voluntários aos pacientes mais próximos através de mapas de calor reais.',                color: 'orange' },
    { num: '4°', icon: <Heart        size={30} />, title: 'Impacto Direto',       desc: 'Sua doação via PIX financia kits de higiene e tratamentos complexos como canais e próteses.',                  color: 'green'  },
    { num: '5°', icon: <Users        size={30} />, title: 'Rede de Voluntariado', desc: 'Faça parte da maior rede de voluntariado especializado do mundo, presente em todo o Brasil.',                   color: 'orange' },
    { num: '6°', icon: <MessageCircle size={30} />, title: 'Suporte e Contato',  desc: 'Canais diretos de comunicação com a sede da TdB em São Paulo para tirar dúvidas em tempo real.',              color: 'green'  },
  ];

  const fadeUp   = (delay = 0) => ({ initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });
  const fadeLeft = (delay = 0) => ({ initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });
  const fadeRight= (delay = 0) => ({ initial: { opacity: 0, x:  30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });

  return (
    <main className="text-[#333333] dark:text-slate-100 font-sans overflow-x-hidden transition-colors duration-300">

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-slow { 0%,100%{opacity:.12} 50%{opacity:.22} }
        .pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes scroll-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        .scroll-bounce { animation: scroll-bounce 2s ease-in-out infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen flex flex-col justify-center items-center text-center pt-20 box-border bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.48), rgba(0,0,0,0.80)), url('${turmaDoRemHero}')` }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <span className="bg-white/10 backdrop-blur-md border border-white/25 text-white/90 text-[11px] font-bold px-5 py-2.5 rounded-full tracking-[0.12em] uppercase">
            🏆 Maior rede de voluntariado especializado do mundo
          </span>
        </motion.div>

        <div className="relative z-10 max-w-[860px] px-5">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="font-display text-white text-[2.4rem] sm:text-5xl md:text-[3.9rem] font-black leading-[1.08] tracking-tight mb-6"
          >
            Todo jovem merece<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] via-amber-400 to-[#FFD700]">
              um sorriso saudável.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="text-white/75 text-lg md:text-[1.2rem] mb-10 leading-[1.8] max-w-[660px] mx-auto font-light"
          >
            Conectamos jovens de <strong className="text-white font-semibold">11 a 17 anos</strong> em vulnerabilidade social a
            dentistas voluntários — de forma gratuita, ágil e inteligente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* CTA primário — estilo linkaid: ícone que se move no hover */}
            <Link
              to="/cadastro"
              className="group relative inline-flex items-center gap-3 bg-[#FF8C00] text-white px-8 py-4 text-base font-bold rounded-full overflow-hidden shadow-xl shadow-[rgba(255,140,0,0.40)] hover:shadow-[rgba(255,140,0,0.60)] hover:bg-[#E67E22] transition-all duration-300 active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:bg-white/25 flex-shrink-0">
                <Heart size={15} className="fill-white" />
              </div>
              Preciso de Atendimento
            </Link>

            <Link
              to="/cadastro"
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 text-base font-bold rounded-full hover:bg-white hover:text-[#333] hover:border-white transition-all duration-300 active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:bg-black/10 flex-shrink-0">
                <Users size={15} />
              </div>
              Sou Dentista Voluntário
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-6"
          >
            <Link to="/sobre" className="text-white/40 text-sm hover:text-white/70 transition-colors inline-flex items-center gap-1.5 group">
              Conheça o projeto
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator — linkaid style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-bounce"
        >
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-bold">scroll</span>
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          APP SHOWCASE — Browser mockup (inspirado no linkaid HomeFinalShowCase)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 overflow-hidden bg-[#F5F5DC] dark:bg-slate-950">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-[#FF8C00] text-[10px] font-bold uppercase tracking-[0.22em] mb-4 block">
              Plataforma digital
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Tudo num só lugar,<br />
              <span className="text-[#FF8C00]">simples e poderoso.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-lg mx-auto font-light leading-relaxed">
              Painel completo para pacientes, dentistas e administradores — com IA, mapas de calor e agendamento inteligente.
            </p>
          </motion.div>

          {/* Browser chrome mockup */}
          <motion.div
            {...fadeUp(0.15)}
            className="rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            style={{ boxShadow: '0 -20px 60px -20px rgba(255,140,0,0.06), 0 60px 100px -30px rgba(0,0,0,0.12), 0 20px 50px -15px rgba(0,0,0,0.07)' }}
          >
            {/* Traffic lights */}
            <div className="flex items-center gap-2 px-5 h-12 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#FF5F57' }} />
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#FEBC2E' }} />
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#28C840' }} />
              <div className="mx-auto flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-md px-3 h-6 border border-slate-200/80 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-[10px] text-slate-400 font-mono">app.dentistanuvem.com.br</span>
              </div>
            </div>

            {/* Fake dashboard UI */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 md:p-8">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8C00] to-[#E67E22] flex items-center justify-center">
                    <span className="text-white font-display font-black text-xs">N</span>
                  </div>
                  <span className="font-display font-black text-sm text-gray-800 dark:text-white hidden sm:block">Dentista na Nuvem</span>
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl p-1">
                  {[
                    { icon: <LayoutDashboard size={13} />, label: 'Triagem' },
                    { icon: <Users size={13} />,           label: 'Pacientes' },
                    { icon: <CalendarCheck size={13} />,   label: 'Agenda' },
                  ].map((tab, i) => (
                    <div
                      key={tab.label}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        i === 0
                          ? 'bg-white dark:bg-slate-600 text-[#FF8C00] shadow-sm'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  ))}
                </div>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-display font-black text-xs ring-2 ring-white dark:ring-slate-700">
                  D
                </div>
              </div>

              {/* Cards row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Fila de Triagem', value: '12', color: 'text-[#FF8C00]', bg: 'bg-orange-50 dark:bg-orange-950/20', icon: <ClipboardList size={16} className="text-[#FF8C00]" /> },
                  { label: 'Meus Pacientes',  value: '5',  color: 'text-sky-500',    bg: 'bg-sky-50 dark:bg-sky-950/20',    icon: <Users size={16} className="text-sky-500" /> },
                  { label: 'Consultas hoje',  value: '3',  color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-950/20', icon: <CalendarCheck size={16} className="text-green-500" /> },
                ].map(c => (
                  <div key={c.label} className={`${c.bg} rounded-xl p-3 border border-slate-100 dark:border-slate-700`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{c.label}</span>
                      {c.icon}
                    </div>
                    <p className={`font-display font-black text-2xl ${c.color}`}>{c.value}</p>
                  </div>
                ))}
              </div>

              {/* Patient list */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-200">Fila de Triagem Inteligente</span>
                  <span className="text-[10px] font-bold text-[#FF8C00] bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">IA ativa</span>
                </div>
                {[
                  { nome: 'Lucas M.',   score: 92, tipo: 'Forte', cidade: 'São Paulo'    },
                  { nome: 'Beatriz S.', score: 78, tipo: 'Moderada', cidade: 'Campinas'  },
                  { nome: 'Rafael O.', score: 65, tipo: 'Leve', cidade: 'Santos'          },
                ].map((p, i) => (
                  <div key={p.nome} className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? 'border-b border-slate-50 dark:border-slate-700/60' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors`}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                      {p.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">{p.nome}</p>
                      <p className="text-[10px] text-slate-400">{p.cidade} · {p.tipo}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-[#FF8C00]" style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-[#FF8C00]">{p.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NÚMEROS DE IMPACTO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-20 relative overflow-hidden">
        {/* Gradiente laranja no topo */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF8C00]/40 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF8C00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-[#FF8C00] text-[10px] font-bold uppercase tracking-[0.22em] mb-3 block">Nosso impacto</span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white">
              27 anos transformando sorrisos.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {impactNumbers.map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center gap-4 group">
                <div className={`w-14 h-14 rounded-2xl bg-[#FF8C00]/10 border border-[#FF8C00]/20 flex items-center justify-center text-[#FF8C00] ${item.glow} group-hover:bg-[#FF8C00]/15 transition-all duration-300`}>
                  {item.icon}
                </div>
                <div>
                  <span className="font-display text-white text-[2.6rem] font-black leading-none block">{item.value}</span>
                  <span className="text-white/40 text-sm font-medium mt-1 block">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Apolônias stat */}
          <div className="border-t border-white/8 pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">Apolônias do Bem</span>
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/8 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <span className="font-display text-white font-black text-2xl block leading-none">1.100+</span>
                <span className="text-white/35 text-xs mt-0.5 block">mulheres atendidas</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF8C00]/20 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MISSÃO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F5F5DC] dark:bg-slate-900">
        <div className="max-w-[1150px] mx-auto flex flex-col lg:flex-row gap-20 items-center">

          <motion.div {...fadeLeft()} className="flex-1">
            <span className="text-[#FF8C00] text-[10px] font-bold uppercase tracking-[0.22em] mb-5 block">
              Nossa missão
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6">
              Saúde bucal não pode<br /> ser{' '}
              <span className="text-[#FF8C00]">privilégio.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-5 font-light">
              No Brasil, milhões de jovens de baixa renda <strong className="text-gray-700 dark:text-slate-200 font-semibold">nunca visitaram um dentista</strong>. Cáries, dores e infecções comprometem não só o sorriso — mas a autoestima, o aprendizado e o futuro.
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-9 font-light">
              A <strong className="text-gray-800 dark:text-slate-200 font-semibold">Turma do Bem</strong> conecta esses jovens (11–17 anos) a dentistas voluntários de forma gratuita, usando tecnologia para priorizar os casos mais urgentes.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-[#FF8C00] font-bold text-base group"
            >
              Entenda o projeto
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
          </motion.div>

          <motion.div {...fadeRight(0.1)} className="flex-1 flex flex-col gap-3">
            {checklist.map((item, i) => (
              <motion.div
                key={i}
                {...fadeRight(i * 0.07)}
                className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(255,140,0,0.08)] hover:-translate-y-0.5 hover:border-orange-100 dark:hover:border-orange-900/40 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={17} className="text-green-500" />
                </div>
                <span className="text-gray-700 dark:text-slate-200 font-medium text-sm md:text-[15px]">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMO FUNCIONA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-slate-950 relative overflow-hidden">
        <div className="pulse-slow absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FF8C00]/8 blur-2xl" />
        <div className="pulse-slow absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF8C00]/5 blur-2xl" />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <span className="text-[#FF8C00] text-[10px] font-bold uppercase tracking-[0.22em] mb-5 block">
              Simples assim
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
              Do cadastro ao atendimento<br />
              <span className="text-[#FF8C00]">em 3 passos.</span>
            </h2>
            <p className="text-white/40 text-lg mt-5 max-w-md mx-auto font-light">
              Sem burocracia. Sem custo. Com tecnologia para chegar a quem mais precisa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative isolate">
            <div className="hidden md:block absolute top-12 left-[calc(16.6%+3rem)] right-[calc(16.6%+3rem)] h-px bg-gradient-to-r from-[#FF8C00]/10 via-[#FF8C00]/50 to-[#FF8C00]/10 z-0" />

            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.15)} className="relative z-10 flex flex-col items-center text-center group">
                {/* Número circular */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center font-display text-3xl font-black mb-7 transition-all duration-300 ${
                  step.orange
                    ? 'bg-[#FF8C00] text-white shadow-[0_0_40px_rgba(255,140,0,0.35)] group-hover:shadow-[0_0_60px_rgba(255,140,0,0.55)] group-hover:scale-105'
                    : 'bg-slate-950 text-white border-2 border-[#FF8C00]/50 group-hover:border-[#FF8C00] group-hover:scale-105'
                }`}>
                  {/* Anel externo no hover */}
                  {step.orange && (
                    <div className="absolute inset-0 rounded-full ring-4 ring-[#FF8C00]/20 group-hover:ring-[#FF8C00]/40 transition-all duration-300" />
                  )}
                  {step.num}
                </div>
                <h3 className="font-display text-white text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/45 leading-relaxed text-[15px] max-w-[240px] font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="text-center mt-14">
            <Link
              to="/cadastro"
              className="group inline-flex items-center gap-3 bg-[#FF8C00] text-white px-9 py-4 rounded-full font-bold text-base hover:bg-[#E67E22] transition-all duration-300 shadow-[0_4px_30px_rgba(255,140,0,0.35)] hover:shadow-[0_8px_40px_rgba(255,140,0,0.50)] active:scale-95"
            >
              Começar agora
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROGRAMAS DA TDB
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F5F5DC] dark:bg-slate-900">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-[#FF8C00] text-[10px] font-bold uppercase tracking-[0.22em] mb-5 block">
              Nossos programas
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Dois programas,<br />
              <span className="text-[#FF8C00]">um propósito.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-light">
              A Turma do Bem atende dois grupos distintos com cuidado odontológico gratuito e humanizado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Dentista do Bem */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_30px_70px_rgba(255,140,0,0.12)] hover:-translate-y-1 transition-all duration-400 group"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#FF8C00] to-amber-400" />
              <div className="p-8">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smile size={28} className="text-[#FF8C00]" />
                </div>
                <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 text-[#FF8C00] text-[10px] font-black px-3 py-1.5 rounded-full mb-4 uppercase tracking-[0.12em] border border-orange-100 dark:border-orange-900/40">
                  Dentista do Bem
                </div>
                <h3 className="font-display text-2xl font-black text-gray-900 dark:text-white mb-3">Jovens de 11 a 17 anos</h3>
                <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-6 font-light">
                  Atendimento odontológico <strong className="text-gray-700 dark:text-slate-200 font-semibold">100% gratuito</strong> para jovens em situação de vulnerabilidade social. Dentistas voluntários de todo o Brasil oferecem consultas, tratamentos e acompanhamento clínico.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {['Consultas de prevenção e higiene', 'Restaurações e tratamentos de canal', 'Próteses e correções estéticas', 'Triagem por urgência clínica e renda'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={13} className="text-[#FF8C00]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                  {[{ v: '25.000+', l: 'jovens atendidos' }, { v: '600+', l: 'cidades' }, { v: '6.000+', l: 'voluntários' }].map(s => (
                    <div key={s.l} className="text-center">
                      <p className="font-display text-2xl font-black text-[#FF8C00]">{s.v}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Apolônias do Bem */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_30px_70px_rgba(139,92,246,0.10)] hover:-translate-y-1 transition-all duration-400 group"
            >
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-400" />
              <div className="p-8">
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart size={28} className="text-purple-500" />
                </div>
                <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-[10px] font-black px-3 py-1.5 rounded-full mb-4 uppercase tracking-[0.12em] border border-purple-100 dark:border-purple-900/40">
                  Apolônias do Bem
                </div>
                <h3 className="font-display text-2xl font-black text-gray-900 dark:text-white mb-3">Mulheres em Situação de Vulnerabilidade</h3>
                <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-6 font-light">
                  Programa dedicado a <strong className="text-gray-700 dark:text-slate-200 font-semibold">mulheres vítimas de violência doméstica</strong>, oferecendo cuidado odontológico humanizado e especializado — porque resgatar a autoestima começa pelo sorriso.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {['Atendimento humanizado e sigiloso', 'Reconstrução estética pós-violência', 'Parceria com casas de acolhimento', 'Apoio psicossocial integrado'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={13} className="text-purple-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl">
                  <p className="text-purple-700 dark:text-purple-300 text-sm font-medium leading-relaxed italic">
                    "O sorriso foi a última coisa que me roubaram. Hoje eu tenho ele de volta."
                  </p>
                  <p className="text-purple-400 dark:text-purple-500 text-xs mt-2 font-semibold">— Beneficiária do Programa Apolônias do Bem</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.3)} className="text-center mt-10">
            <a
              href="https://www.turmadobem.org.br"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 dark:text-slate-500 hover:text-[#FF8C00] transition-colors font-semibold text-sm group"
            >
              Saiba mais em turmadobem.org.br
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BANNER APOLÔNIAS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-28 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to right, rgba(20,10,30,0.94) 40%, rgba(20,10,30,0.78) 100%), url('${apoloniasHero}')` }}
      >
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-700/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1000px] mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-14">
          <motion.div {...fadeLeft()} className="flex-1">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-[0.12em]">
              🏛️ Agora política pública — PL 15.116/25
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Violência não apaga<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C084FC] to-[#A855F7]">
                um sorriso.
              </span>
            </h2>
            <p className="text-purple-200/65 text-lg leading-relaxed mb-8 max-w-lg font-light">
              Desde 2012, o programa Apolônias do Bem oferece reconstrução dentária gratuita para mulheres vítimas de violência doméstica — e agora é lei federal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/apolonias-do-bem"
                className="group inline-flex items-center gap-2.5 bg-[#6B2D8B] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#5B2070] transition-all shadow-[0_4px_20px_rgba(107,45,139,0.40)] hover:shadow-[0_8px_30px_rgba(107,45,139,0.55)] active:scale-95"
              >
                Conhecer o programa
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/5511965793913"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-purple-400/40 text-purple-200 px-7 py-3.5 rounded-full font-bold text-sm hover:bg-purple-500/20 transition-all active:scale-95"
              >
                <MessageCircle size={15} /> Solicitar atendimento
              </a>
            </div>
          </motion.div>

          <motion.div {...fadeRight(0.15)} className="flex-1 grid grid-cols-2 gap-4">
            {[
              { value: '1.100+', label: 'mulheres atendidas' },
              { value: '13 anos', label: 'de programa ativo' },
              { value: '100%',   label: 'gratuito e sigiloso' },
              { value: 'Lei',    label: 'PL 15.116/25' },
            ].map(s => (
              <div key={s.label} className="bg-white/6 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200">
                <p className="font-display text-2xl font-black leading-none mb-1.5 text-[#C084FC]">{s.value}</p>
                <p className="text-white/35 text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CARROSSEL DE FEATURES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 max-w-[1400px] mx-auto overflow-hidden bg-[#F5F5DC] dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 mb-14 gap-6">
          <motion.div {...fadeLeft()} className="max-w-2xl">
            <span className="text-[#FF8C00] text-[10px] font-bold uppercase tracking-[0.22em] mb-5 block">
              A plataforma
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4 text-gray-800 dark:text-white leading-tight">
              O que entregamos{' '}
              <span className="text-[#FF8C00]">de verdade.</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-slate-400 font-light">
              Nossa plataforma automatiza processos complexos para focar no que importa: o sorriso dos jovens.
            </p>
          </motion.div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              aria-label="Slide anterior"
              className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 hover:text-[#FF8C00] hover:border-[#FF8C00]/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 bg-white dark:bg-slate-800 shadow-sm active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Próximo slide"
              className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 hover:text-[#FF8C00] hover:border-[#FF8C00]/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 bg-white dark:bg-slate-800 shadow-sm active:scale-95"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-12 snap-x snap-mandatory scroll-smooth hide-scroll w-full"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[2rem] min-w-[320px] md:min-w-[420px] snap-start border border-slate-100 dark:border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-700/50 hover:shadow-[0_20px_60px_rgba(255,140,0,0.10)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Número fantasma */}
              <div className="absolute -right-3 -top-6 font-display text-[8rem] font-black text-slate-50 dark:text-slate-700/80 group-hover:scale-110 transition-transform duration-300 pointer-events-none select-none leading-none">
                {card.num.replace('°', '')}
              </div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-colors duration-200 ${
                card.color === 'orange'
                  ? 'bg-orange-50 dark:bg-orange-950/30 text-[#FF8C00] group-hover:bg-orange-100 dark:group-hover:bg-orange-950/50'
                  : 'bg-green-50 dark:bg-green-950/30 text-green-500 group-hover:bg-green-100 dark:group-hover:bg-green-950/50'
              }`}>
                {card.icon}
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-gray-800 dark:text-white relative z-10">{card.title}</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-[15px] relative z-10 font-light">{card.desc}</p>
            </motion.div>
          ))}
          <div className="min-w-[1px] flex-shrink-0 snap-end" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA DUPLO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-br from-[#FF8C00] via-[#F07A00] to-[#E06000] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/8 translate-x-1/3 -translate-y-1/3 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/6 -translate-x-1/4 translate-y-1/4 pointer-events-none blur-2xl" />
        {/* Shine line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="max-w-[1000px] mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Faça parte dessa história.
            </h2>
            <p className="text-white/70 text-xl max-w-lg mx-auto leading-relaxed font-light">
              Seja como paciente ou como voluntário, você pode transformar vidas — incluindo a sua.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card paciente */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } }}
              whileHover={{ scale: 1.02, y: -6, transition: { duration: 0.3 } }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800/90 rounded-[1.75rem] p-9 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            >
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/40 rounded-2xl flex items-center justify-center mb-5 text-[#FF8C00]">
                <Heart size={30} />
              </div>
              <h3 className="font-display text-2xl font-black text-gray-800 dark:text-white mb-2">Preciso de atendimento</h3>
              <p className="text-gray-500 dark:text-slate-400 mb-7 leading-relaxed text-[15px] font-light">
                Tenho entre 11 e 17 anos e preciso de cuidado odontológico gratuito e de qualidade.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#E67E22] transition-all shadow-[0_4px_20px_rgba(255,140,0,0.30)] hover:shadow-[0_8px_30px_rgba(255,140,0,0.45)] active:scale-95"
              >
                Quero me cadastrar
              </Link>
            </motion.div>

            {/* Card dentista */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } }}
              whileHover={{ scale: 1.02, y: -6, transition: { duration: 0.3 } }}
              viewport={{ once: true }}
              className="bg-white/12 backdrop-blur-md rounded-[1.75rem] p-9 flex flex-col items-center text-center border border-white/25"
            >
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-5 text-white">
                <Users size={30} />
              </div>
              <h3 className="font-display text-2xl font-black text-white mb-2">Sou dentista voluntário</h3>
              <p className="text-white/60 mb-7 leading-relaxed text-[15px] font-light">
                Quero usar minha expertise para impactar jovens vulneráveis e fazer parte da maior rede do mundo.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-white text-[#FF8C00] py-4 rounded-2xl font-bold text-base hover:bg-orange-50 transition-all active:scale-95"
              >
                Quero ser voluntário
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.25)} className="text-center flex flex-col items-center gap-3">
            <Link
              to="/doador"
              className="group inline-flex items-center gap-2 text-white/65 font-semibold hover:text-white transition-colors text-base"
            >
              <Heart size={17} className="group-hover:scale-110 transition-transform fill-white/40 group-hover:fill-white/70" />
              Ou apoie como doador →
            </Link>
            <Link
              to="/apolonias-do-bem"
              className="inline-flex items-center gap-1.5 text-white/30 font-medium hover:text-white/60 transition-colors text-sm group"
            >
              <Link2 size={13} />
              Mulher vítima de violência? Conheça as Apolônias do Bem →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
