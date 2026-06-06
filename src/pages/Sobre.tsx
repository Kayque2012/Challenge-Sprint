import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Star, CheckCircle2, Zap, Database, Globe, Bot, Layers, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calcularScore, type TipoDor } from '../utils/scoreUtils';
import fiap from '../img/fiap.jpeg';
import fiapLogo from '../img/fiap-logo.png';

export function Sobre() {
  const [idade, setIdade] = useState(14);
  const [renda, setRenda] = useState(1);
  const [tipoDor, setTipoDor] = useState<TipoDor>('forte');
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(calcularScore(tipoDor, renda, idade));
  }, [idade, renda, tipoDor]);

  const regrasMatch = [
    { titulo: 'Gravidade da Dor e Urgência Clínica', peso: 'até +45 pts' },
    { titulo: 'Baixa Renda Familiar',                peso: 'até +35 pts' },
    { titulo: 'Proximidade dos 18 anos',             peso: 'até +20 pts' },
  ];

  const tecnologias = [
    { icon: <Zap size={22} />,      titulo: 'React + TypeScript', desc: 'Interface moderna, responsiva e tipada com Tailwind CSS e Framer Motion.',         cor: 'orange' },
    { icon: <Layers size={22} />,   titulo: 'Java / Quarkus',     desc: 'Backend robusto com API REST, transações atômicas e Oracle JDBC.',                 cor: 'purple' },
    { icon: <Database size={22} />, titulo: 'Oracle Database',    desc: 'Banco relacional na nuvem com soft-delete e histórico de atendimentos.',            cor: 'orange' },
    { icon: <Bot size={22} />,      titulo: 'Gemini AI',          desc: 'Integração com Gemini 2.5 para triagem inteligente e assistente clínico.',          cor: 'purple' },
    { icon: <Globe size={22} />,    titulo: 'Azure + Vercel',     desc: 'Backend hospedado no Azure, frontend publicado na Vercel via GitHub Actions.',      cor: 'mixed'  },
  ];

  return (
    <main className="min-h-screen font-sans transition-colors duration-300 bg-[#F5F5DC] dark:bg-[#080c17]">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FF8C00] via-[#F5820A] to-[#E06000] dark:from-black dark:via-[#130B1A] dark:to-black pt-28 pb-20 px-4 relative overflow-hidden">

        {/* Decoração — círculos brancos no claro */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 dark:hidden rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-72 h-72 bg-white/10 dark:hidden rounded-full pointer-events-none" />

        {/* Orbs decorativos — CSS compositor-only (sem JS main thread) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 hidden dark:block rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none blur-3xl animate-orb-1" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-purple-600/20 hidden dark:block rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none blur-3xl animate-orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-orange-500/10 hidden dark:block rounded-full pointer-events-none blur-3xl animate-orb-3" />

        {/* Grid — linhas brancas em ambos os modos */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 xl:gap-20 items-center">

            {/* ── Texto ── */}
            <div className="text-center lg:text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7 text-xs font-black uppercase tracking-widest border bg-white/20 dark:bg-purple-500/[0.12] border-white/30 dark:border-purple-500/35 text-white dark:text-purple-400"
              >
                <Layers size={13} /> Sobre o Projeto
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl font-black text-white mb-5 leading-[1.05]"
              >
                Dentista na{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 dark:from-[#FF8C00] dark:to-[#C084FC]">
                  Nuvem
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="text-orange-100 dark:text-zinc-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
              >
                Uma plataforma de gestão inteligente para otimizar o fluxo de atendimento voluntário
                da ONG Turma do Bem — desenvolvida na FIAP por alunos de ADS.
              </motion.p>

              {/* Tech chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 mb-9"
              >
                {[
                  { label: 'React + TypeScript', cor: 'orange' },
                  { label: 'Java / Quarkus',     cor: 'purple' },
                  { label: 'Oracle DB',          cor: 'orange' },
                  { label: 'Gemini AI',          cor: 'purple' },
                  { label: 'Azure + Vercel',     cor: 'orange' },
                ].map((t) => (
                  <span
                    key={t.label}
                    className={`text-[11px] font-semibold px-4 py-1.5 rounded-full ${
                      t.cor === 'orange'
                        ? 'bg-white/20 dark:bg-orange-500/10 border border-white/30 dark:border-orange-500/25 text-white dark:text-orange-400'
                        : 'bg-white/20 dark:bg-purple-500/10 border border-white/30 dark:border-purple-500/25 text-white dark:text-purple-400'
                    }`}
                  >
                    {t.label}
                  </span>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                {[
                  { value: '4 Sprints', label: 'de desenvolvimento' },
                  { value: 'Score TdB', label: 'algoritmo próprio'  },
                  { value: 'IA Gemini', label: 'integrada'          },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center px-5 py-3 rounded-2xl bg-white/20 dark:bg-white/[0.05] border border-white/30 dark:border-white/[0.08]"
                  >
                    <p className="font-black text-lg leading-none text-white">{s.value}</p>
                    <p className="text-orange-100 dark:text-white/35 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Mockup do Dashboard ── */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' as const }}
              className="relative hidden lg:block"
            >
              {/* Glow atrás do mockup */}
              <div className="absolute -inset-6 bg-white/10 dark:bg-gradient-to-br dark:from-orange-500/15 dark:to-purple-500/10 blur-3xl rounded-3xl pointer-events-none" />

              {/* Chrome do browser */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.28)] dark:shadow-black/60 border border-white/30 dark:border-white/[0.08] ring-1 ring-white/20 dark:ring-white/[0.04]">

                {/* Barra de endereço */}
                <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400/90" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/90" />
                    <div className="w-3 h-3 rounded-full bg-green-400/90" />
                  </div>
                  <div className="flex-1 bg-white/80 dark:bg-zinc-700/70 rounded-md px-3 py-1.5 text-[11px] text-zinc-400 truncate">
                    dentistananuvem.vercel.app/dentista
                  </div>
                </div>

                {/* Conteúdo do app */}
                <div className="bg-[#FAFAF8] dark:bg-zinc-900 p-5">

                  {/* Header do dashboard */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em]">
                        Dashboard · Fila de Atendimento
                      </p>
                      <p className="font-black text-zinc-900 dark:text-white text-sm mt-0.5">
                        São Paulo · <span className="text-orange-500">12 pacientes</span>
                      </p>
                    </div>
                    <span className="text-[9px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-black uppercase tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                      Online
                    </span>
                  </div>

                  {/* Label ordenação */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Ordenado por</span>
                    <span className="text-[9px] font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20 uppercase tracking-wider">
                      Score TdB ▾
                    </span>
                  </div>

                  {/* Lista de pacientes */}
                  <div className="space-y-1.5">
                    {([
                      { initials: 'LM', name: 'Lucas M.',  sub: '14 anos · Dor aguda · 0,5 SM',  score: '91', urgLabel: '🔴 Urgente', grad: 'from-orange-500 to-red-500',    badge: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',           rank: 1 },
                      { initials: 'AM', name: 'Ana M.',    sub: '17 anos · Dor forte · 1 SM',    score: '76', urgLabel: '🟠 Forte',   grad: 'from-amber-500 to-orange-500',  badge: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400', rank: 2 },
                      { initials: 'RS', name: 'Rafael S.', sub: '12 anos · Dor média · 2 SM',    score: '54', urgLabel: '🟡 Média',   grad: 'from-purple-500 to-violet-500', badge: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500', rank: 3 },
                      { initials: 'JO', name: 'Julia O.',  sub: '15 anos · Dor leve · 3 SM',     score: '32', urgLabel: '🟢 Leve',    grad: 'from-blue-400 to-indigo-500',   badge: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500',   rank: 4 },
                    ] as const).map((p) => (
                      <div
                        key={p.name}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                          p.rank === 1
                            ? 'bg-orange-50/80 dark:bg-orange-500/[0.07] border-orange-200/60 dark:border-orange-500/20'
                            : 'bg-white dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 w-4 text-right flex-shrink-0">
                          #{p.rank}
                        </span>
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black bg-gradient-to-br ${p.grad}`}>
                          {p.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-black text-zinc-800 dark:text-zinc-100 leading-none">{p.name}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{p.sub}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${p.badge}`}>
                            {p.urgLabel}
                          </span>
                          <div className="text-right w-8">
                            <span className="text-[15px] font-black text-orange-500 leading-none">{p.score}</span>
                            <span className="text-[8px] text-zinc-300 dark:text-zinc-600 block leading-none">pts</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rodapé */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                      Score calculado automaticamente · algoritmo TdB
                    </span>
                    <span className="text-[9px] text-zinc-300 dark:text-zinc-600">ver todos →</span>
                  </div>
                </div>
              </div>

              {/* Chip flutuante */}
              <div className="absolute -bottom-4 -left-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-2.5 shadow-xl dark:shadow-black/40 animate-float">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🦷</span>
                  <div>
                    <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-100 leading-none">Próximo: Lucas M.</p>
                    <p className="text-[10px] text-orange-500 font-bold mt-0.5">Score 91 · Atendimento urgente</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Separador hero → conteúdo ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mt-px" />

      {/* ══════════════════════════════════════════════════
          CONCEITO — o problema e a solução
      ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F5DC] dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* O Problema */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } }}
              whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' as const } }}
              viewport={{ once: true, amount: 0 }}
              className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-orange-100 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(255,140,0,0.10)] transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-[#F5F5DC] dark:bg-slate-900/80" />
              <div className="absolute inset-0 bg-orange-500/[0.02]" />
              <div className="absolute -top-28 -left-14 w-96 h-96 bg-orange-400/[0.07] dark:bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-400/50 via-orange-500 to-orange-400/10" />

              <div className="relative p-10 md:p-12">
                <div className="flex items-center gap-2.5 mb-9">
                  <span className="w-5 h-px bg-orange-500 flex-shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-600 dark:text-orange-500">O Problema</span>
                </div>
                <blockquote className="text-[26px] md:text-[30px] font-black text-zinc-900 dark:text-white leading-[1.25] mb-8">
                  Jovens em vulnerabilidade{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300">esperando meses</span>{' '}
                  por um atendimento que poderia acontecer em{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300">semanas.</span>
                </blockquote>
                <div className="w-10 h-px bg-orange-400/40 mb-8" />
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] max-w-lg">
                  O primeiro contacto entre o paciente e a clínica odontológica pode ser demorado e repetitivo.
                  Buscamos agilizar essa etapa, garantindo que o dentista receba as informações essenciais
                  de forma clara e organizada — otimizando o tempo de todos e melhorando a qualidade do atendimento.
                </p>
              </div>
            </motion.div>

            {/* A Solução */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.15, ease: 'easeOut' as const } }}
              whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' as const } }}
              viewport={{ once: true, amount: 0 }}
              className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-purple-100 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(107,45,139,0.10)] transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-[#F5F5DC] dark:bg-slate-900/80" />
              <div className="absolute inset-0 bg-purple-500/[0.02]" />
              <div className="absolute -top-24 -right-14 w-80 h-80 bg-purple-400/[0.07] dark:bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-400/50 via-purple-500 to-purple-400/10" />

              <div className="relative p-9 md:p-10 h-full flex flex-col">
                <div className="flex items-center gap-2.5 mb-7">
                  <span className="w-5 h-px bg-purple-500 flex-shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-600 dark:text-purple-400">A Solução</span>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-7">O Projeto</h3>
                <div className="flex-1 flex flex-col">
                  {[
                    { emoji: '⚡', titulo: 'Score TdB',    desc: 'Algoritmo de prioridade social próprio' },
                    { emoji: '🤖', titulo: 'IA Gemini',     desc: 'Triagem e suporte clínico inteligente' },
                    { emoji: '📋', titulo: 'Fila ordenada', desc: 'Por urgência e vulnerabilidade' },
                    { emoji: '📅', titulo: 'Agendamento',   desc: 'Dentista propõe horários flexíveis' },
                    { emoji: '🦷', titulo: 'Alta clínica',  desc: 'Acompanhamento do início ao fim' },
                  ].map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3.5 py-3.5 border-b border-zinc-100 dark:border-white/[0.05] last:border-0">
                      <span className="text-lg w-7 text-center flex-shrink-0 select-none">{f.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-zinc-900 dark:text-white text-[13px] font-black">{f.titulo}</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-[12px] ml-2 leading-snug">{f.desc}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400/70 dark:bg-purple-500/50 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TECNOLOGIAS — dark section
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-80 bg-purple-600/8 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.22em]">Stack</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">Tecnologias Utilizadas</h2>
            <p className="text-white/40 text-base max-w-md mx-auto">Escolhidas para entregar performance, confiabilidade e escalabilidade.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tecnologias.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: index * 0.09, ease: 'easeOut' as const } }}
                whileHover={{ y: -5, transition: { duration: 0.3, ease: 'easeOut' as const } }}
                viewport={{ once: true, amount: 0 }}
                className={`group p-6 rounded-2xl border transition-all duration-300 flex gap-4 items-start ${
                  tech.cor === 'orange'
                    ? 'bg-orange-500/[0.06] border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/[0.10] hover:shadow-[0_8px_30px_rgba(255,140,0,0.15)]'
                    : tech.cor === 'purple'
                    ? 'bg-purple-500/[0.06] border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/[0.10] hover:shadow-[0_8px_30px_rgba(107,45,139,0.15)]'
                    : 'bg-white/[0.04] border-white/10 hover:border-white/22 hover:bg-white/[0.07] hover:shadow-[0_8px_30px_rgba(255,140,0,0.10)]'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-110 ${
                  tech.cor === 'orange'
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    : tech.cor === 'purple'
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    : 'bg-white/8 border-white/10 text-orange-400'
                }`}>
                  {tech.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white text-sm mb-1">{tech.titulo}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ROADMAP — light section com ghost numbers
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F5F5DC] dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
        {/* Ghost number de fundo */}
        <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 text-[18rem] font-black text-zinc-100 dark:text-white/[0.02] leading-none select-none pointer-events-none hidden lg:block">
          04
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-[0.22em]">Desenvolvimento</span>
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white mt-3 mb-4">Nosso Roadmap</h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-base max-w-md mx-auto">
              4 sprints de evolução contínua, da ideia à solução integrada com IA.
            </p>
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            {/* Linha de conexão vertical */}
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-500/60 via-orange-500/20 to-transparent" />

            <div className="space-y-4">
              {[
                { num: '01', titulo: 'Sprint 1 — Estrutura',  desc: 'Definição do escopo, planeamento e desenvolvimento da estrutura base do front-end com as páginas estáticas.' },
                { num: '02', titulo: 'Sprint 2 — Back-End',   desc: 'Desenvolvimento do back-end, modelagem do banco de dados Oracle e criação das principais regras de negócio.' },
                { num: '03', titulo: 'Sprint 3 — IA & API',   desc: 'Implementação da IA Gemini e integração completa entre front-end e back-end para a troca de dados em tempo real.' },
                { num: '04', titulo: 'Sprint 4 — Final',      desc: 'Integração final, testes, refatoração, UX aprimorado e preparação da solução para a apresentação final.', atual: true },
              ].map((sprint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }}
                  viewport={{ once: true, amount: 0 }}
                  className="relative flex gap-5 group"
                >
                  {/* Step bubble */}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 ${
                    sprint.atual
                      ? 'bg-orange-500 shadow-[0_0_28px_rgba(255,140,0,0.50)]'
                      : 'bg-white dark:bg-slate-800 border border-zinc-200 dark:border-white/8 group-hover:border-orange-300 dark:group-hover:border-orange-500/30'
                  }`}>
                    <span className={`text-[8px] font-black uppercase tracking-[0.15em] leading-none ${sprint.atual ? 'text-orange-100' : 'text-zinc-300 dark:text-zinc-600'}`}>Sp</span>
                    <span className={`text-base font-black leading-tight ${sprint.atual ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>{sprint.num}</span>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 mb-2 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                    sprint.atual
                      ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-500/30 hover:shadow-[0_8px_30px_rgba(255,140,0,0.14)]'
                      : 'bg-white dark:bg-slate-800/60 border-zinc-100 dark:border-white/5 hover:border-orange-200 dark:hover:border-orange-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                  }`}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <p className={`font-black text-sm ${sprint.atual ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
                        {sprint.titulo}
                      </p>
                      {sprint.atual && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white px-2.5 py-0.5 rounded-full">
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{sprint.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ALGORITMO + SIMULADOR — dark section
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-80 h-80 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-64 bg-purple-600/8 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.22em]">Score TdB</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">A Nossa Tecnologia Diferencial</h2>
            <p className="text-white/40 text-base max-w-md mx-auto">
              Um algoritmo que considera gravidade, renda e idade para priorizar quem mais precisa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Critérios */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <p className="text-white/50 text-base leading-relaxed">
                Diferente de uma fila comum, o nosso sistema utiliza um{' '}
                <strong className="text-white">Algoritmo de Match Inteligente</strong> para calcular o{' '}
                <strong className="text-orange-400">Score de Impacto Social</strong> de cada caso.
                Priorizamos jovens entre 11 e 17 anos em situação de vulnerabilidade económica e com quadros clínicos agudos.
              </p>

              <div className="space-y-3">
                {regrasMatch.map((regra, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.2 + index * 0.1, ease: 'easeOut' as const } }}
                    whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' as const } }}
                    viewport={{ once: true, amount: 0 }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:bg-orange-500/[0.08] hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="bg-orange-500/15 border border-orange-500/25 p-3 rounded-xl text-orange-400 flex-shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{regra.titulo}</p>
                      <p className="text-[11px] text-orange-400 font-black uppercase tracking-wider mt-0.5">Peso: {regra.peso}</p>
                    </div>
                    <span className="text-4xl font-black text-white/[0.04] select-none flex-shrink-0">0{index + 1}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Simulador */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/[0.04] border border-white/[0.08] p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none select-none">
                <Star size={110} className="text-orange-400" />
              </div>

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2.5 bg-orange-500/15 rounded-xl text-orange-400 border border-orange-500/20">
                  <Calculator size={20} />
                </div>
                <span className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Simulador de Match TdB</span>
              </div>

              <div className="space-y-7 relative z-10">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Idade do Paciente</label>
                    <span className="text-orange-400 font-black text-lg">{idade} anos</span>
                  </div>
                  <input type="range" min="11" max="17" step="1" value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Renda Familiar (Salários Mínimos)</label>
                    <span className="text-orange-400 font-black text-lg">{renda} SM</span>
                  </div>
                  <input type="range" min="0" max="5" step="0.5" value={renda}
                    onChange={(e) => setRenda(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Nível de Dor relatado</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { label: 'Leve',    valor: 'leve'    },
                      { label: 'Forte',   valor: 'forte'   },
                      { label: 'Urgente', valor: 'urgente' },
                    ] as { label: string; valor: TipoDor }[]).map(item => (
                      <button
                        key={item.valor}
                        onClick={() => setTipoDor(item.valor)}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-300 active:scale-95 ${
                          tipoDor === item.valor
                            ? 'bg-orange-500 text-white shadow-[0_4px_20px_rgba(255,140,0,0.45)]'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.11] border border-white/[0.08]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/[0.08] text-center relative z-10">
                <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.22em] mb-3">Score de Prioridade</p>
                <div
                  className="text-8xl font-black text-orange-400 leading-none"
                  style={{ textShadow: '0 0 50px rgba(255,140,0,0.50)' }}
                >
                  {score}
                </div>
                <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mt-6">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-full transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-3">
                  {score >= 70
                    ? '🔴 Alta prioridade — atendimento urgente'
                    : score >= 40
                    ? '🟡 Prioridade média'
                    : '🟢 Pode aguardar na fila'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          APOLÔNIAS + FIAP — white section
      ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F5DC] dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 space-y-14">

          {/* Banner Apolônias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-50 to-zinc-50 dark:from-purple-950/30 dark:to-slate-900 border border-purple-200/60 dark:border-purple-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 hover:shadow-[0_8px_40px_rgba(107,45,139,0.10)] transition-shadow duration-300"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-200 dark:border-purple-500/20">
              <Heart size={22} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase tracking-[0.22em] mb-1">Também da Turma do Bem</p>
              <p className="text-zinc-700 dark:text-zinc-200 font-bold text-sm">
                O Score TdB é exclusivo para jovens de 11–17 anos. Para mulheres vítimas de violência,
                a triagem usa o OHIP — conheça o programa Apolônias do Bem.
              </p>
            </div>
            <Link
              to="/apolonias-do-bem"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap shadow-[0_4px_20px_rgba(107,45,139,0.30)] hover:shadow-[0_6px_28px_rgba(107,45,139,0.42)] active:scale-95"
            >
              Ver programa <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* FIAP Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center pb-4"
          >
            <img src={fiapLogo} alt="Logo FIAP" className="dark:hidden w-full max-w-[240px]" />
            <img src={fiap} alt="Logo FIAP" className="hidden dark:block w-full max-w-[380px] rounded-2xl border border-white/5 shadow-sm" />
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-4 text-center">
              Projeto desenvolvido para o Challenge FIAP 2025
            </p>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
