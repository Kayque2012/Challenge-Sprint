import { useState, useEffect } from 'react';
import { useCep } from '../hooks/useCep';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { DADOS_PAISES } from '../data/estadosCidades';
import { API_URL } from '../config';
import {
  Cloud, User, Stethoscope, Eye, EyeOff, Mail, Lock,
  MapPin, Globe, CheckCircle2, AlertCircle, ArrowRight,
  Shield, Users, Smile,
} from 'lucide-react';

interface CadastroFormData {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  documento?: string;
  pais?: string;
  confirma?: string;
  cep?: string;
}

export function Cadastro() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CadastroFormData>();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);
  const navigate = useNavigate();

  const senha = watch('senha') ?? '';
  const tipoPerfil = watch('tipo');
  const paisSelecionado = watch('pais');
  const cepValue = watch('cep') ?? '';

  const { dados: cepDados, loading: cepLoading, erro: cepErro } = useCep(cepValue);

  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidadeInput, setCidadeInput] = useState('');
  const [cidadeValida, setCidadeValida] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  useEffect(() => {
    if (!cepDados) return;
    setEstadoSelecionado(cepDados.uf);
    setCidadeValida(cepDados.localidade);
    setCidadeInput('');
  }, [cepDados]);

  const dadosPais = paisSelecionado ? DADOS_PAISES[paisSelecionado] : null;
  const estadosPais = dadosPais?.estados || [];
  const cidadesEstado = estadoSelecionado ? (dadosPais?.cidades[estadoSelecionado] || []) : [];
  const cidadesFiltradas = cidadesEstado.filter(c =>
    c.toLowerCase().includes(cidadeInput.toLowerCase())
  );

  // Força de senha
  const getSenhaStrength = (s: string) => {
    if (!s) return { level: 0, label: '', colorBar: '', colorText: '' };
    let score = 0;
    if (s.length >= 6) score++;
    if (s.length >= 10) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    if (score <= 1) return { level: 1, label: 'Fraca', colorBar: 'bg-red-500', colorText: 'text-red-500' };
    if (score <= 2) return { level: 2, label: 'Razoável', colorBar: 'bg-yellow-500', colorText: 'text-yellow-600' };
    if (score <= 3) return { level: 3, label: 'Boa', colorBar: 'bg-blue-500', colorText: 'text-blue-600' };
    return { level: 4, label: 'Forte', colorBar: 'bg-green-500', colorText: 'text-green-600' };
  };
  const senhaStrength = getSenhaStrength(senha);

  // Formata CEP
  const handleCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setValue('cep', formatted);
  };

  // Formata CPF
  const handleCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setValue('documento', value, { shouldValidate: true });
  };

  // Formata CRO
  const handleCRO = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    const numeros = value.replace(/[^0-9]/g, '');
    const letras = value.replace(/[0-9]/g, '');
    value = letras.length > 0 ? numeros + '-' + letras.slice(0, 2) : numeros;
    setValue('documento', value, { shouldValidate: true });
  };

  const onSubmit = async (data: CadastroFormData) => {
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
      const url = data.tipo === 'paciente' ? `${API_URL}/pacientes` : `${API_URL}/dentistas`;
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

  const inputBase =
    'w-full rounded-xl border-2 bg-gray-50 dark:bg-slate-700 px-4 py-3 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-600 transition-all';
  const inputClass = (hasError: boolean) =>
    `${inputBase} ${hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#FF8C00]'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-start justify-center pt-16 pb-10 px-4 font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-orange-100/60 dark:shadow-slate-900/50 overflow-hidden flex my-6">

        {/* ── Painel esquerdo — branding (desktop only) ── */}
        <div className="hidden lg:flex flex-col justify-between w-[360px] flex-shrink-0 bg-gradient-to-br from-[#FF8C00] to-orange-600 text-white p-10">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <Cloud size={22} className="text-white" />
              <span className="font-black text-xl tracking-tight">Dentista na Nuvem</span>
            </div>
            <h2 className="text-3xl font-black leading-snug mb-4">
              Junte-se a nós e transforme sorrisos
            </h2>
            <p className="text-orange-100 text-sm leading-relaxed">
              Cadastre-se gratuitamente e faça parte de uma comunidade que já transformou mais de 2.400 vidas.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <Smile size={17} />, text: '2.400+ beneficiários atendidos' },
              { icon: <Stethoscope size={17} />, text: '180+ dentistas voluntários' },
              { icon: <Shield size={17} />, text: 'Dados protegidos e seguros' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-orange-50">{item.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-orange-200 mt-8">
            Já tem conta?{' '}
            <Link to="/login" className="text-white font-bold underline underline-offset-2">Faça login</Link>
          </p>
        </div>

        {/* ── Painel direito — formulário ── */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Crie sua conta</h1>
            <p className="text-gray-400 dark:text-slate-400 text-sm">Preencha os campos abaixo para se cadastrar.</p>
          </div>

          {/* Feedback */}
          {mensagem.texto && (
            <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-semibold border ${
              mensagem.tipo === 'sucesso'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {mensagem.tipo === 'sucesso'
                ? <CheckCircle2 size={18} className="flex-shrink-0" />
                : <AlertCircle size={18} className="flex-shrink-0" />}
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Nome */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nome Completo</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  className={`${inputClass(!!errors.nome)} pl-10`}
                  {...register('nome', { required: 'Nome obrigatório' })}
                />
              </div>
              {errors.nome && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.nome.message}</p>}
            </div>

            {/* Seletor de perfil — cards */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Eu sou...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'paciente', label: 'Beneficiário', sub: 'Preciso de atendimento', icon: <Users size={20} /> },
                  { value: 'dentista', label: 'Dentista', sub: 'Quero ser voluntário', icon: <Stethoscope size={20} /> },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setValue('tipo', opt.value, { shouldValidate: true });
                      setValue('documento', '');
                    }}
                    className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all ${
                      tipoPerfil === opt.value
                        ? 'border-[#FF8C00] bg-orange-50 dark:bg-orange-950/30 shadow-sm shadow-orange-100'
                        : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-orange-200 dark:hover:border-orange-700/60 hover:bg-orange-50/40 dark:hover:bg-orange-950/20'
                    }`}
                  >
                    <span className={tipoPerfil === opt.value ? 'text-[#FF8C00]' : 'text-gray-400 dark:text-slate-400'}>
                      {opt.icon}
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white leading-none">{opt.label}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-400 leading-tight">{opt.sub}</span>
                  </button>
                ))}
              </div>
              {/* campo oculto para react-hook-form rastrear o valor */}
              <input type="hidden" {...register('tipo', { required: 'Selecione o perfil' })} />
              {errors.tipo && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.tipo.message}</p>}
            </div>

            {/* Documento — aparece após selecionar perfil */}
            {tipoPerfil === 'paciente' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">CPF</label>
                <input
                  type="text"
                  placeholder="123.456.789-00"
                  className={inputClass(!!errors.documento)}
                  {...register('documento', {
                    required: 'CPF obrigatório',
                    pattern: { value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'CPF incompleto' },
                    onChange: handleCPF,
                  })}
                />
                {errors.documento && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.documento.message}</p>}
              </div>
            )}

            {tipoPerfil === 'dentista' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">CRO</label>
                <input
                  type="text"
                  placeholder="12345-SP"
                  className={inputClass(!!errors.documento)}
                  {...register('documento', {
                    required: 'CRO obrigatório',
                    pattern: { value: /^\d{4,6}-[A-Z]{2}$/, message: 'Formato: 1234-UF ou 123456-UF' },
                    onChange: handleCRO,
                  })}
                />
                {errors.documento && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.documento.message}</p>}
              </div>
            )}

            {/* Localização — agrupada em card cinza */}
            {tipoPerfil && (
              <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-700/40 p-4 space-y-4">
                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} /> Localização
                </p>

                {/* País + Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5">País</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        className={`${inputClass(!!errors.pais)} pl-9`}
                        {...register('pais', { required: 'Selecione o país' })}
                        onChange={(e) => {
                          setValue('pais', e.target.value);
                          setEstadoSelecionado('');
                          setCidadeInput('');
                          setCidadeValida('');
                        }}
                      >
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
                    </div>
                    {errors.pais && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.pais.message}</p>}
                  </div>

                  {dadosPais && estadosPais.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5">Estado / Província</label>
                      <select
                        className="w-full rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-4 py-3 text-sm text-gray-800 dark:text-slate-100 focus:outline-none focus:border-[#FF8C00] focus:bg-white dark:focus:bg-slate-600 transition-all"
                        value={estadoSelecionado}
                        onChange={(e) => {
                          setEstadoSelecionado(e.target.value);
                          setCidadeInput('');
                          setCidadeValida('');
                        }}
                      >
                        <option value="">Selecione...</option>
                        {estadosPais.map(e => (
                          <option key={e.sigla} value={e.sigla}>{e.nome}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* CEP — apenas Brasil */}
                {paisSelecionado === 'Brasil' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5">
                      CEP{' '}
                      <span className="text-gray-400 font-normal">(preenchimento automático)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      className={inputClass(!!cepErro)}
                      {...register('cep', { onChange: handleCep })}
                    />
                    {cepLoading && (
                      <p className="text-xs text-gray-400 mt-1 animate-pulse">Buscando endereço...</p>
                    )}
                    {cepErro && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{cepErro}</p>
                    )}
                    {cepDados && !cepLoading && (
                      <p className="text-xs text-[#FF8C00] font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {cepDados.logradouro}{cepDados.bairro ? `, ${cepDados.bairro}` : ''}
                      </p>
                    )}
                  </div>
                )}

                {/* Cidade */}
                {dadosPais && estadoSelecionado && (
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5">
                      Cidade
                      {cidadeValida && (
                        <span className="ml-2 text-[#FF8C00] font-semibold normal-case">
                          ✓ {cidadeValida}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="Digite para buscar sua cidade..."
                      className={`w-full rounded-xl border-2 ${
                        cidadeValida ? 'border-[#FF8C00] bg-orange-50/40 dark:bg-orange-950/20' : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700'
                      } px-4 py-3 pr-10 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-[#FF8C00] focus:bg-white dark:focus:bg-slate-600 transition-all`}
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
                      <button
                        type="button"
                        onClick={() => { setCidadeValida(''); setCidadeInput(''); }}
                        className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-700 text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                    {mostrarDropdown && cidadeInput && !cidadeValida && cidadesFiltradas.length > 0 && (
                      <ul className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg mt-1 max-h-[180px] overflow-y-auto">
                        {cidadesFiltradas.map(cidade => (
                          <li
                            key={cidade}
                            className="px-4 py-2.5 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF8C00] dark:text-slate-200 font-medium text-sm border-b border-gray-50 dark:border-slate-700 last:border-0"
                            onMouseDown={() => {
                              setCidadeValida(cidade);
                              setCidadeInput('');
                              setMostrarDropdown(false);
                            }}
                          >
                            {cidade}
                          </li>
                        ))}
                      </ul>
                    )}
                    {mostrarDropdown && cidadeInput && !cidadeValida && cidadesFiltradas.length === 0 && (
                      <div className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg mt-1 px-4 py-3 text-sm text-gray-500 dark:text-slate-400">
                        Nenhuma cidade encontrada para "{cidadeInput}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* E-mail */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  className={`${inputClass(!!errors.email)} pl-10`}
                  {...register('email', {
                    required: 'E-mail obrigatório',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Senhas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Senha</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Mínimo 6 dígitos"
                    className={`${inputClass(!!errors.senha)} pl-10 pr-10`}
                    {...register('senha', {
                      required: 'Senha obrigatória',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Força da senha */}
                {senha.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(n => (
                        <div
                          key={n}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            n <= senhaStrength.level ? senhaStrength.colorBar : 'bg-gray-200 dark:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${senhaStrength.colorText}`}>
                      Senha {senhaStrength.label}
                    </p>
                  </div>
                )}
                {errors.senha && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.senha.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Confirmar Senha</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={mostrarConfirma ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    className={`${inputClass(!!errors.confirma)} pl-10 pr-10`}
                    {...register('confirma', {
                      required: 'Confirme a senha',
                      validate: value => value === senha || 'As senhas não coincidem',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirma(!mostrarConfirma)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {mostrarConfirma ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirma && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.confirma.message}</p>}
              </div>
            </div>

            {/* Botão submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FF8C00] hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 mt-2"
            >
              Concluir Registro
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-slate-400">
            <p>
              Já tem conta?{' '}
              <Link to="/login" className="text-[#FF8C00] font-bold hover:underline">Faça login</Link>
            </p>
            <p>
              Quer apoiar?{' '}
              <Link to="/doador" className="text-[#FF8C00] font-bold hover:underline">Seja um Doador</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
