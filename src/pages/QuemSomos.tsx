import { motion } from 'framer-motion';
import { Code2, ExternalLink, Users } from 'lucide-react';
import fotoCorrea from '../img/foto-correa.jpg';
import fotoKay from '../img/foto-kay.jpg';
import fotoEric from '../img/foto-eric.jpg';

export function QuemSomos() {
  const equipe = [
    {
      nome: 'Gabriel Correa',
      rm: '567903',
      turma: '1TDSPB',
      foto: fotoCorrea,
      papel: 'Full Stack Developer',
      github: 'https://github.com/gcorrea4',
      linkedin: 'https://www.linkedin.com/in/gabriel-correa-souza-763135271/',
    },
    {
      nome: 'Kayque Duarte',
      rm: '567980',
      turma: '1TDSPB',
      foto: fotoKay,
      papel: 'Full Stack Developer',
      github: 'https://github.com/Kayque2012',
      linkedin: 'https://www.linkedin.com/in/kayque-duarte-b24313361',
    },
    {
      nome: 'Eric Maciel',
      rm: '567398',
      turma: '1TDSPB',
      foto: fotoEric,
      papel: 'Full Stack Developer',
      github: 'https://github.com/Eric-devops-tech',
      linkedin: 'https://www.linkedin.com/in/eric-maciel-144058389',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-orange-500/20"
          >
            <Users size={15} /> O Time
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            Quem Somos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto"
          >
            Conheça os desenvolvedores por trás do Dentista na Nuvem — um projeto acadêmico da FIAP.
          </motion.p>
        </div>
      </div>

      {/* ── Team cards ── */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-8">
          {equipe.map((membro, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-orange-100/50 dark:hover:shadow-orange-900/20 w-[300px] max-md:w-[85%] max-md:max-w-[320px] overflow-hidden transition-all duration-300 hover:-translate-y-2"
            >
              {/* Card top */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 pt-8 pb-16 flex justify-center">
                <div className="absolute inset-0 bg-[#FF8C00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={membro.foto}
                  alt={`Foto de ${membro.nome}`}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card body */}
              <div className="px-6 pb-6 -mt-8 text-center">
                <div className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm px-4 py-3 inline-block mb-4 relative z-10">
                  <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest">{membro.papel}</span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
                  {membro.nome}
                </h3>

                <div className="flex items-center justify-center gap-3 text-xs text-gray-400 dark:text-slate-400 font-semibold mb-6">
                  <span className="bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 px-3 py-1 rounded-full">RM {membro.rm}</span>
                  <span className="bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 px-3 py-1 rounded-full">{membro.turma}</span>
                </div>

                <div className="flex gap-3">
                  <a
                    href={membro.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-slate-950 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <Code2 size={16} /> GitHub
                  </a>
                  <a
                    href={membro.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink size={16} /> LinkedIn
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Project badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-gray-700 dark:text-slate-200 font-semibold text-sm px-6 py-3 rounded-2xl">
            <Code2 size={18} className="text-orange-500" />
            Projeto desenvolvido para o Challenge FIAP 2025 · Turma 1TDSPB
          </div>
        </motion.div>
      </div>
    </main>
  );
}
