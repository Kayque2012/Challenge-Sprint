import { motion } from 'framer-motion';

export function FAQ() {
  const perguntas = [
    {
      pergunta: "O que é este projeto?",
      resposta: "Este é um projeto acadêmico desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas da FIAP. A plataforma é uma ferramenta de gestão integrada, criada como uma solução para otimizar o fluxo de atendimento e comunicação da ONG Turma do Bem."
    },
    {
      pergunta: "Qual problema ele resolve?",
      resposta: "A Turma do Bem recebe um grande volume de contatos por diversos canais, o que dificulta o controle. Nossa plataforma busca centralizar as solicitações, automatizar o encaminhamento através do Simulador de Match e permitir o acompanhamento de cada caso."
    },
    {
      pergunta: "Quais tecnologias foram utilizadas?",
      resposta: "A solução integra HTML e CSS para o Front-End, Java e Python para o Back-End, um banco de dados relacional para o armazenamento seguro das informações e um chatbot para a triagem inicial."
    },
    {
      pergunta: "Este sistema já está em uso pela Turma do Bem?",
      resposta: "Atualmente, o projeto é um protótipo funcional (MVP - Mínimo Produto Viável) desenvolvido para o Challenge da FIAP. Ele serve como uma prova de conceito e demonstra como a tecnologia pode ser aplicada para solucionar o desafio."
    },
    {
      pergunta: "Como posso saber mais sobre a Turma do Bem ou ajudar?",
      resposta: "A Turma do Bem é a maior rede de voluntariado especializado do mundo! Para conhecer mais sobre o trabalho, fazer doações ou se voluntariar, recomendamos visitar o site oficial da organização."
    }
  ];

  return (
    <main className="bg-[#F5F5DC] min-h-screen py-[60px] px-[20px] md:px-[60px] font-sans overflow-hidden">
      <section className="max-w-[1200px] mx-auto text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#333333] text-[32px] md:text-[40px] font-bold mt-[20px] mb-[40px]"
        >
          Perguntas frequentes
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] text-left">
          {perguntas.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-black/10 p-[30px] rounded-[16px] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:border-[#FF8C00] hover:shadow-[0_8px_20px_rgba(255,140,0,0.15)]"
            >
              <h3 className="text-[#FF8C00] text-[1.3rem] font-bold mb-[10px]">
                {item.pergunta}
              </h3>
              <p className="text-[#666666] leading-[1.5] text-[18px] md:text-[20px] text-justify tracking-tight">
                {item.resposta}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-[60px] py-[30px] border-t border-black/5"
        >
          <p className="text-[#666666] text-[18px]">
            Não encontrou sua dúvida? <a href="/contato" className="text-[#FF8C00] font-bold underline-offset-4 hover:underline">Fale com o suporte da ONG</a>
          </p>
        </motion.div>

      </section>
    </main>
  );
}