import { motion } from 'framer-motion';

export function Reconhecimentos() {
  const premios = [
    {
      ano: "2006",
      titulo: "Schwab Foundation",
      desc: "O Dr. Fábio Bibancos, fundador da TdB, foi reconhecido mundialmente como Empreendedor Social."
    },
    {
      ano: "2007",
      titulo: "Ashoka Fellow",
      desc: "A Ashoka selecionou a Turma do Bem como membro, conectando a ONG a milhares de iniciativas pelo mundo."
    },
    {
      ano: "2016",
      titulo: "UBS Visionaris",
      desc: "A organização venceu o prestigiado Prêmio Visionaris ao Empreendedor Social pela sua busca de sustentabilidade."
    },
    {
      ano: "2018",
      titulo: "Fundación MAPFRE",
      desc: "A ONG foi premiada internacionalmente por melhorar a integração e qualidade de vida de grupos vulneráveis."
    },
    {
      ano: "2021",
      titulo: "ONU Mulheres",
      desc: "O programa Apolônias do Bem integrou a campanha da ONU pelo fim da violência contra as mulheres."
    },
    {
      ano: "2023",
      titulo: "Melhores ONGs",
      desc: "A Turma do Bem foi eleita uma das 100 Melhores ONGs do Brasil num evento do Instituto Doar."
    },
    {
      ano: "2024",
      titulo: "TheDotGood",
      desc: "Selecionada por mídia independente da Suíça como uma das 50 ONGs mais inovadoras e impactantes do mundo."
    }
  ];

  return (
    <main className="bg-[#F5F5DC] min-h-screen pt-[100px] pb-[50px] px-[20px] font-sans overflow-hidden">
      
      <div className="max-w-[1200px] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-[70px]"
        >
          <h2 className="text-[2.5rem] text-black font-bold mb-[15px]">
            🏆 Prêmios e Reconhecimento
          </h2>
          <p className="text-[1.2rem] text-[#555555] max-w-[600px] mx-auto">
            Algumas das conquistas reais que destacam o impacto e a dedicação da Turma do Bem ao longo dos anos.
          </p>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[40px] md:gap-[30px]">
          
          {premios.map((premio, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[15px] p-[30px_25px] mt-[15px] text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-black/5 transition-all duration-300 relative flex flex-col justify-center hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(255,165,0,0.15)] hover:border-orange-500/30"
            >
              <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 bg-[#333333] text-white px-[15px] py-[5px] rounded-[20px] text-[0.9rem] font-bold shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                {premio.ano}
              </span>
              <h3 className="text-[#333333] text-[1.3rem] font-bold mt-[10px] mb-[15px]">{premio.titulo}</h3>
              <p className="text-[#666666] text-[1rem] leading-[1.5] m-0">{premio.desc}</p>
            </motion.div>
          ))}

          {/* Destaque Atual - Selo Direitos Humanos */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: premios.length * 0.1 }}
            className="bg-orange-500/5 rounded-[15px] p-[30px_25px] mt-[15px] text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] border-[2px] border-orange-500 transition-all duration-300 relative flex flex-col justify-center hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(255,165,0,0.15)]"
          >
            <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 bg-orange-500 text-white px-[15px] py-[5px] rounded-[20px] text-[0.9rem] font-bold shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              Destaque
            </span>
            <h3 className="text-[#333333] text-[1.3rem] font-bold mt-[10px] mb-[15px]">Selo de Direitos Humanos</h3>
            <p className="text-[#666666] text-[1rem] leading-[1.5] m-0">O programa Apolônias do Bem recebeu o selo de Direitos Humanos e Diversidade pela sua luta a favor de mulheres vítimas de violência.</p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}