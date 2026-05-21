import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { DADOS_PAISES } from '../data/estadosCidades';
import { API_URL } from '../config';

interface CadastroFormData {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  documento?: string;
  pais?: string;
  confirma?: string;
}

export function Cadastro() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CadastroFormData>();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  const senha = watch('senha');
  const tipoPerfil = watch('tipo');
  const paisSelecionado = watch('pais');

  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidadeInput, setCidadeInput] = useState('');
  const [cidadeValida, setCidadeValida] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const dadosPais = paisSelecionado ? DADOS_PAISES[paisSelecionado] : null;
  const estadosPais = dadosPais?.estados || [];
  const cidadesEstado = estadoSelecionado ? (dadosPais?.cidades[estadoSelecionado] || []) : [];
  const cidadesFiltradas = cidadesEstado.filter(c =>
    c.toLowerCase().includes(cidadeInput.toLowerCase())
  );

  // Formata CPF em tempo real: 000.000.000-00
  const handleCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');          // remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11);      // limite de 11 dígitos
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setValue('documento', value, { shouldValidate: true });
  };

  // Formata CRO em tempo real: 1234-SP (dígitos + hífen + UF)
  const handleCRO = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // só letras e números
    if (value.length > 8) value = value.slice(0, 8);
    const numeros = value.replace(/[^0-9]/g, '');
    const letras = value.replace(/[0-9]/g, '');
    value = letras.length > 0 ? numeros + '-' + letras.slice(0, 2) : numeros;
    setValue('documento', value, { shouldValidate: true });
  };

  const onSubmit = async (data: CadastroFormData) => {
    // Valida seleção de estado quando o país tem estados cadastrados
    if (dadosPais && estadosPais.length > 0 && !estadoSelecionado) {
      setMensagem({ texto: 'Selecione o estado antes de escolher a cidade.', tipo: 'erro' });
      return;
    }
    if (dadosPais && !cidadeValida) {
      setMensagem({ texto: 'Selecione uma cidade da lista.', tipo: 'erro' });
      return;
    }
    const cidadeFinal = cidadeValida || cidadeInput;
    setMensagem({ texto: 'Processando registro...', tipo: 'sucesso' });
    try {
      const url = data.tipo === 'paciente'
        ? `${API_URL}/pacientes`
        : `${API_URL}/dentistas`;

      const nomeEstado = estadosPais.find(e => e.sigla === estadoSelecionado)?.nome || estadoSelecionado;
      const payload = data.tipo === 'paciente' ? {
        nome: data.nome, email: data.email, senha: data.senha,
        cpf: data.documento, tipo: data.tipo,
        pais: data.pais, cidade: cidadeFinal, estado: nomeEstado,
      } : {
        nome: data.nome, email: data.email, senha: data.senha,
        cro: data.documento, tipo: data.tipo,
        pais: data.pais, cidade: cidadeFinal, estado: nomeEstado,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMensagem({ texto: 'Registro concluído com sucesso! Redirecionando...', tipo: 'sucesso' });
        setTimeout(() => navigate('/login'), 2500);
      } else {
        const errorData = await response.json().catch(() => null);
        setMensagem({ texto: errorData?.erro || 'Erro ao realizar o registro. Verifique os dados.', tipo: 'erro' });
      }
    } catch {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
    }
  };

  const inputClass = (hasError: boolean) =>
    `p-[14px_16px] border-[2px] ${hasError ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5DC] p-[20px] pt-[85px] font-sans">
      <div className="bg-white p-[40px] rounded-[20px] shadow-lg max-w-[600px] w-full relative">
        <div className="text-center mb-[30px]">
          <h2 className="text-[2rem] text-[#FF8C00] font-black tracking-[1px] mb-[10px]">Crie sua Conta</h2>
          <p className="text-[#666] text-[1rem]">Junte-se à Turma do Bem!</p>
        </div>

        {mensagem.texto && (
          <div className={`p-[15px] mb-[20px] rounded-[8px] font-bold text-center ${mensagem.tipo === 'sucesso' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nome */}
          <div className="flex flex-col mb-[15px]">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Nome Completo</label>
            <input type="text" placeholder="Ex: João da Silva"
              className={inputClass(!!errors.nome)}
              {...register('nome', { required: 'O nome é obrigatório' })} />
            {errors.nome && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.nome.message}</span>}
          </div>

          {/* Tipo + Documento */}
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px] mb-[15px]">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Eu sou...</label>
              <select className={inputClass(!!errors.tipo)}
                {...register('tipo', { required: 'Selecione o perfil' })}>
                <option value="">Selecione...</option>
                <option value="paciente">Beneficiário (Paciente)</option>
                <option value="dentista">Dentista Voluntário</option>
              </select>
              {errors.tipo && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.tipo.message}</span>}
            </div>

            {tipoPerfil === 'paciente' && (
              <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0">
                <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CPF</label>
                <input type="text" placeholder="123.456.789-00"
                  className={inputClass(!!errors.documento)}
                  {...register('documento', {
                    required: 'O CPF é obrigatório',
                    pattern: { value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'CPF incompleto' },
                    onChange: handleCPF,
                  })} />
                {errors.documento && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.documento.message}</span>}
              </div>
            )}

            {tipoPerfil === 'dentista' && (
              <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0">
                <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CRO</label>
                <input type="text" placeholder="12345-SP"
                  className={inputClass(!!errors.documento)}
                  {...register('documento', {
                    required: 'O CRO é obrigatório',
                    pattern: { value: /^\d{4,6}-[A-Z]{2}$/, message: 'Formato: 1234-UF ou 123456-UF' },
                    onChange: handleCRO,
                  })} />
                {errors.documento && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.documento.message}</span>}
              </div>
            )}
          </div>

          {/* País + Estado/Cidade */}
          {tipoPerfil && (
            <div className="flex flex-col gap-[15px] mb-[15px]">
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px]">
                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">País</label>
                  <select className={inputClass(!!errors.pais)}
                    {...register('pais', { required: 'Selecione o país' })}
                    onChange={(e) => {
                      setValue('pais', e.target.value);
                      setEstadoSelecionado('');
                      setCidadeInput('');
                      setCidadeValida('');
                    }}>
                    <option value="">Selecione...</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Bolívia">Bolívia</option>
                    <option value="Chile">Chile</option>
                    <option value="Colômbia">Colômbia</option>
                    <option value="Equador">Equador</option>
                    <option value="México">México</option>
                    <option value="Panamá">Panamá</option>
                    <option value="Paraguai">Paraguai</option>
                    <option value="Peru">Peru</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Uruguai">Uruguai</option>
                    <option value="Venezuela">Venezuela</option>
                  </select>
                  {errors.pais && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.pais.message}</span>}
                </div>

                {dadosPais && estadosPais.length > 0 ? (
                  <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0">
                    <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Estado / Província</label>
                    <select
                      className="p-[14px_16px] border-[2px] border-[#E0E0E0] rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]"
                      value={estadoSelecionado}
                      onChange={(e) => {
                        setEstadoSelecionado(e.target.value);
                        setCidadeInput('');
                        setCidadeValida('');
                      }}>
                      <option value="">Selecione...</option>
                      {estadosPais.map(e => (
                        <option key={e.sigla} value={e.sigla}>{e.nome}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>

              {/* Busca de cidade — aparece após selecionar o estado (todos os países) */}
              {dadosPais && estadoSelecionado && (
                <div className="relative">
                  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px] block">
                    Cidade
                    {cidadeValida && <span className="ml-2 text-[#FF8C00] font-semibold normal-case">✓ {cidadeValida}</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="Digite para buscar sua cidade..."
                    className={`w-full p-[14px_16px] pr-10 border-[2px] ${cidadeValida ? 'border-[#FF8C00] bg-orange-50/30' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                    value={cidadeValida || cidadeInput}
                    onChange={(e) => {
                      setCidadeValida('');
                      setCidadeInput(e.target.value);
                      setMostrarDropdown(true);
                    }}
                    onFocus={() => setMostrarDropdown(true)}
                    onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
                    autoComplete="off"
                  />
                  {cidadeValida && (
                    <button type="button" onClick={() => { setCidadeValida(''); setCidadeInput(''); }}
                      className="absolute right-3 top-[46px] text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
                  )}
                  {mostrarDropdown && cidadeInput && !cidadeValida && cidadesFiltradas.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-[#E0E0E0] rounded-[8px] shadow-lg mt-1 max-h-[200px] overflow-y-auto">
                      {cidadesFiltradas.map(cidade => (
                        <li key={cidade}
                          className="px-4 py-3 cursor-pointer hover:bg-orange-50 hover:text-[#FF8C00] font-medium text-sm border-b border-gray-50 last:border-0"
                          onMouseDown={() => {
                            setCidadeValida(cidade);
                            setCidadeInput('');
                            setMostrarDropdown(false);
                          }}>
                          {cidade}
                        </li>
                      ))}
                    </ul>
                  )}
                  {mostrarDropdown && cidadeInput && !cidadeValida && cidadesFiltradas.length === 0 && (
                    <div className="absolute z-50 w-full bg-white border border-[#E0E0E0] rounded-[8px] shadow-lg mt-1 px-4 py-3 text-sm text-gray-500">
                      Nenhuma cidade encontrada para "{cidadeInput}". Verifique a grafia.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col mb-[15px]">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">E-mail</label>
            <input type="email" placeholder="exemplo@email.com"
              className={inputClass(!!errors.email)}
              {...register('email', {
                required: 'O E-mail é obrigatório',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
              })} />
            {errors.email && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.email.message}</span>}
          </div>

          {/* Senhas */}
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px] mb-[25px]">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Senha</label>
              <input type="password" placeholder="Mínimo 6 dígitos"
                className={inputClass(!!errors.senha)}
                {...register('senha', {
                  required: 'Senha obrigatória',
                  minLength: { value: 6, message: 'No mínimo 6 caracteres' },
                })} />
              {errors.senha && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.senha.message}</span>}
            </div>
            <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Confirmar Senha</label>
              <input type="password" placeholder="Repita a senha"
                className={inputClass(!!errors.confirma)}
                {...register('confirma', {
                  required: 'Confirme a senha',
                  validate: value => value === senha || 'As senhas não coincidem',
                })} />
              {errors.confirma && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.confirma.message}</span>}
            </div>
          </div>

          <button type="submit"
            className="w-full mt-[10px] cursor-pointer bg-[#FF8C00] text-white px-[45px] py-[16px] text-[1.1rem] font-bold rounded-[30px] uppercase tracking-[1px] shadow-md transition-all hover:bg-[#E67E22] hover:-translate-y-1">
            Concluir Registro
          </button>
        </form>

        <div className="mt-[25px] text-center border-t border-[#E0E0E0] pt-[20px] flex flex-col gap-3">
          <p className="text-[#666] text-[0.95rem]">
            Já tem uma conta? <Link to="/login" className="text-[#FF8C00] font-bold no-underline hover:underline">Faça login</Link>
          </p>
          <p className="text-[#666] text-[0.95rem] bg-orange-50 py-2 rounded-lg border border-orange-100">
            Deseja apoiar a causa? <Link to="/doador" className="text-[#FF8C00] font-black no-underline hover:underline">Seja um Doador</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
