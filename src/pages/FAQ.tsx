import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [aberto, setAberto] = useState<number | null>(0);

  const perguntas = [
    {
      pergunta: 'O que é este projeto?',
      resposta:
        'O Dentista na Nuvem é um projeto acadêmico desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas da FIAP. A plataforma é uma ferramenta de gestão integrada, criada para otimizar o fluxo de atendimento e comunicação da ONG Turma do Bem.',
    },
    {
      pergunta: 'Qual problema ele resolve?',
      resposta:
        'A Turma do Bem recebe um grande volume de contatos por diversos canais, o que dificulta o controle. Nossa plataforma busca centralizar as solicitações, automatizar o encaminhamento através do Simulador de Match e permitir o acompanhamento de cada caso.',
    },
    {
      pergunta: 'Quais tecnologias foram utilizadas?',
      resposta:
        'A solução integra React + TypeScript para o Front-End, Java (Quarkus) para o Back-End, Oracle Database para armazenamento seguro e uma integração com a API Gemini para a triagem inicial inteligente.',
    },
    {
      pergunta: 'Este sistema já está em uso pela Turma do Bem?',
      resposta:
        'Atualmente, o projeto é um protótipo funcional (MVP — Mínimo Produto Viável) desenvolvido para o Challenge da FIAP. Ele serve como uma prova de conceito e demonstra como a tecnologia pode ser aplicada para solucionar o desafio.',
    },
    {
      pergunta: 'Como posso saber mais sobre a Turma do Bem ou ajudar?',
      resposta:
        'A Turma do Bem é a maior rede de voluntariado especializado do mundo! Para conhecer mais sobre o trabalho, fazer doações ou se voluntariar, recomendamos visitar o site oficial da organização em turmadobem.org.br.',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FF8C00] via-[#F5820A] to-[#E06000] pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <HelpCircle size={15} /> Perguntas Frequentes
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Como podemos ajudar?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-orange-100 text-lg max-w-xl mx-auto"
          >
            Tudo que você precisa saber sobre o Dentista na Nuvem e a ONG Turma do Bem.
          </motion.p>
        </div>
      </div>

      {/* ── Accordion ── */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-3">
          {perguntas.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setAberto(aberto === index ? null : index)}
                className={`w-full text-left px-6 py-5 font-bold flex items-center justify-between gap-4 transition-all duration-200 ${
                  aberto === index
                    ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-200'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700'
                } rounded-2xl`}
              >
                <span className="text-base leading-snug flex items-center gap-3">
                  <span className={`text-sm font-black opacity-50 w-5 flex-shrink-0 ${aberto === index ? 'text-white' : 'text-orange-500'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.pergunta}
                </span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 transition-transform duration-300 ${aberto === index ? 'rotate-180 text-white' : 'text-gray-400 dark:text-slate-500'}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {aberto === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 bg-orange-50 dark:bg-orange-950/30 rounded-b-2xl border-x border-b border-orange-100 dark:border-orange-900/40 text-gray-600 dark:text-slate-300 leading-relaxed text-[15px]">
                      {item.resposta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center bg-gradient-to-br from-gray-50 dark:from-slate-800 to-orange-50/40 dark:to-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-10"
        >
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ainda tem dúvidas?</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Nossa equipe está pronta para ajudar você.</p>
          <a
            href="/contato"
            className="inline-flex items-center gap-2 bg-[#FF8C00] hover:bg-[#E67E22] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-md shadow-orange-200"
          >
            Fale com o suporte
          </a>
        </motion.div>
      </div>
    </main>
  );
}
