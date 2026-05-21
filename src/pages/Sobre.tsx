import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Star, CheckCircle2 } from 'lucide-react';
import { calcularScore, type TipoDor } from '../utils/scoreUtils';
import fiap from '../img/fiap.jpeg';

export function Sobre() {
 
  const [idade, setIdade] = useState(14);
  const [renda, setRenda] = useState(1);
  const [tipoDor, setTipoDor] = useState<TipoDor>('forte');
  const [score, setScore] = useState(0);

  // Usa o algoritmo real de calcularScore() — mesmo cálculo usado pelo DentistaDashboard
  // para ordenar a fila de triagem. Reflete a prioridade real do programa.
  useEffect(() => {
    setScore(calcularScore(tipoDor, renda, idade));
  }, [idade, renda, tipoDor]);

  // Critérios do algoritmo de match — pesos reais usados em scoreUtils.ts
  const regrasMatch = [
    { titulo: "Gravidade da Dor e Urgência Clínica", peso: "até +45 pts" },
    { titulo: "Baixa Renda Familiar",                peso: "até +35 pts" },
    { titulo: "Proximidade dos 18 anos",             peso: "até +20 pts" },
  ];

  // Arrays para facilitar a renderização e animação em cascata (stagger)
  const tecnologias = [
    { titulo: "Front-End", desc: "HTML, CSS e JavaScript para criar uma interface de utilizador interativa e amigável." },
    { titulo: "Back-End", desc: "Java e Python para construir a lógica do servidor, processamento de dados e regras de negócio." },
    { titulo: "Banco de Dados", desc: "Um sistema de banco de dados relacional para garantir a segurança e a integridade das informações." },
    { titulo: "Inteligência Artificial", desc: "Um chatbot para a automação da triagem inicial." }
  ];

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans py-[40px] px-[20px] overflow-hidden">
      
      <div className="max-w-[1100px] mx-auto">
        
        {/* CABEÇALHO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-[50px]"
        >
          <h2 className="text-black text-[2rem] md:text-[2.5rem] font-bold mb-[10px] mt-[50px]">Sobre o Nosso Projeto</h2>
          <p className="text-[#555555] text-[1.1rem]">Conheça a essência da nossa solução para a Turma do Bem.</p>
        </motion.div>

        {/* SECÇÃO IDEIA / PROJETO */}
        <section className="flex flex-col md:flex-row gap-[30px] mb-[50px]">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-[30px] rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex-1 border-t-[5px] border-orange-500 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]"
          >
            <h3 className="text-orange-500 text-[1.5rem] font-bold mb-[15px] mt-0">💡 A Ideia</h3>
            <p className="text-[#555555] leading-[1.6] text-justify m-0">
              A ideia por trás deste projeto nasceu da observação de que o primeiro contacto entre o paciente e o consultório odontológico pode ser demorado e repetitivo. Buscamos uma forma de agilizar essa etapa, garantindo que o dentista receba as informações essenciais do paciente de forma clara e organizada antes mesmo da primeira consulta, otimizando o tempo de todos e melhorando a qualidade do atendimento inicial.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-[30px] rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex-1 border-t-[5px] border-orange-500 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]"
          >
            <h3 className="text-orange-500 text-[1.5rem] font-bold mb-[15px] mt-0">🚀 O Projeto</h3>
            <p className="text-[#555555] leading-[1.6] text-justify m-0">
              Nosso projeto é um web app de gestão e triagem de pacientes. Através de um chatbot interativo, o sistema realiza o primeiro atendimento, coletando dados cadastrais e o histórico inicial do paciente. Essas informações são então processadas e armazenadas de forma segura, sendo apresentadas ao dentista num painel de controlo intuitivo, que facilita o acesso rápido a todo o histórico do cliente e otimiza o fluxo de trabalho da clínica.
            </p>
          </motion.div>
        </section>

        {/* TECNOLOGIAS UTILIZADAS */}
        <section className="mb-[60px]">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#333333] text-[1.5rem] md:text-[2rem] font-bold mt-[60px] mb-[30px] border-b-[2px] border-orange-500 inline-block pb-[10px] relative left-1/2 -translate-x-1/2 text-center"
          >
            Tecnologias Utilizadas
          </motion.h2>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[20px]">
            {tecnologias.map((tech, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-[20px] rounded-[10px] text-center border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-[5px] hover:border-orange-500 hover:shadow-[0_10px_20px_rgba(255,165,0,0.15)]"
              >
                <h3 className="text-[#333333] font-bold mb-[10px] mt-0">{tech.titulo}</h3>
                <p className="text-[#666666] text-[0.95rem] m-0">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ROADMAP / SPRINTS */}
        <section>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#333333] text-[1.5rem] md:text-[2rem] font-bold mt-[60px] mb-[30px] border-b-[2px] border-orange-500 inline-block pb-[10px] relative left-1/2 -translate-x-1/2 text-center"
          >
            Nosso Roadmap
          </motion.h2>
          
          <div className="flex flex-col gap-[15px] max-w-[800px] mx-auto text-left">
            {[
              { num: "1", desc: "Definição do escopo, planeamento, e desenvolvimento da estrutura base do front-end com as páginas estáticas." },
              { num: "2", desc: "Foco no desenvolvimento do back-end, modelagem do banco de dados e criação das principais regras de negócio." },
              { num: "3", desc: "Implementação do chatbot e início da integração entre o front-end e o back-end para a troca de dados." }
            ].map((sprint, i) => (
              <motion.div 
                key={sprint.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-[20px_25px] rounded-[10px] border-l-[5px] border-[#CCCCCC] shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
              >
                <span className="inline-block bg-[#333333] text-white px-[12px] py-[5px] rounded-[20px] text-[0.85rem] font-bold mb-[10px]">Sprint {sprint.num}</span>
                <p className="text-[#555555] m-0">{sprint.desc}</p>
              </motion.div>
            ))}

            {/* SPRINT ATUAL COM ANIMAÇÃO DE PULSO */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ 
                duration: 0.4, delay: 0.3, // Animação de entrada
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } // Animação contínua
              }}
              className="bg-orange-500/5 p-[20px_25px] rounded-[10px] border-l-[5px] border-orange-500 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
            >
              <span className="inline-block bg-orange-500 text-white px-[12px] py-[5px] rounded-[20px] text-[0.85rem] font-bold mb-[10px]">Sprint 4 (Atual)</span>
              <p className="text-[#555555] m-0">Integração final de todas as tecnologias, fase de testes, refatoração de código e preparação da solução para a apresentação final.</p>
            </motion.div>
          </div>
        </section>

        {/* TECNOLOGIA DIFERENCIAL & SIMULADOR */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-[40px]"
        >
          <h2 className="text-[#333333] text-[1.5rem] md:text-[2rem] font-bold mt-[60px] mb-[20px] border-b-[3px] border-orange-500 inline-block pb-[10px]">
            A nossa tecnologia diferencial
          </h2>
        </motion.div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-[50px] items-center mb-[80px]">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <p className="text-[#555555] text-[1.1rem] leading-relaxed">
              Diferente de uma fila comum, o nosso sistema utiliza um <strong>Algoritmo de Match Inteligente</strong> para calcular o Score de Impacto Social de cada caso. 
              Priorizamos jovens entre 11 e 17 anos em situação de vulnerabilidade económica, com quadros clínicos agudos e <strong>que residem próximos ao consultório voluntário</strong>.
            </p>
            
            <div className="space-y-5 mt-8">
              {regrasMatch.map((regra, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-500"><CheckCircle2 size={24}/></div>
                  <div>
                    <p className="text-base font-bold text-gray-800 m-0">{regra.titulo}</p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider m-0 mt-1">Peso: {regra.peso}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SIMULADOR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 relative overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5"><Star size={100} className="text-orange-600"/></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 border border-orange-100"><Calculator size={20}/></div>
              <span className="font-black text-gray-800 uppercase tracking-widest text-[10px]">Simulador de Match TdB</span>
            </div>

            <div className="space-y-8 relative z-10">

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Idade do Paciente</label>
                  <span className="text-orange-600 font-black text-lg">{idade} anos</span>
                </div>
                <input
                  type="range" min="11" max="17" step="1" value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Renda (Salários Mínimos)</label>
                  <span className="text-orange-600 font-black text-lg">{renda} SM</span>
                </div>
                <input
                  type="range" min="0" max="5" step="0.5" value={renda}
                  onChange={(e) => setRenda(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
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
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-300 ${tipoDor === item.valor ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-dashed border-gray-200 text-center relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Score de Prioridade</p>
              <div className="text-7xl font-black text-orange-500 drop-shadow-sm">{score}</div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mt-6 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-700 ease-out" 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.img 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src={fiap}
          alt="Logo FIAP" 
          className="w-full max-w-[500px] block mx-auto mt-[60px] mb-[20px] rounded-[10px]" 
        />

      </div>
    </main>
  );
}