import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, FileText, CheckCircle2, ArrowRight,
  Shield, MessageCircle, Building2, Sparkles,
  Phone, Users, Star,
} from 'lucide-react';

import apoloniasHero from '../img/apolonias-hero-roxo.jpg';

export function ApoloniasDoBem() {

  /* ── Variantes de animação ── */
  const fadeUp = (delay = 0) => ({
    initial:     { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0  },
    viewport:    { once: true },
    transition:  { duration: 0.6, delay },
  });
  const fadeLeft = (delay = 0) => ({
    initial:     { opacity: 0, x: -32 },
    whileInView: { opacity: 1, x: 0   },
    viewport:    { once: true },
    transition:  { duration: 0.65, delay, ease: 'easeOut' as const },
  });
  const fadeRight = (delay = 0) => ({
    initial:     { opacity: 0, x: 32 },
    whileInView: { opacity: 1, x: 0  },
    viewport:    { once: true },
    transition:  { duration: 0.65, delay, ease: 'easeOut' as const },
  });
  const scaleIn = (delay = 0) => ({
    initial:     { opacity: 0, scale: 0.88 },
    whileInView: { opacity: 1, scale: 1    },
    viewport:    { once: true },
    transition:  { duration: 0.5, delay, ease: 'easeOut' as const },
  });
  const popIn = (delay = 0) => ({
    initial:     { opacity: 0, scale: 0.6 },
    whileInView: { opacity: 1, scale: 1   },
    viewport:    { once: true },
    transition:  { type: 'spring' as const, stiffness: 280, damping: 22, delay },
  });

  /* ── Dados ── */
  const steps = [
    {
      num: '01', icon: <Phone size={22} />,
      title: 'Entre em contato',
      desc: 'Fale com a Turma do Bem pelo WhatsApp ou pelo formulário no site. Nossa equipe responde com acolhimento e total sigilo.',
      cta: { label: 'WhatsApp', href: 'https://wa.me/5511965793913' },
    },
    {
      num: '02', icon: <FileText size={22} />,
      title: 'Apresente o Boletim de Ocorrência',
      desc: 'O BO é o documento que comprova a situação de violência. Ainda não fez? Orientamos como registrar de forma segura.',
      cta: null,
    },
    {
      num: '03', icon: <Star size={22} />,
      title: 'Triagem com OHIP',
      desc: 'Realiza-se um exame oral rápido e não invasivo com o OHIP — ferramenta científica que mede o impacto bucal na qualidade de vida.',
      cta: null,
    },
    {
      num: '04', icon: <Heart size={22} />,
      title: 'Tratamento completo e gratuito',
      desc: 'Um dentista voluntário realiza todos os procedimentos necessários, do mais simples ao mais complexo, sem nenhum custo.',
      cta: null,
    },
  ];

  const criterios = [
    'Mulheres cisgênero e transgênero',
    'Em situação de violência doméstica (com BO)',
    'Com dentes afetados pela agressão',
    'Sem restrição de idade ou renda',
    'Casos mais graves têm prioridade no atendimento',
    'Chefes de família e mulheres em capacitação profissional têm prioridade',
  ];

  const parceiros = [
    { icon: <Building2 size={20} />, title: 'Casas de Acolhimento',       desc: 'Triagens diretas em abrigos e casas de apoio a vítimas de violência.' },
    { icon: <Shield    size={20} />, title: 'Tribunais de Justiça',        desc: 'Protocolo firmado com comissões especializadas dos tribunais estaduais.' },
    { icon: <Users     size={20} />, title: 'Delegacias da Mulher',        desc: 'Indicação de casos em parceria com DDMs e DEAMs de todo o Brasil.' },
    { icon: <Heart     size={20} />, title: 'ONGs e Assistência Social',   desc: 'Rede de organizações que encaminham mulheres em situação de vulnerabilidade.' },
  ];

  return (
    <main className="font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${apoloniasHero}')` }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B2D8B]/42 via-[#6B2D8B]/18 to-[#6B2D8B]/10 pointer-events-none" />

        {/* Orbs flutuantes no hero */}
        <motion.div
          animate={{ y: [-12, 12, -12], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-[8%] w-48 h-48 rounded-full bg-[#6B2D8B]/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [10, -10, 10], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-24 right-[10%] w-64 h-64 rounded-full bg-[#A855F7]/15 blur-3xl pointer-events-none"
        />

        {/* Conteúdo */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-5 pt-20 pb-20">

          {/* Chips */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-bold px-4 py-2 rounded-full tracking-wide uppercase backdrop-blur-sm">
              <Sparkles size={11} className="text-[#C084FC]" /> Desde 2012
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="inline-flex items-center gap-1.5 bg-[#6B2D8B]/25 border border-[#6B2D8B]/50 text-purple-200 text-[11px] font-bold px-4 py-2 rounded-full tracking-wide uppercase backdrop-blur-sm"
            >
              🏛️ Agora política pública — PL 15.116/25
            </motion.span>
          </motion.div>

          {/* Título */}
          <div className="max-w-[820px]">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
              className="text-white text-[2.25rem] sm:text-5xl md:text-[3.8rem] font-black leading-[1.1] mb-6 drop-shadow-lg"
            >
              Violência não apaga<br />
              <motion.span
                initial={{ opacity: 0, backgroundPositionX: '100%' }}
                animate={{ opacity: 1, backgroundPositionX: '0%' }}
                transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#C084FC] to-[#A855F7] inline-block"
              >
                um sorriso.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="text-white/75 text-lg md:text-[1.15rem] mb-10 leading-[1.75] max-w-[620px] mx-auto"
            >
              Tratamento odontológico <strong className="text-white">100% gratuito</strong> para mulheres
              cisgênero e transgênero vítimas de violência doméstica que tiveram os dentes afetados pela agressão.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.38 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="https://wa.me/5511965793913"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#6B2D8B] text-white px-8 py-4 text-lg font-bold rounded-full transition-colors hover:bg-[#5B2070] shadow-[0_4px_24px_rgba(107,45,139,0.50)] flex items-center gap-2 justify-center"
              >
                <MessageCircle size={20} /> Solicitar atendimento
              </motion.a>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/cadastro"
                  className="bg-transparent border-2 border-white/40 text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-white/15 hover:border-white/70 transition-all flex items-center gap-2 justify-center"
                >
                  <Heart size={20} /> Quero ser voluntária
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-5"
            >
              <a href="#o-programa" className="text-white/40 text-sm hover:text-white/70 transition-colors hover:underline underline-offset-2">
                Conheça o programa →
              </a>
            </motion.div>
          </div>

          {/* Stats — cada um entra escalonado */}
          <div className="mt-16 flex flex-wrap justify-center gap-5">
            {[
              { value: '1.100+', label: 'mulheres atendidas' },
              { value: '13 anos', label: 'de programa ativo' },
              { value: 'Lei federal', label: 'PL 15.116/25' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.55 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="text-center px-6 py-3 bg-white/8 border border-white/15 rounded-2xl backdrop-blur-sm cursor-default"
              >
                <p className="text-white font-black text-2xl leading-none">{s.value}</p>
                <p className="text-white/45 text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll hint animado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ opacity: { delay: 1.1, duration: 0.8 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/25 text-[10px] tracking-[3px] uppercase">role para ver mais</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          O QUE É O PROGRAMA
      ══════════════════════════════════════════════════════════════ */}
      <section id="o-programa" className="py-28 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-16 items-center">

          <motion.div {...fadeLeft()} className="flex-1">
            <motion.span {...popIn(0.1)} className="text-[#6B2D8B] dark:text-purple-400 text-xs font-bold uppercase tracking-[3px] mb-5 block">
              O programa
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.12] mb-6">
              Reconstruir um dente<br />é reconstruir uma{' '}
              <span className="text-[#6B2D8B] dark:text-purple-400">história.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-5">
              Desde 2012, o programa Apolônias do Bem oferece tratamento odontológico integral e gratuito
              a mulheres que sofreram violência doméstica e tiveram seus dentes afetados pelas agressões.
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
              Em 2025, o programa conquistou reconhecimento nacional com a sanção do{' '}
              <strong className="text-gray-800 dark:text-slate-200">PL 15.116/25</strong>, que institui o
              Programa de Reconstrução Dentária para Mulheres Vítimas de Violência Doméstica no SUS.
            </p>

            <motion.div {...scaleIn(0.15)} className="bg-[#EDE9F6] dark:bg-purple-950/30 border border-[#6B2D8B]/20 dark:border-purple-800/30 rounded-2xl p-5">
              <p className="text-[#6B2D8B] dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-2">A origem do nome</p>
              <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
                Apolônia de Alexandria foi uma mártir do século III que, após ser presa e espancada,
                teve <strong>todos os dentes arrancados</strong>. O programa carrega seu nome em homenagem
                a todas as mulheres que tiveram seu sorriso roubado pela violência — e em compromisso de devolvê-lo.
              </p>
            </motion.div>
          </motion.div>

          <motion.div {...fadeRight(0.1)} className="flex-1 flex flex-col gap-5">

            {/* Citação */}
            <motion.div
              whileHover={{ scale: 1.015, boxShadow: '0 8px 40px rgba(107,45,139,0.12)' }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden"
            >
              <motion.div
                animate={{ opacity: [0.06, 0.12, 0.06] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 right-6 text-[5rem] font-black text-[#6B2D8B] leading-none select-none pointer-events-none"
              >
                "
              </motion.div>
              <p className="text-gray-700 dark:text-slate-200 text-lg leading-relaxed italic relative z-10">
                "O sorriso foi a última coisa que me roubaram. Hoje eu tenho ele de volta."
              </p>
              <p className="text-[#6B2D8B] dark:text-purple-400 text-xs mt-4 font-black uppercase tracking-wider">
                — Beneficiária do Programa Apolônias do Bem
              </p>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '1.100+',   label: 'mulheres atendidas' },
                { value: 'SP · RJ · ES', label: 'e demais estados' },
                { value: '100%',     label: 'gratuito e sigiloso' },
                { value: '2012',     label: 'ano de fundação' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const } }}
                  whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.35, ease: 'easeOut' as const } }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm text-center cursor-default"
                >
                  <p className="text-2xl font-black leading-none mb-1 text-[#6B2D8B] dark:text-purple-400">{s.value}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-xs">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMO FUNCIONA — 4 passos
      ══════════════════════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-28 bg-[#1E1528] relative overflow-hidden">
        {/* Orbs animados */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#6B2D8B]/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#6B2D8B]/12 blur-3xl pointer-events-none"
        />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <motion.span {...popIn(0.1)} className="text-[#C084FC] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Simples assim
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Do primeiro contato<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C084FC] to-[#A855F7]">
                ao sorriso restaurado.
              </span>
            </h2>
            <p className="text-white/45 text-lg mt-5 max-w-md mx-auto">
              Sem burocracia desnecessária. Com acolhimento em cada etapa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.12)}
                whileHover={{ y: -8, borderColor: 'rgba(107,45,139,0.7)' }}
                transition={{ duration: 0.25 }}
                className="relative flex flex-col"
              >
                {/* Linha conectora */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                    className="hidden lg:block absolute top-10 left-[calc(100%-12px)] w-6 h-px bg-gradient-to-r from-[#6B2D8B]/50 to-transparent z-10"
                  />
                )}

                <div className="bg-white/5 border border-white/10 transition-all rounded-3xl p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-center gap-3">
                    <motion.div
                      {...popIn(0.15 + i * 0.12)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B2D8B] to-[#8B3A9E] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-purple-900/40"
                    >
                      {step.icon}
                    </motion.div>
                    <span className="text-[#C084FC]/50 font-black text-2xl leading-none">{step.num}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-black text-base mb-2">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>

                  {step.cta && (
                    <a
                      href={step.cta.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#C084FC] text-xs font-bold hover:underline mt-1"
                    >
                      {step.cta.label} <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.5)} className="text-center mt-14">
            <motion.a
              href="https://wa.me/5511965793913"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#6B2D8B] text-white px-9 py-4 rounded-full font-bold text-base hover:bg-[#5B2070] transition-colors shadow-[0_4px_24px_rgba(107,45,139,0.40)]"
            >
              <MessageCircle size={18} /> Entrar em contato agora
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          QUEM PODE SER ATENDIDA
      ══════════════════════════════════════════════════════════════ */}
      <section id="quem-pode" className="py-28 px-6 bg-[#EDE9F6] dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-[1000px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <motion.span {...popIn(0.1)} className="text-[#6B2D8B] dark:text-purple-400 text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Critérios
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Quem pode ser<br />
              <span className="text-[#6B2D8B] dark:text-purple-400">atendida?</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              O programa atende mulheres em situação de vulnerabilidade. Os casos mais graves têm prioridade, mas ninguém é descartada.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criterios.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0, transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const } }}
                whileHover={{ x: 5, transition: { duration: 0.35, ease: 'easeOut' as const } }}
                viewport={{ once: true }}
                className="flex items-start gap-4 bg-white dark:bg-slate-700 p-5 rounded-2xl border border-[#6B2D8B]/10 dark:border-purple-800/30 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={18} className="text-[#6B2D8B] dark:text-purple-400" />
                </div>
                <span className="text-gray-700 dark:text-slate-200 font-medium text-sm leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Nota sobre BO */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }}
            whileHover={{ scale: 1.01, transition: { duration: 0.35, ease: 'easeOut' as const } }}
            viewport={{ once: true }}
            className="mt-8 bg-white dark:bg-slate-700 border border-[#6B2D8B]/30 rounded-2xl p-6 flex gap-4 items-start shadow-sm"
          >
            <motion.div
              animate={{ boxShadow: ['0 0 0 0 rgba(107,45,139,0)', '0 0 0 6px rgba(107,45,139,0.08)', '0 0 0 0 rgba(107,45,139,0)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 bg-[#EDE9F6] dark:bg-purple-950/30 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <FileText size={18} className="text-[#6B2D8B] dark:text-purple-400" />
            </motion.div>
            <div>
              <p className="font-black text-gray-800 dark:text-slate-100 text-sm mb-1">Não tem Boletim de Ocorrência?</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                Entre em contato mesmo assim. Nossa equipe orienta como registrar o BO com segurança e encaminha para os canais corretos. Ligue{' '}
                <strong className="text-[#6B2D8B] dark:text-purple-400">180</strong>{' '}
                (Central de Atendimento à Mulher) ou acesse a delegacia mais próxima.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PARCEIROS INSTITUCIONAIS
      ══════════════════════════════════════════════════════════════ */}
      <section id="parceiros" className="py-28 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <motion.span {...popIn(0.1)} className="text-[#6B2D8B] dark:text-purple-400 text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Rede de apoio
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Para instituições<br />
              <span className="text-[#6B2D8B] dark:text-purple-400">parceiras.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Casas de acolhimento, tribunais e delegacias podem firmar parceria para encaminhar casos diretamente ao programa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {parceiros.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.35, ease: 'easeOut' as const } }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm text-center group cursor-default"
              >
                <div className="w-12 h-12 bg-[#EDE9F6] dark:bg-purple-950/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#6B2D8B] dark:text-purple-400">
                  {p.icon}
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-sm mb-2">{p.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="text-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/FormularioContato"
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-[#6B2D8B] text-[#6B2D8B] dark:text-purple-400 px-8 py-4 rounded-full font-bold text-base hover:bg-[#6B2D8B] hover:text-white dark:hover:bg-[#6B2D8B] dark:hover:text-white transition-all shadow-sm"
              >
                <Building2 size={18} /> Quero ser instituição parceira
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-br from-[#6B2D8B] via-[#7C3AAE] to-[#5B2070] relative overflow-hidden">
        {/* Orbs animados de fundo */}
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none blur-sm"
        />
        <motion.div
          animate={{ x: [15, -15, 15], y: [8, -8, 8], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/8 -translate-x-1/4 translate-y-1/4 pointer-events-none blur-sm"
        />

        <div className="max-w-[900px] mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Faça parte desta história.
            </h2>
            <p className="text-purple-200/75 text-xl max-w-lg mx-auto leading-relaxed">
              Como beneficiária, voluntária ou parceira institucional — há um lugar para você.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Precisa de atendimento */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.1, ease: 'easeOut' as const } }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-7 flex flex-col items-center text-center shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-[#6B2D8B]">
                <Heart size={26} />
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-2">Preciso de atendimento</h3>
              <p className="text-gray-500 mb-6 leading-relaxed text-xs flex-1">
                Sou mulher vítima de violência e quero receber tratamento odontológico gratuito.
              </p>
              <motion.a
                href="https://wa.me/5511965793913"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full bg-[#6B2D8B] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#5B2070] transition-all shadow-[0_4px_15px_rgba(107,45,139,0.35)]"
              >
                Falar pelo WhatsApp
              </motion.a>
            </motion.div>

            {/* Quero ser voluntária */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' as const } }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true }}
              className="bg-white/15 backdrop-blur-sm rounded-3xl p-7 flex flex-col items-center text-center border border-white/25"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white">
                <Users size={26} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Quero ser voluntária</h3>
              <p className="text-white/60 mb-6 leading-relaxed text-xs flex-1">
                Sou dentista e quero atender mulheres do programa Apolônias do Bem.
              </p>
              <motion.div whileTap={{ scale: 0.97 }} className="w-full">
                <Link
                  to="/cadastro"
                  className="block w-full bg-white text-[#6B2D8B] py-3.5 rounded-2xl font-bold text-sm hover:bg-purple-50 transition-all text-center"
                >
                  Cadastrar como dentista
                </Link>
              </motion.div>
            </motion.div>

            {/* Parceria institucional */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' as const } }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-7 flex flex-col items-center text-center border border-white/15"
            >
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-purple-200">
                <Building2 size={26} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Somos uma instituição</h3>
              <p className="text-white/50 mb-6 leading-relaxed text-xs flex-1">
                Casa de acolhimento, tribunal ou delegacia — firme parceria conosco.
              </p>
              <motion.div whileTap={{ scale: 0.97 }} className="w-full">
                <Link
                  to="/FormularioContato"
                  className="block w-full bg-white/20 border border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-white/30 transition-all text-center"
                >
                  Entrar em contato
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.45)} className="text-center mt-10">
            <Link
              to="/Doador"
              className="inline-flex items-center gap-2 text-purple-200/70 font-semibold hover:text-white transition-colors text-sm group"
            >
              <Heart size={16} className="group-hover:scale-110 transition-transform" />
              Ou apoie financeiramente o programa →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
