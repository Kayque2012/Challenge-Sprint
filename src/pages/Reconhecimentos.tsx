import { motion } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';

export function Reconhecimentos() {
  const premios = [
    { ano: '2006', titulo: 'Schwab Foundation',       desc: 'O Dr. Fábio Bibancos, fundador da TdB, foi reconhecido mundialmente como Empreendedor Social.', destaque: false },
    { ano: '2007', titulo: 'Ashoka Fellow',           desc: 'A Ashoka selecionou a Turma do Bem como membro, conectando a ONG a milhares de iniciativas pelo mundo.', destaque: false },
    { ano: '2016', titulo: 'UBS Visionaris',          desc: 'A organização venceu o prestigiado Prêmio Visionaris ao Empreendedor Social pela sua busca de sustentabilidade.', destaque: false },
    { ano: '2018', titulo: 'Fundación MAPFRE',        desc: 'A ONG foi premiada internacionalmente por melhorar a integração e qualidade de vida de grupos vulneráveis.', destaque: false },
    { ano: '2021', titulo: 'ONU Mulheres',            desc: 'O programa Apolônias do Bem integrou a campanha da ONU pelo fim da violência contra as mulheres.', destaque: false },
    { ano: '2021', titulo: 'Selo de Direitos Humanos',desc: 'O programa Apolônias do Bem recebeu o Selo de Direitos Humanos e Diversidade pela sua luta a favor de mulheres vítimas de violência.', destaque: true },
    { ano: '2023', titulo: 'Melhores ONGs do Brasil', desc: 'A Turma do Bem foi eleita uma das 100 Melhores ONGs do Brasil num evento do Instituto Doar.', destaque: false },
    { ano: '2024', titulo: 'TheDotGood',              desc: 'Selecionada por mídia independente da Suíça como uma das 50 ONGs mais inovadoras e impactantes do mundo.', destaque: false },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FF8C00] via-[#F5820A] to-[#E06000] pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-white/10 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <Trophy size={15} /> Prêmios e Reconhecimentos
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Reconhecidos pelo mundo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-orange-100 text-lg max-w-xl mx-auto"
          >
            Duas décadas de impacto real, reconhecidas por organizações internacionais de prestígio.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center gap-8 mt-10"
          >
            {[{ value: '8+', label: 'Prêmios' }, { value: '18 anos', label: 'de Impacto' }, { value: 'Global', label: 'Reconhecimento' }].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-orange-200 text-xs font-semibold mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-slate-700" />

          <div className="space-y-8">
            {premios.map((premio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="relative flex gap-6"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border-2 transition-all duration-300 ${
                  premio.destaque
                    ? 'bg-[#FF8C00] border-orange-300 shadow-orange-200'
                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-600'
                }`}>
                  {premio.destaque
                    ? <Star size={22} className="text-white fill-white" />
                    : <Award size={22} className="text-orange-400" />
                  }
                </div>

                {/* Card */}
                <div className={`flex-1 mb-2 p-6 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                  premio.destaque
                    ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50 hover:shadow-orange-100'
                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800/60'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`font-black text-lg leading-tight ${premio.destaque ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                      {premio.titulo}
                    </h3>
                    <span className={`text-xs font-black px-3 py-1 rounded-full flex-shrink-0 ${
                      premio.destaque
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
                    }`}>
                      {premio.ano}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{premio.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center bg-gradient-to-br from-orange-50 dark:from-slate-800 to-white dark:to-slate-800 border border-orange-100 dark:border-slate-700 rounded-3xl p-10"
        >
          <Trophy size={32} className="text-orange-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Uma história de impacto real</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            A Turma do Bem continua crescendo e transformando sorrisos em oportunidades de vida para jovens em todo o Brasil e América Latina.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
