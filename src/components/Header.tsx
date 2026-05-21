import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const usuarioLogado = sessionStorage.getItem("usuarioLogado");
  const userRole = sessionStorage.getItem("userRole"); 
  
  const handleLogout = () => {
    sessionStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("dentistaCidade");
    setIsMenuOpen(false);
    navigate('/');
  };

  // Rota do botão "Dashboard" varia pelo tipo de usuário logado.
  // userRole vem do sessionStorage gravado no Login.tsx após autenticação bem-sucedida.
  let rotaDashboard = "/login"; // padrão: redireciona para login se não houver sessão
  if (userRole === "admin")    rotaDashboard = "/dashboard/admin";
  else if (userRole === "dentista") rotaDashboard = "/dashboard/dentista";
  else if (userRole === "paciente") rotaDashboard = "/dashboard/paciente";

  return (
    <>
      <header className="flex justify-between items-center px-[5%] h-[65px] fixed top-0 left-0 w-full box-border z-[1000] bg-black/20 backdrop-blur-[12px] border-b border-[#FF8C00]/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        
        <div className="flex-1 flex justify-start">
          <h1 className="m-0 font-[900] tracking-[-1px] leading-none" style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}>
            <Link to="/" className="text-[22px] md:text-[33px] whitespace-nowrap text-[#FF8C00] transition-transform duration-300 ease-in-out hover:-translate-y-[2px] flex items-center h-full">
              Turma do Bem
            </Link>
          </h1>
        </div>
        
        <nav className="hidden lg:flex justify-center items-center gap-[15px] xl:gap-[25px]">
          <Link to="/" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Início</Link>
          <Link to="/faq" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">FAQ</Link>
          <Link to="/quem-somos" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Quem Somos</Link>
          <Link to="/sobre" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Sobre</Link>
          <Link to="/reconhecimentos" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Reconhecimentos</Link>

          {userRole !== 'dev' ? (
            // Usuário normal: vai direto ao seu dashboard
            <Link to={rotaDashboard} className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Dashboard</Link>
          ) : (
            // Perfil 'dev': acesso rápido a todos os dashboards (modo de desenvolvimento)
            <div className="flex gap-[15px] border-l border-white/20 pl-[15px]">
              <Link to="/dashboard/admin"    className="text-[#FF8C00] font-[900] text-[16px] hover:text-white transition-colors duration-300">👑 Admin</Link>
              <Link to="/dashboard/dentista" className="text-[#FF8C00] font-[900] text-[16px] hover:text-white transition-colors duration-300">👑 Dentista</Link>
              <Link to="/dashboard/paciente" className="text-[#FF8C00] font-[900] text-[16px] hover:text-white transition-colors duration-300">👑 Paciente</Link>
            </div>
          )}
        </nav>

        <div className="flex-1 flex justify-end items-center gap-[12px] md:gap-[20px]">
          <Link to="/contato" className="hidden sm:block bg-[#FF8C00] text-white px-[15px] lg:px-[20px] py-[6px] rounded-[6px] font-bold text-[13px] lg:text-[14px] shadow-[0_4px_10px_rgba(255,140,0,0.3)] transition-all duration-300 hover:bg-[#E67E22] hover:-translate-y-[2px]">
            Contato
          </Link>
          <button onClick={() => setIsMenuOpen(true)} className="bg-transparent border-none text-[#FF8C00] cursor-pointer transition-transform duration-300 hover:scale-110 flex items-center justify-center p-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[26px] h-[26px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>
      </header>

      <div onClick={() => setIsMenuOpen(false)} className={`fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[1999] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}></div>

      <div className={`fixed top-0 w-[85%] max-w-[320px] h-screen bg-white z-[2000] shadow-[-5px_0_30px_rgba(0,0,0,0.15)] flex flex-col p-[30px_25px] transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isMenuOpen ? 'right-0' : 'right-[-100%]'}`}>
        <div className="flex justify-between items-center border-b-[2px] border-[#f0f0f0] pb-[15px] mb-[25px]">
          <h3 className="m-0 text-[#333] text-[1.2rem] font-bold">Minha Conta</h3>
          <button onClick={() => setIsMenuOpen(false)} className="bg-transparent border-none text-[1.5rem] text-[#888] hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="flex flex-col">
          {usuarioLogado ? (
            <>
              <p className="text-[#666] text-[0.95rem] mb-[25px]">
                Olá, <strong className="text-[#FF8C00] text-[1.1rem]">{usuarioLogado}</strong>!
              </p>

              {/* Modo dev: mostra todos os painéis no menu lateral (mesma lógica do header desktop) */}
              {userRole !== 'dev' ? (
                <Link to={rotaDashboard} onClick={() => setIsMenuOpen(false)} className="block text-center p-[15px] rounded-[8px] font-bold mb-[15px] bg-[#f5f5f5] text-[#333] border border-[#ddd]">
                  Meu Painel
                </Link>
              ) : (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl mb-4 space-y-2">
                  <p className="text-xs font-bold text-orange-500 uppercase text-center mb-2">Painéis de Teste</p>
                  <Link to="/dashboard/admin" onClick={() => setIsMenuOpen(false)} className="block text-center p-2 rounded-lg font-bold text-[#FF8C00] bg-white border border-orange-100 shadow-sm">👑 Admin</Link>
                  <Link to="/dashboard/dentista" onClick={() => setIsMenuOpen(false)} className="block text-center p-2 rounded-lg font-bold text-[#FF8C00] bg-white border border-orange-100 shadow-sm">👑 Dentista</Link>
                  <Link to="/dashboard/paciente" onClick={() => setIsMenuOpen(false)} className="block text-center p-2 rounded-lg font-bold text-[#FF8C00] bg-white border border-orange-100 shadow-sm">👑 Paciente</Link>
                </div>
              )}

              <button onClick={handleLogout} className="w-full text-center p-[15px] rounded-[8px] font-bold mb-[15px] bg-red-500 text-white border-none">
                Sair (Logout)
              </button>
            </>
          ) : (
            <>
              <p className="text-[#666] text-[0.95rem] mb-[25px]">Acesse o painel ou crie sua conta.</p>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center p-[15px] rounded-[8px] font-bold mb-[15px] bg-[#f5f5f5] text-[#333] border border-[#ddd]">Entrar</Link>
              <Link to="/cadastro" onClick={() => setIsMenuOpen(false)} className="block text-center p-[15px] rounded-[8px] font-bold mb-[15px] bg-[#FF8C00] text-white">Cadastrar Agora</Link>
            </>
          )}
        </div>

        <div className="mt-auto border-t border-[#f0f0f0] pt-[20px] flex flex-col gap-[15px] overflow-y-auto">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00]">Início</Link>
          <Link to="/sobre" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00]">Sobre o Projeto</Link>
          <Link to="/quem-somos" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00]">Quem Somos</Link>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00]">FAQ</Link>
        </div>
      </div>
    </>
  );
}