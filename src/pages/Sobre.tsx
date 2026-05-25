import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Star, CheckCircle2, Zap, Database, Globe, Bot, Layers } from 'lucide-react';
import { calcularScore, type TipoDor } from '../utils/scoreUtils';
import fiap from '../img/fiap.jpeg';

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
    { icon: <Zap size={22} />,      titulo: 'React + TypeScript',  desc: 'Interface moderna, responsiva e tipada com Tailwind CSS e Framer Motion.' },
    { icon: <Layers size={22} />,   titulo: 'Java / Quarkus',      desc: 'Backend robusto com API REST, transações atômicas e Oracle JDBC.' },
    { icon: <Database size={22} />, titulo: 'Oracle Database',      desc: 'Banco relacional na nuvem com soft-delete e histórico de atendimentos.' },
    { icon: <Bot size={22} />,      titulo: 'Gemini AI',            desc: 'Integração com Gemini 2.5 para triagem inteligente e assistente clínico.' },
    { icon: <Globe size={22} />,    titulo: 'Azure + Vercel',       desc: 'Backend hospedado no Azure, frontend publicado na Vercel via GitHub Actions.' },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-orange-500/20"
          >
            <Layers size={15} /> Sobre o Projeto
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Dentista na Nuvem
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Uma plataforma de gestão inteligente para otimizar o fluxo de atendimento voluntário da ONG Turma do Bem — desenvolvida na FIAP por alunos de ADS.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* ── Ideia + Projeto ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              emoji: '💡',
              titulo: 'A Ideia',
              texto: 'O primeiro contacto entre o paciente e a clínica odontológica pode ser demorado e repetitivo. Buscamos agilizar essa etapa, garantindo que o dentista receba as informações essenciais do paciente de forma clara e organizada antes mesmo da primeira consulta — otimizando o tempo de todos e melhorando a qualidade do atendimento inicial.',
            },
            {
              emoji: '🚀',
              titulo: 'O Projeto',
              texto: 'Nossa plataforma é um web app de triagem e gestão de pacientes. Um algoritmo de match inteligente (Score TdB) prioriza jovens em vulnerabilidade. Os dentistas voluntários recebem uma fila ordenada por urgência, propõem horários e acompanham cada caso até à alta clínica — tudo integrado com IA Gemini para suporte clínico.',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 border-t-4 border-t-orange-500"
            >
              <span className="text-3xl mb-4 block">{card.emoji}</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{card.titulo}</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm">{card.texto}</p>
            </motion.div>
          ))}
        </section>

        {/* ── Tecnologias ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Stack</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">Tecnologias Utilizadas</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tecnologias.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-orange-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex gap-4 items-start"
              >
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">{tech.titulo}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Roadmap ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Desenvolvimento</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">Nosso Roadmap</h2>
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-slate-700" />
            <div className="space-y-5">
              {[
                { num: '1', titulo: 'Sprint 1', desc: 'Definição do escopo, planeamento e desenvolvimento da estrutura base do front-end com as páginas estáticas.' },
                { num: '2', titulo: 'Sprint 2', desc: 'Desenvolvimento do back-end, modelagem do banco de dados Oracle e criação das principais regras de negócio.' },
                { num: '3', titulo: 'Sprint 3', desc: 'Implementação da IA Gemini e integração completa entre front-end e back-end para a troca de dados em tempo real.' },
                { num: '4', titulo: 'Sprint 4 (Atual)', desc: 'Integração final, testes, refatoração, UX aprimorado e preparação da solução para a apresentação final.', atual: true },
              ].map((sprint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative flex gap-6"
                >
                  <div className={`relative z-10 w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm shadow-sm ${
                    sprint.atual ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400'
                  }`}>
                    {sprint.num}
                  </div>
                  <div className={`flex-1 p-5 rounded-2xl border mb-1 ${
                    sprint.atual
                      ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50'
                      : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                  }`}>
                    <p className={`font-black text-sm mb-1 ${sprint.atual ? 'text-orange-700 dark:text-orange-400' : 'text-gray-700 dark:text-slate-200'}`}>
                      {sprint.titulo}
                    </p>
                    <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{sprint.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Algoritmo + Simulador ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Score TdB</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">A Nossa Tecnologia Diferencial</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Descrição + critérios */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-gray-600 dark:text-slate-300 text-base leading-relaxed">
                Diferente de uma fila comum, o nosso sistema utiliza um{' '}
                <strong className="text-gray-900 dark:text-white">Algoritmo de Match Inteligente</strong> para calcular o{' '}
                <strong className="text-orange-500">Score de Impacto Social</strong> de cada caso.
                Priorizamos jovens entre 11 e 17 anos em situação de vulnerabilidade económica e com quadros clínicos agudos.
              </p>

              <div className="space-y-4">
                {regrasMatch.map((regra, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-orange-200 transition-all"
                  >
                    <div className="bg-orange-100 dark:bg-orange-950/30 p-3 rounded-xl text-orange-500 flex-shrink-0">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{regra.titulo}</p>
                      <p className="text-[11px] text-orange-500 font-black uppercase tracking-wider mt-0.5">Peso: {regra.peso}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Simulador */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Star size={100} className="text-orange-600" />
              </div>

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-950/30 rounded-xl text-orange-600 border border-orange-100 dark:border-orange-900/40">
                  <Calculator size={20} />
                </div>
                <span className="font-black text-gray-800 dark:text-slate-100 uppercase tracking-widest text-[10px]">Simulador de Match TdB</span>
              </div>

              <div className="space-y-7 relative z-10">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Idade do Paciente</label>
                    <span className="text-orange-600 font-black text-lg">{idade} anos</span>
                  </div>
                  <input type="range" min="11" max="17" step="1" value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Renda Familiar (Salários Mínimos)</label>
                    <span className="text-orange-600 font-black text-lg">{renda} SM</span>
                  </div>
                  <input type="range" min="0" max="5" step="0.5" value={renda}
                    onChange={(e) => setRenda(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nível de Dor relatado</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { label: 'Leve',    valor: 'leve'    },
                      { label: 'Forte',   valor: 'forte'   },
                      { label: 'Urgente', valor: 'urgente' },
                    ] as { label: string; valor: TipoDor }[]).map(item => (
                      <button
                        key={item.valor}
                        onClick={() => setTipoDor(item.valor)}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-300 ${tipoDor === item.valor ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' : 'bg-gray-50 dark:bg-slate-700 text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-dashed border-gray-200 dark:border-slate-600 text-center relative z-10">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Score de Prioridade</p>
                <div className="text-7xl font-black text-orange-500 drop-shadow-sm">{score}</div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden mt-6 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-700 ease-out"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">
                  {score >= 70 ? '🔴 Alta prioridade — atendimento urgente' : score >= 40 ? '🟡 Prioridade média' : '🟢 Pode aguardar na fila'}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FIAP Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <img
            src={fiap}
            alt="Logo FIAP"
            className="w-full max-w-[400px] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
          />
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-4 text-center">Projeto desenvolvido para o Challenge FIAP 2025</p>
        </motion.div>

      </div>
    </main>
  );
}
