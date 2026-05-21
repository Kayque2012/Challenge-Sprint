import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, Zap, Calculator, Users, MessageCircle } from 'lucide-react';
import turmaDoRemHero from '../img/turma-do-bem-hero.jpg';

export function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Lógica do Ciclo Infinito: Volta pro final se estiver no começo
  const scrollLeft = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth } = carouselRef.current;
      if (scrollLeft <= 10) {
        // Se está no primeiro card, rola tudo para o final
        carouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: -420, behavior: 'smooth' });
      }
    }
  };

  // Lógica do Ciclo Infinito: Volta pro começo se estiver no final
  const scrollRight = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      // Adicionamos uma margem de erro de 10px para garantir que ele detecte o final
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Se chegou no último card, volta pro primeiro
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
      }
    }
  };

  // Dados extraídos das suas páginas para "encher" o carrossel
  const cards = [
    {
      num: "1°",
      icon: <Calculator size={32} />,
      title: "Triagem Inteligente",
      desc: "Algoritmo de priorização para jovens em situação de vulnerabilidade com base em métricas socioeconômicas.",
      color: "orange"
    },
    {
      num: "2°",
      icon: <ShieldCheck size={32} />,
      title: "Prontuário Digital",
      desc: "Histórico clínico completo e seguro, garantindo que cada atendimento seja registrado e acompanhado.",
      color: "green"
    },
    {
      num: "3°",
      icon: <Zap size={32} />,
      title: "Match Geográfico",
      desc: "Conectamos dentistas voluntários aos pacientes mais próximos através de mapas de calor reais.",
      color: "orange"
    },
    {
      num: "4°",
      icon: <Heart size={32} />,
      title: "Impacto Direto",
      desc: "Sua doação via PIX financia kits de higiene e tratamentos complexos como canais e próteses.",
      color: "green"
    },
    {
      num: "5°",
      icon: <Users size={32} />,
      title: "Rede de Voluntariado",
      desc: "Faça parte da maior rede de voluntariado especializado do mundo, presente em todo o Brasil.",
      color: "orange"
    },
    {
      num: "6°",
      icon: <MessageCircle size={32} />,
      title: "Suporte e Contato",
      desc: "Canais diretos de comunicação com a sede da TdB em São Paulo para tirar dúvidas em tempo real.",
      color: "green"
    }
  ];

  return (
    <main className="bg-[#F5F5DC] text-[#333333] font-sans overflow-x-hidden">
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HERO SECTION */}
      <section 
        className="relative w-full min-h-screen flex justify-center items-center text-center pt-20 box-border bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${turmaDoRemHero}')` }}
      >
        <div className="relative z-10 max-w-[800px] p-5">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-[3.5rem] font-black leading-[1.1] mb-5"
          >
            Otimizando o Atendimento, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#FFD700]">Transformando Vidas</span>
          </motion.h1>
          <p className="text-[#E0E0E0] text-lg md:text-[1.2rem] mb-10 font-normal leading-[1.6]">
            Uma solução integrada para agilizar a triagem e a gestão de atendimentos da maior rede de voluntariado especializado do mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link to="/cadastro" className="bg-[#FF8C00] text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-[#E67E22] transition-all shadow-[0_4px_20px_rgba(255,140,0,0.4)]">Preciso de Atendimento</Link>
            <Link to="/cadastro" className="bg-transparent border-2 border-white text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-white hover:text-[#333] transition-all">Sou Dentista Voluntário</Link>
          </div>
          <Link to="/sobre" className="text-white/50 text-sm hover:text-white/80 transition-colors mt-3 block text-center hover:underline underline-offset-2">Conheça o projeto →</Link>
        </div>
      </section>

      {/* CARROSSEL EXPANDIDO COM CICLO */}
      <section className="py-24 max-w-[1400px] mx-auto overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 tracking-tight">O que entregamos <span className="text-[#FF8C00]">de verdade.</span></h2>
            <p className="text-lg text-gray-500 font-medium">Nossa plataforma automatiza processos complexos para focar no que importa: o sorriso dos jovens.</p>
          </motion.div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={scrollLeft} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all bg-white shadow-sm"><ChevronLeft size={24} /></button>
            <button onClick={scrollRight} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all bg-white shadow-sm"><ChevronRight size={24} /></button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-12 snap-x snap-mandatory scroll-smooth hide-scroll w-full"
        >
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-10 md:p-12 rounded-[32px] min-w-[320px] md:min-w-[420px] snap-start border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-orange-200 transition-all"
            >
              <div className="absolute -right-4 -top-8 text-[8rem] font-black text-gray-50 opacity-50 group-hover:scale-110 transition-transform pointer-events-none">{card.num.replace('°','')}</div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-colors ${card.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 relative z-10">{card.title}</h3>
              <p className="text-gray-500 leading-relaxed text-lg relative z-10">{card.desc}</p>
            </motion.div>
          ))}
          {/* Spacer invisível reduzido para permitir que o scroll chegue exatamente no fim */}
          <div className="min-w-[1px] flex-shrink-0 snap-end"></div>
        </div>
      </section>

      

    </main>
  );
}