import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

interface LoginFormData {
  email?: string;
  senha?: string;
}

export function Login() {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormData>();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [mostrarRedefinicao, setMostrarRedefinicao] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [enviandoRedefinicao, setEnviandoRedefinicao] = useState(false);
  const navigate = useNavigate();

  const handleEsqueciSenha = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailDigitado = getValues("email");
    if (!emailDigitado) {
      setMensagem({ texto: "Digite seu e-mail no campo acima antes de redefinir a senha.", tipo: "erro" });
      return;
    }
    setMensagem({ texto: '', tipo: '' });
    setNovaSenha('');
    setConfirmarSenha('');
    setMostrarRedefinicao(prev => !prev);
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      setMensagem({ texto: "A senha deve ter no mínimo 6 caracteres.", tipo: "erro" });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: "As senhas não coincidem.", tipo: "erro" });
      return;
    }
    setEnviandoRedefinicao(true);
    try {
      const res = await fetch(`${API_URL}/pacientes/redefinir-senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: getValues("email"), novaSenha }),
      });
      if (res.ok) {
        setMensagem({ texto: "Senha redefinida com sucesso! Faça login com a nova senha.", tipo: "sucesso" });
        setMostrarRedefinicao(false);
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        const err = await res.json().catch(() => null);
        setMensagem({ texto: err?.erro || "Erro ao redefinir senha. Tente novamente.", tipo: "erro" });
      }
    } catch {
      setMensagem({ texto: "Erro ao conectar com o servidor.", tipo: "erro" });
    } finally {
      setEnviandoRedefinicao(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      });

      if (response.ok) {
        const usuario = await response.json();

        // Persiste dados de sessão — os dashboards leem esses valores via sessionStorage
        sessionStorage.setItem("userRole", usuario.tipo || 'paciente');
        sessionStorage.setItem("usuarioLogado", usuario.nome);
        sessionStorage.setItem("userId", String(usuario.id || ''));

        // dentistaCidade é lido pelo DentistaDashboard para filtrar a fila de triagem
        if (usuario.tipo === 'dentista' && usuario.cidade && usuario.cidade !== "N/A") {
          sessionStorage.setItem("dentistaCidade", usuario.cidade);
        }

        setMensagem({ texto: `Login aprovado! Bem-vindo(a).`, tipo: "sucesso" });

        // Redireciona pelo tipo de perfil após breve feedback visual
        setTimeout(() => {
          if (usuario.tipo === 'admin') {
            navigate('/dashboard/admin');
          } else if (usuario.tipo === 'dentista' || usuario.tipo === 'dev') {
            // 'dev' tem acesso ao dashboard de dentista (para testes)
            navigate('/dashboard/dentista');
          } else if (usuario.tipo === 'paciente') {
            navigate('/dashboard/paciente');
          } else {
            navigate('/');
          }
        }, 1500);

      } else {
        setMensagem({ texto: "Email ou senha incorretos.", tipo: "erro" });
      }
    } catch {
       setMensagem({ texto: "Erro ao conectar com o Servidor.", tipo: "erro" });
    }
  };
  
  return (
    <main className="bg-[#F5F5DC] min-h-screen flex justify-center items-center py-[120px] px-[20px]">
      <div className="bg-white w-full max-w-[500px] p-[30px] sm:p-[40px] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5">
        
        <div className="text-center mb-[30px]">
          <h2 className="text-[#333] text-[2rem] m-[0_0_10px_0] font-bold">Bem-vindo de volta!</h2>
          <p className="text-[#666] m-0 text-[0.95rem]">Faça login para acessar o painel da Turma do Bem.</p>
        </div>

        {mensagem.texto && (
          <div className={`p-[15px] rounded-[8px] mb-[20px] font-semibold text-center text-[0.95rem] ${mensagem.tipo === 'erro' ? 'bg-[#FFEFEF] text-[#D8000C] border border-[#FFD2D2]' : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-[20px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@email.com"
              className={`p-[14px_16px] border-[2px] ${errors.email ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
              {...register("email", { required: true })}
            />
            {errors.email && <span className="text-[#D8000C] text-xs mt-1 font-semibold">O E-mail é obrigatório.</span>}
          </div>
          
          <div className="flex flex-col mb-[20px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Senha</label>
            <input 
              type="password" 
              className={`p-[14px_16px] border-[2px] ${errors.senha ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
              {...register("senha", { required: true })}
            />
            {errors.senha && <span className="text-[#D8000C] text-xs mt-1 font-semibold">A senha é obrigatória.</span>}
          </div>

          <div className="text-right mt-[-10px] mb-[25px]">
            <a
              href="#"
              onClick={handleEsqueciSenha}
              className="text-[0.85rem] text-[#FF8C00] font-semibold no-underline hover:text-[#E67E22] hover:underline"
            >
              Esqueci minha senha
            </a>
          </div>

          {mostrarRedefinicao && (
            <div className="mb-5 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm font-bold text-gray-700 mb-3">Redefinir Senha</p>
              <form onSubmit={handleRedefinirSenha} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Nova Senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full p-[12px_14px] border-2 border-[#E0E0E0] rounded-[8px] text-[0.95rem] bg-white focus:outline-none focus:border-[#FF8C00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirme a Nova Senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full p-[12px_14px] border-2 border-[#E0E0E0] rounded-[8px] text-[0.95rem] bg-white focus:outline-none focus:border-[#FF8C00]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={enviandoRedefinicao}
                  className="w-full cursor-pointer bg-[#FF8C00] text-white font-bold py-3 rounded-xl hover:bg-[#E67E22] transition-colors disabled:opacity-60"
                >
                  {enviandoRedefinicao ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </form>
            </div>
          )}

          <button
            type="submit" 
            className="w-full cursor-pointer bg-[#FF8C00] text-white px-[45px] py-[16px] text-[1.1rem] font-bold rounded-[30px] uppercase tracking-[1px] shadow-md transition-all hover:bg-[#E67E22] hover:-translate-y-1"
          >
            Entrar
          </button>
        </form>

        <div className="mt-[25px] text-center border-t border-[#E0E0E0] pt-[20px] space-y-3">
          <p className="text-[#666] text-[0.95rem]">
            Não tem uma conta? <Link to="/cadastro" className="text-[#FF8C00] font-bold no-underline hover:underline">Cadastre-se agora</Link>
          </p>
          <p className="text-[#666] text-[0.95rem] bg-orange-50 py-2 rounded-lg border border-orange-100">
            Deseja apoiar a causa? <Link to="/doador" className="text-[#FF8C00] font-black no-underline hover:underline">Seja um Doador</Link>
          </p>
        </div>
      </div>
    </main>
  );
}