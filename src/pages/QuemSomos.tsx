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
      fotoPos: 'object-center',
      papel: 'Full Stack Developer',
      github: 'https://github.com/gcorrea4',
      linkedin: 'https://www.linkedin.com/in/gabriel-correa-souza-763135271/',
    },
    {
      nome: 'Kayque Duarte',
      rm: '567980',
      turma: '1TDSPB',
      foto: fotoKay,
      fotoPos: 'object-center',
      papel: 'Full Stack Developer',
      github: 'https://github.com/Kayque2012',
      linkedin: 'https://www.linkedin.com/in/kayque-duarte-b24313361',
    },
    {
      nome: 'Eric Maciel',
      rm: '567398',
      turma: '1TDSPB',
      foto: fotoEric,
      fotoPos: 'object-[center_35%]',
      papel: 'Full Stack Developer',
      github: 'https://github.com/Eric-devops-tech',
      linkedin: 'https://www.linkedin.com/in/eric-maciel-144058389',
    },
  ];

  return (
    <main className="min-h-screen font-sans transition-colors duration-300 bg-[#F5F5DC] dark:bg-[#080c17]">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FF8C00] via-[#F5820A] to-[#E06000] pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <Users size={15} /> O Time
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Quem Somos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-orange-100 text-lg max-w-xl mx-auto"
          >
            Conheça os desenvolvedores por trás do Dentista na Nuvem — um projeto acadêmico da FIAP.
          </motion.p>
        </div>
      </div>

      {/* ── Cards verticais estilo artista ── */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipe.map((membro, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.65, delay: index * 0.15, ease: 'easeOut' as const } }}
              whileHover={{ y: -10, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true, amount: 0 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-orange-300 dark:hover:border-orange-500/50 shadow-sm hover:shadow-2xl hover:shadow-orange-100 dark:hover:shadow-orange-500/15 overflow-hidden transition-[border-color,box-shadow] duration-300"
            >
              {/* ── Foto ── */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={membro.foto}
                  alt={`Foto de ${membro.nome}`}
                  className={`w-full h-full object-cover ${membro.fotoPos} transition-transform duration-700 ease-out group-hover:scale-110`}
                />

                {/* Overlay laranja no hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/55 via-orange-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Gradiente permanente para legibilidade do badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                {/* Badge de papel */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center bg-black/55 backdrop-blur-md border border-white/15 text-white text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                    {membro.papel}
                  </span>
                </div>
              </div>

              {/* ── Linha de acento laranja ── */}
              <div className="h-[3px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500 transition-all duration-500" />

              {/* ── Info ── */}
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300">
                  {membro.nome}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/30 font-semibold mb-5">
                  <span>RM {membro.rm}</span>
                  <span className="text-gray-200 dark:text-white/15">·</span>
                  <span>{membro.turma}</span>
                </div>

                <div className="flex gap-3">
                  <a
                    href={membro.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-gray-900 dark:bg-white/8 hover:bg-gray-700 dark:hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-transparent dark:border-white/10 dark:hover:border-white/25 transition-all"
                  >
                    <Code2 size={14} /> GitHub
                  </a>
                  <a
                    href={membro.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-[#FF8C00] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition-colors shadow-[0_4px_14px_rgba(255,140,0,0.30)]"
                  >
                    <ExternalLink size={14} /> LinkedIn
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Badge projeto ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-gray-700 dark:text-slate-200 font-semibold text-sm px-6 py-3 rounded-2xl">
            <Code2 size={17} className="text-orange-500" />
            Projeto desenvolvido para o Challenge FIAP 2025 · Turma 1TDSPB
          </div>
        </motion.div>
      </div>
    </main>
  );
}
