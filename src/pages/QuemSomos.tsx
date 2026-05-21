import { motion } from 'framer-motion';
import fotoCorrea from '../img/foto-correa.jpg';
import fotoKay from '../img/foto-kay.jpg';
import fotoEric from '../img/foto-eric.jpg';

export function QuemSomos() {
  const equipe = [
    {
      nome: "Gabriel Correa",
      rm: "567903",
      turma: "1TDSPB",
      foto: fotoCorrea,
      github: "https://github.com/gcorrea4",
      linkedin: "https://www.linkedin.com/in/gabriel-correa-souza-763135271/"
    },
    {
      nome: "Kayque Duarte",
      rm: "567980",
      turma: "1TDSPB",
      foto: fotoKay,
      github: "https://github.com/Kayque2012",
      linkedin: "https://www.linkedin.com/in/kayque-duarte-b24313361"
    },
    {
      nome: "Eric Maciel",
      rm: "567398",
      turma: "1TDSPB",
      foto: fotoEric,
      github: "https://github.com/Eric-devops-tech",
      linkedin: "https://www.linkedin.com/in/eric-maciel-144058389"
    }
  ];

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans text-center py-[40px] px-[20px] md:py-[60px] md:px-[5%] overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#333333] text-[2.5rem] font-bold mt-0 mb-0">Nossa Equipe</h2>
        <p className="text-[#555555] text-[18px] mt-[15px] mb-[60px] max-sm:mb-[30px]">
          Nosso time de desenvolvedores para o Challenge
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-[40px] xl:gap-[30px] lg:gap-[25px]">
        {equipe.map((membro, index) => (
          <motion.article 
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="group bg-white border border-[#e0e0e0] rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-[300px] p-[30px] max-lg:w-[280px] max-md:w-[80%] max-md:max-w-[300px] max-sm:w-[90%] max-sm:p-[20px] transition-all duration-300 hover:-translate-y-[8px] hover:shadow-[0_12px_25px_rgba(255,140,0,0.15)] hover:border-orange-200"
          >
            <img 
              src={membro.foto} 
              alt={membro.nome} 
              className="w-[150px] h-[150px] rounded-full object-cover mb-[20px] border-[3px] border-[#eee] mx-auto transition-transform duration-300 group-hover:scale-105"
            />
            <h3 className="text-[22px] m-0 font-bold text-[#333333] transition-colors duration-300 group-hover:text-orange-500">
              {membro.nome}
            </h3>
            <p className="text-[#777] mb-[20px] mt-[10px]">
              <strong>RM:</strong> {membro.rm} &nbsp;<strong>Turma:</strong> {membro.turma}
            </p>
            <div>
              <a href={membro.github} target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-300 hover:text-orange-500">GitHub</a>
              <a href={membro.linkedin} target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-300 hover:text-orange-500">LinkedIn</a>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  );
}