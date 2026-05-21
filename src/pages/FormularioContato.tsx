import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, User, Mail, HelpCircle, MessageSquare } from 'lucide-react';
import { API_URL } from '../config';

interface ContatoFormData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export function FormularioContato() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<ContatoFormData>({
    defaultValues: {
      assunto: ''
    }
  });

  const onSubmit = async (data: ContatoFormData) => {
    setIsLoading(true);
    setErro('');
    try {
      const response = await fetch(`${API_URL}/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao enviar');
      navigate('/contato');
    } catch {
      setErro('Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] flex justify-center items-center py-[120px] px-4 font-sans">
      
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">
        
        {/* BOTÃO DE VOLTAR - Modernizado */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/contato" 
            className="text-gray-500 hover:text-[#FF8C00] bg-white/80 hover:bg-orange-50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-200 no-underline shadow-sm border border-gray-100"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>

        {/* CABEÇALHO */}
        <div className="bg-gray-50/50 pt-16 pb-8 px-8 text-center border-b border-gray-100">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Fale Conosco</h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-md mx-auto">
            Tem alguma dúvida, quer ser doador ou falar com a ONG? Preencha os campos abaixo e entraremos em contacto.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva"
                  {...register("nome", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.nome && <span className="text-red-500 text-xs mt-1.5 block font-medium">Nome é obrigatório</span>}
            </div>

            {/* E-mail */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">E-mail de Contato</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="exemplo@email.com"
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.email && <span className="text-red-500 text-xs mt-1.5 block font-medium">E-mail inválido</span>}
            </div>

            {/* Assunto */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Assunto</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <HelpCircle size={18} className="text-orange-500" />
                </div>
                <select 
                  {...register("assunto", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 appearance-none cursor-pointer font-medium"
                >
                  <option value="" disabled>Selecione o motivo do contato...</option>
                  <option value="Dúvida Geral">Dúvida Geral</option>
                  <option value="Quero ser Doador">Quero ser Doador</option>
                  <option value="Imprensa">ONG / Comunicação</option>
                  <option value="Parcerias">Parcerias com Clínicas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              {errors.assunto && <span className="text-red-500 text-xs mt-1.5 block font-medium">Assunto é obrigatório</span>}
            </div>

            {/* Mensagem */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">A sua Mensagem</label>
              <div className="relative group">
                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                  <MessageSquare size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <textarea 
                  rows={5}
                  placeholder="Escreva aqui a sua mensagem..."
                  {...register("mensagem", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 resize-none leading-relaxed"
                />
              </div>
              {errors.mensagem && <span className="text-red-500 text-xs mt-1.5 block font-medium">A mensagem não pode estar vazia</span>}
            </div>

          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            {erro && (
              <p className="text-red-600 text-sm font-semibold text-center mb-4 bg-red-50 border border-red-200 rounded-xl py-2 px-4">{erro}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF8C00] to-[#f39c12] text-white font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_25px_rgba(255,140,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Send size={20} />
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}