import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, QrCode, Copy, CheckCircle2, ArrowLeft, Smile, ShieldAlert, Syringe, Info, Receipt, ExternalLink } from 'lucide-react';

export function Doador() {
  const [pixCopiado, setPixCopiado] = useState(false);
  
  // Novos estados para controlar a seleção do usuário
  const [tipoDoacao, setTipoDoacao] = useState<'pontual' | 'mensal' | 'anual'>('mensal');
  const [valorDoacao, setValorDoacao] = useState<number | 'outro'>(150);
  const [valorPersonalizado, setValorPersonalizado] = useState<string>('');

  const handleCopiarPix = () => {
    navigator.clipboard.writeText("12.345.678/0001-99");
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  
  const getValorAtual = () => {
    if (valorDoacao === 'outro') {
      return Number(valorPersonalizado) || 0;
    }
    return valorDoacao;
  };

 
  const renderCardImpacto = () => {
    const valor = getValorAtual();

    if (valor >= 500) {
      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-orange-200 dark:border-orange-900/50 flex items-center gap-6 relative overflow-hidden animate-fade-in shadow-[0_4px_24px_rgba(255,140,0,0.10)] hover:shadow-[0_8px_32px_rgba(255,140,0,0.18)] transition-shadow duration-300">
          <div className="absolute top-0 right-0 bg-[#FF8C00] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Maior Impacto</div>
          <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-full text-[#FF8C00]"><ShieldAlert size={32} /></div>
          <div>
            <h3 className="font-black text-xl text-orange-600">Transformação Completa</h3>
            <p className="text-gray-600 dark:text-slate-300 font-medium mt-1">Seu apoio patrocina custos laboratoriais e radiográficos de tratamentos complexos (como canal e próteses).</p>
          </div>
        </div>
      );
    } else if (valor >= 150) {
      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-green-200 dark:border-green-900/50 flex items-center gap-6 animate-fade-in shadow-[0_4px_24px_rgba(34,197,94,0.10)] hover:shadow-[0_8px_32px_rgba(34,197,94,0.18)] transition-shadow duration-300">
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-full text-green-500"><Syringe size={32} /></div>
          <div>
            <h3 className="font-black text-xl text-green-600">Tratamento Clínico</h3>
            <p className="text-gray-600 dark:text-slate-300 font-medium mt-1">Custeia anestésicos, resinas e materiais descartáveis para uma ou mais consultas de restauração.</p>
          </div>
        </div>
      );
    } else if (valor > 0) {
      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-orange-200 dark:border-orange-900/50 flex items-center gap-6 animate-fade-in shadow-[0_4px_24px_rgba(255,140,0,0.08)] hover:shadow-[0_8px_32px_rgba(255,140,0,0.15)] transition-shadow duration-300">
          <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-full text-[#FF8C00]"><Smile size={32} /></div>
          <div>
            <h3 className="font-black text-xl text-[#FF8C00]">Prevenção e Higiene</h3>
            <p className="text-gray-600 dark:text-slate-300 font-medium mt-1">Garante Kits de Higiene Oral completos (escova, pasta, fio dental) para jovens na fila de triagem.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center gap-6 animate-fade-in">
        <div className="bg-gray-200 dark:bg-slate-700 p-4 rounded-full text-gray-500 dark:text-slate-400"><Info size={32} /></div>
        <div>
          <h3 className="font-bold text-lg text-gray-600 dark:text-slate-300">Apoie a Turma do Bem</h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-1">Informe um valor acima para ver o impacto que sua doação irá gerar na vida dos jovens.</p>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen font-sans pb-12 transition-colors duration-300 bg-[#F5F5DC] dark:bg-[#080c17]">

      <div className="bg-gradient-to-br from-[#FF8C00] via-[#F5820A] to-[#E06000] text-white pt-24 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-20 left-4">
          <Link to="/login" className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft size={18} /> Voltar
          </Link>
        </div>
        <Heart size={48} className="mx-auto mb-4 text-orange-200 fill-orange-200 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Seu apoio transforma futuros.</h1>
        <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto font-medium">
          Você está doando para a <strong>Turma do Bem</strong>.
        </p>
      </div>

      
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
              
              
              <div className="mb-8">
                <p className="text-center text-gray-500 dark:text-slate-400 mb-4 font-medium">Informe o tipo da sua doação</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={() => setTipoDoacao('pontual')}
                    className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${tipoDoacao === 'pontual' ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                  >
                    Pontual
                  </button>
                  <button 
                    onClick={() => setTipoDoacao('mensal')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${tipoDoacao === 'mensal' ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                  >
                    <Heart size={20} className={tipoDoacao === 'mensal' ? 'fill-[#00CED1]' : ''} /> Mensal
                  </button>
                  <button 
                    onClick={() => setTipoDoacao('anual')}
                    className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${tipoDoacao === 'anual' ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                  >
                    Anual
                  </button>
                </div>
              </div>

             
              <div>
                <p className="text-center text-gray-500 dark:text-slate-400 mb-4 font-medium">Informe o valor da sua doação</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[30, 150, 500].map((val) => (
                    <button 
                      key={val}
                      onClick={() => setValorDoacao(val)}
                      className={`py-3 rounded-lg text-lg font-medium transition-all duration-200 ${valorDoacao === val ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                    >
                      R$ {val}
                    </button>
                  ))}
                  
                  
                  {valorDoacao === 'outro' ? (
                    <div className="col-span-2 md:col-span-3 relative animate-fade-in">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00CED1] font-medium text-lg">R$</span>
                      <input 
                        type="number" 
                        autoFocus
                        placeholder="0,00"
                        value={valorPersonalizado}
                        onChange={(e) => setValorPersonalizado(e.target.value)}
                        className="w-full py-3 pl-12 pr-4 rounded-lg border-2 border-[#00CED1] text-[#00CED1] text-lg font-medium shadow-[0_0_15px_rgba(0,206,209,0.2)] outline-none"
                      />
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setValorDoacao('outro');
                        setValorPersonalizado('');
                      }}
                      className="col-span-2 md:col-span-3 py-3 rounded-lg text-lg font-medium border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-[#00CED1] hover:text-[#00CED1] dark:hover:border-cyan-500 dark:hover:text-cyan-400 transition-all duration-200"
                    >
                      Outro valor
                    </button>
                  )}
                </div>
              </div>

            </div>

            
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 px-2">O impacto da sua doação:</h2>
              {renderCardImpacto()}
            </div>

          </div>

          
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 text-center sticky top-8 shadow-[0_8px_40px_rgba(0,0,0,0.07)]">
              <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-950/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-cyan-100 dark:border-cyan-900/40">
                <QrCode size={32} className="text-[#00CED1]" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">
                Doar R$ {getValorAtual() > 0 ? getValorAtual() : '0'}
              </h2>
              <p className="text-[#FF8C00] font-bold text-sm uppercase tracking-wider mb-6">
                Via PIX {tipoDoacao}
              </p>
              
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Abra o app do seu banco e escaneie o código ou copie a chave CNPJ abaixo.</p>
              
              
              <div className="w-48 h-48 bg-white dark:bg-slate-700/40 border-2 border-dashed border-gray-200 dark:border-slate-600 mx-auto rounded-xl flex items-center justify-center mb-8 relative group cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                 <QrCode size={80} className="text-gray-300 group-hover:text-[#00CED1] transition-colors" />
                 <p className="absolute bottom-2 text-[10px] font-bold text-gray-400 uppercase">QR Code Ilustrativo</p>
              </div>

              <div className="bg-white dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-between gap-3 mb-6">
                 <div className="text-left overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Chave PIX (CNPJ)</p>
                    <p className="font-mono text-gray-800 dark:text-slate-100 font-bold truncate">12.345.678/0001-99</p>
                 </div>
                 <button 
                    onClick={handleCopiarPix}
                    className={`p-3 rounded-lg flex-shrink-0 transition-all ${pixCopiado ? 'bg-green-100 text-green-600' : 'bg-[#00CED1] text-white hover:bg-cyan-500 shadow-md'}`}
                 >
                    {pixCopiado ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                 </button>
              </div>

              {pixCopiado && (
                <p className="text-green-600 text-sm font-bold animate-fade-in mb-4">Chave copiada com sucesso!</p>
              )}

              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Turma do Bem - OSCIP<br/>Instituição sem fins lucrativos.</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Nota Fiscal Paulista ── */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-12">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-slate-800 dark:to-slate-800 rounded-3xl border border-orange-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-orange-100 dark:bg-orange-950/40 p-5 rounded-2xl flex-shrink-0 self-start">
              <Receipt size={36} className="text-[#FF8C00]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-[#FF8C00] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Sem custo para você
              </div>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Nota Fiscal Paulista</h3>
              <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                Se você mora em São Paulo e solicita CPF nas notas fiscais, pode direcionar seus créditos de ICMS diretamente para a Turma do Bem — sem nenhum custo para você. É uma forma de apoiar a causa simplesmente consumindo no dia a dia.
              </p>
              <ol className="space-y-3 mb-7" role="list">
                {[
                  'Solicite o CPF na nota em estabelecimentos participantes do programa em São Paulo',
                  'Acesse o portal oficial da Nota Fiscal Paulista (nfp.fazenda.sp.gov.br) e faça login com seu CPF',
                  'No menu, clique em "Doação de Créditos" e pesquise pela Turma do Bem (CNPJ 12.345.678/0001-99)',
                  'Selecione o percentual que deseja destinar — pode ser de 1% a 100% dos seus créditos acumulados',
                ].map((passo, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm">
                    <span className="bg-[#FF8C00] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5" aria-hidden="true">{i + 1}</span>
                    {passo}
                  </li>
                ))}
              </ol>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.nfp.fazenda.sp.gov.br"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF8C00] hover:bg-[#E67E22] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-orange-200/60"
                  aria-label="Acessar portal da Nota Fiscal Paulista (abre em nova aba)"
                >
                  Acessar Portal NFP <ExternalLink size={16} aria-hidden="true" />
                </a>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium self-center">
                  Programa gerenciado pela Secretaria da Fazenda do Estado de São Paulo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}