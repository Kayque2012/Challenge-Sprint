import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#0B090B] pt-[60px] px-[5%] pb-[20px] relative text-white font-sans mt-auto w-full box-border">
      
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFAF00] via-30% via-[#F5D45A] via-50% via-[#FFAF00] via-70% to-transparent opacity-60"></div>

      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[40px]">
        
        {/* 1. Coluna: Turma do Bem */}
        <div className="flex flex-col items-start">
          <h3 className="text-[#FFAF00] text-[1.3rem] mt-0 mb-[15px] font-bold">
            Turma do Bem
          </h3>
          <p className="text-white/60 leading-[1.6] text-[0.9rem] m-0">
            Otimizando o atendimento e transformando vidas através da odontologia voluntária.
          </p>
          
          {/* Novo Link: Seja um doador */}
          <Link 
            to="/doador" 
            className="mt-[20px] text-[#FFAF00] text-[0.95rem] font-bold tracking-[0.5px] transition-colors hover:text-[#F5D45A] hover:underline"
          >
            Seja um doador &#8594;
          </Link>
        </div>

        {/* 2. Coluna: Navegação */}
        <div className="flex flex-col items-start">
          <h4 className="text-white text-[1.1rem] mt-0 mb-[20px] uppercase tracking-[1px] font-bold">Navegação</h4>
          <ul className="flex flex-col gap-[12px] p-0 m-0 list-none text-left">
            <li><Link to="/" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Início</Link></li>
            <li><Link to="/sobre" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Sobre o Projeto</Link></li>
            <li><Link to="/quem-somos" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Quem Somos</Link></li>
            <li><Link to="/faq" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Perguntas Frequentes (FAQ)</Link></li>
            <li><Link to="/reconhecimentos" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Reconhecimentos</Link></li>
            <li><Link to="/cadastro" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Cadastro</Link></li>
            <li><Link to="/contato" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Contato</Link></li>
            <li><Link to="/login" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Login</Link></li>
          </ul>
        </div>

        {/* 3. Coluna: Legal */}
        <div className="flex flex-col items-start">
          <h4 className="text-white text-[1.1rem] mt-0 mb-[20px] uppercase tracking-[1px] font-bold">Legal</h4>
          <ul className="flex flex-col gap-[12px] p-0 m-0 list-none text-left">
            <li><a href="#" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Termos de Uso</a></li>
            <li><a href="#" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Política de Privacidade</a></li>
          </ul>
        </div>

        {/* 4. Coluna: Redes Sociais */}
        <div className="flex flex-col items-start">
          <h4 className="text-white text-[1.1rem] mt-0 mb-[20px] uppercase tracking-[1px] font-bold">Redes Sociais</h4>
          <ul className="flex flex-col gap-[12px] p-0 m-0 list-none text-left">
            <li><a href="https://www.instagram.com/ongturmadobem/" target="_blank" rel="noreferrer" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Instagram</a></li>
            <li><a href="https://turmadobem.org.br/" target="_blank" rel="noreferrer" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Site Oficial</a></li>
            <li><a href="https://br.linkedin.com/company/turma-do-bem" target="_blank" rel="noreferrer" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">LinkedIn</a></li>
            <li><a href="https://www.facebook.com/turmadobem/" target="_blank" rel="noreferrer" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Facebook</a></li>
            <li><a href="https://www.atados.com.br/ong/turma-do-bem-1" target="_blank" rel="noreferrer" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#FFAF00]">Atados</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/10 pt-[20px] text-center text-white/40 text-[0.85rem]">
        <p className="m-0">&copy; 2026 Challenge Turma do Bem - FIAP. Projeto acadêmico sem fins lucrativos.</p>
      </div>
    </footer>
  );
}