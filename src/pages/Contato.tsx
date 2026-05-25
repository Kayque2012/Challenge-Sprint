import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Globe,
  ChevronDown,
  Copy,
  Check,
  Send,
  ExternalLink
} from 'lucide-react';

const ENDERECO = {
  rua: 'Rua Maurício Francisco Klabin, 449',
  bairro: 'Vila Mariana',
  cidade: 'São Paulo - SP',
  cep: '04120-020',
};

// URL correta do iframe do Google Maps
const MAPA_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  ENDERECO.rua + ', ' + ENDERECO.cidade
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

const CONTATOS = [
  { icon: Phone, label: 'Telefone', valor: '+55 11 5084-7276', copiavel: true },
  { icon: Mail, label: 'Email Presidente', valor: 'turmadobem@tdb.org.br', copiavel: true },
  { icon: Mail, label: 'Email Comunicação', valor: 'comunicacao@tdb.org.br', copiavel: true },
  { icon: MessageCircle, label: 'Dúvidas e Sugestões', valor: 'faleconosco@tdb.org.br', copiavel: true },
];

const REDES_SOCIAIS = [
  { icon: ExternalLink, nome: 'Facebook', url: 'https://www.facebook.com/turmadobem' },
  { icon: ExternalLink, nome: 'Twitter / X', url: 'https://x.com/turmadobem' },
  { icon: ExternalLink, nome: 'Instagram', url: 'https://www.instagram.com/ongturmadobem/' },
  { icon: ExternalLink, nome: 'LinkedIn', url: 'https://www.linkedin.com/company/turma-do-bem?originalSubdomain=br' },
  { icon: Globe, nome: 'Site Oficial', url: 'https://turmadobem.org.br/' },
];

const HORARIOS = [
  { dia: 'Segunda a Sexta', horario: '9h às 18h' },
  { dia: 'Sábado', horario: '9h às 13h' },
  { dia: 'Domingo', horario: 'Fechado' },
];

function BotaoCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* fallback silencioso */
    }
  };

  return (
    <button
      onClick={copiar}
      aria-label={`Copiar ${texto}`}
      title="Copiar"
      className="ml-2 p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors text-gray-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
    >
      {copiado ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
} 

interface AccordionProps {
  titulo: string;
  icone: LucideIcon;
  aberto: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function Accordion({ titulo, icone: Icone, aberto, onToggle, children }: AccordionProps) {
  const conteudoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState(0);

  useEffect(() => {
    const el = conteudoRef.current;
    if (el) {
      setAltura(el.scrollHeight);
    }
  }, [aberto]);

  return (
    <section className="border-b border-[#ddd] dark:border-slate-700">
      <h3 className="m-0">
        <button
          onClick={onToggle}
          aria-expanded={aberto}
          className="w-full flex items-center justify-between py-4 px-1 bg-transparent border-none cursor-pointer text-[#333] dark:text-slate-200 text-[1.1rem] font-semibold hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 rounded"
        >
          <span className="flex items-center gap-3">
            {Icone && <Icone size={20} className="text-orange-500" />}
            {titulo}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>

      <div
        role="region"
        style={{
          maxHeight: aberto ? `${altura}px` : '0px',
          opacity: aberto ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={conteudoRef} className="pb-4 px-1">
          {children}
        </div>
      </div>
    </section>
  );
}

export function Contato() {
  const [contatosOpen, setContatosOpen] = useState(true);
  const [localizacaoOpen, setLocalizacaoOpen] = useState(false);
  const [redesOpen, setRedesOpen] = useState(false);

  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen font-sans pt-20 overflow-x-hidden transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-20 max-w-[1200px] mx-auto my-12 px-5">

        {/* ── Coluna esquerda (Acordeões) ── */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full"
        >
          <h2 className="text-[#333] dark:text-white text-2xl lg:text-[34px] font-bold mb-2 mt-0">
            Contatos da empresa
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-10">
            Entre em contato conosco por qualquer um dos canais abaixo.
          </p>

          {/* Contatos */}
          <Accordion
            titulo="Contatos"
            icone={Phone}
            aberto={contatosOpen}
            onToggle={() => setContatosOpen(!contatosOpen)}
          >
            <ul className="list-none p-0 m-0 space-y-3">
              {CONTATOS.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-[#333] dark:text-slate-200">
                  <c.icon size={16} className="text-orange-400 shrink-0" />
                  <span>
                    <strong className="text-sm">{c.label}:</strong>{' '}
                    <span className="text-sm">{c.valor}</span>
                  </span>
                  {c.copiavel && <BotaoCopiar texto={c.valor} />}
                </li>
              ))}
            </ul>

            <Link
              to="/FormularioContato"
              className="mt-6 inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md no-underline focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
              <Send size={16} />
              Enviar mensagem pelo formulário
            </Link>
          </Accordion>

          <Accordion
            titulo="Localização"
            icone={MapPin}
            aberto={localizacaoOpen}
            onToggle={() => setLocalizacaoOpen(!localizacaoOpen)}
          >
            <div className="space-y-4">
              <p className="text-[#333] dark:text-slate-200 m-0 leading-relaxed text-sm">
                <MapPin size={14} className="inline mr-1 text-orange-400" />
                {ENDERECO.rua}
                <br />
                {ENDERECO.bairro}, {ENDERECO.cidade}, {ENDERECO.cep}
              </p>

              {/* Horário de funcionamento */}
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-100 dark:border-orange-900/50">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#333] dark:text-slate-200 m-0 mb-3">
                  <Clock size={16} className="text-orange-500" />
                  Horário de funcionamento
                </h4>
                <ul className="list-none p-0 m-0 space-y-1">
                  {HORARIOS.map((h) => (
                    <li key={h.dia} className="flex justify-between text-sm text-[#555] dark:text-slate-400">
                      <span>{h.dia}</span>
                      <span className="font-medium">{h.horario}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Accordion>

          {/* Redes Sociais */}
          <Accordion
            titulo="Redes Sociais"
            icone={Globe}
            aberto={redesOpen}
            onToggle={() => setRedesOpen(!redesOpen)}
          >
            <div className="flex flex-wrap gap-3">
              {REDES_SOCIAIS.map((r) => (
                <a
                  key={r.nome}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visitar ${r.nome}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-[#333] dark:text-slate-200 text-sm font-medium hover:border-orange-400 hover:text-orange-500 hover:shadow-sm transition-all no-underline focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <r.icon size={18} />
                  {r.nome}
                </a>
              ))}
            </div>
          </Accordion>
        </motion.div>

        {/* ── Coluna direita (Mapa) ── */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="sticky top-20">
            <iframe
              src={MAPA_URL}
              title="Localização da Turma do Bem no Google Maps"
              aria-label="Mapa mostrando a localização da Turma do Bem"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] border-none rounded-xl shadow-lg"
            />

            {/* Card de endereço abaixo do mapa */}
            <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-3 transition-shadow duration-300 hover:shadow-md">
              <MapPin size={20} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#333] dark:text-white m-0">{ENDERECO.rua}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 m-0 mt-1">
                  {ENDERECO.bairro}, {ENDERECO.cidade}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}