import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, QrCode, Copy, CheckCircle2, ArrowLeft, Smile, ShieldAlert, Syringe, Info } from 'lucide-react';

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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 flex items-center gap-6 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-[#FF8C00] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Maior Impacto</div>
          <div className="bg-orange-50 p-4 rounded-full text-[#FF8C00]"><ShieldAlert size={32} /></div>
          <div>
            <h3 className="font-black text-xl text-orange-600">Transformação Completa</h3>
            <p className="text-gray-600 font-medium mt-1">Seu apoio patrocina custos laboratoriais e radiográficos de tratamentos complexos (como canal e próteses).</p>
          </div>
        </div>
      );
    } else if (valor >= 150) {
      return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-200 flex items-center gap-6 animate-fade-in">
          <div className="bg-green-50 p-4 rounded-full text-green-500"><Syringe size={32} /></div>
          <div>
            <h3 className="font-black text-xl text-green-600">Tratamento Clínico</h3>
            <p className="text-gray-600 font-medium mt-1">Custeia anestésicos, resinas e materiais descartáveis para uma ou mais consultas de restauração.</p>
          </div>
        </div>
      );
    } else if (valor > 0) {
      return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 flex items-center gap-6 animate-fade-in">
          <div className="bg-orange-50 p-4 rounded-full text-[#FF8C00]"><Smile size={32} /></div>
          <div>
            <h3 className="font-black text-xl text-[#FF8C00]">Prevenção e Higiene</h3>
            <p className="text-gray-600 font-medium mt-1">Garante Kits de Higiene Oral completos (escova, pasta, fio dental) para jovens na fila de triagem.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex items-center gap-6 animate-fade-in">
        <div className="bg-gray-200 p-4 rounded-full text-gray-500"><Info size={32} /></div>
        <div>
          <h3 className="font-bold text-lg text-gray-600">Apoie a Turma do Bem</h3>
          <p className="text-gray-500 font-medium mt-1">Informe um valor acima para ver o impacto que sua doação irá gerar na vida dos jovens.</p>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] font-sans pb-12">
      
     
      <div className="bg-[#FF8C00] text-white pt-12 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-4 left-4">
          <Link to="/login" className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft size={18} /> Voltar
          </Link>
        </div>
        <Heart size={60} className="mx-auto mt-16 mb-4 text-orange-200 fill-orange-200 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Seu apoio transforma futuros.</h1>
        <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto font-medium">
          Você está doando para a <strong>Turma do Bem</strong>.
        </p>
      </div>

      
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
              
              
              <div className="mb-8">
                <p className="text-center text-gray-500 mb-4 font-medium">Informe o tipo da sua doação</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={() => setTipoDoacao('pontual')}
                    className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${tipoDoacao === 'pontual' ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 text-gray-500 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                  >
                    Pontual
                  </button>
                  <button 
                    onClick={() => setTipoDoacao('mensal')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${tipoDoacao === 'mensal' ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 text-gray-500 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                  >
                    <Heart size={20} className={tipoDoacao === 'mensal' ? 'fill-[#00CED1]' : ''} /> Mensal
                  </button>
                  <button 
                    onClick={() => setTipoDoacao('anual')}
                    className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${tipoDoacao === 'anual' ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 text-gray-500 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
                  >
                    Anual
                  </button>
                </div>
              </div>

             
              <div>
                <p className="text-center text-gray-500 mb-4 font-medium">Informe o valor da sua doação</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[30, 150, 500].map((val) => (
                    <button 
                      key={val}
                      onClick={() => setValorDoacao(val)}
                      className={`py-3 rounded-lg text-lg font-medium transition-all duration-200 ${valorDoacao === val ? 'border-2 border-[#00CED1] text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]' : 'border border-gray-300 text-gray-500 hover:border-[#00CED1] hover:text-[#00CED1]'}`}
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
                      className="col-span-2 md:col-span-3 py-3 rounded-lg text-lg font-medium border border-gray-300 text-gray-500 hover:border-[#00CED1] hover:text-[#00CED1] transition-all duration-200"
                    >
                      Outro valor
                    </button>
                  )}
                </div>
              </div>

            </div>

            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">O impacto da sua doação:</h2>
              {renderCardImpacto()}
            </div>

          </div>

          
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center sticky top-8">
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-cyan-100">
                <QrCode size={32} className="text-[#00CED1]" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">
                Doar R$ {getValorAtual() > 0 ? getValorAtual() : '0'}
              </h2>
              <p className="text-[#FF8C00] font-bold text-sm uppercase tracking-wider mb-6">
                Via PIX {tipoDoacao}
              </p>
              
              <p className="text-gray-500 text-sm mb-6">Abra o app do seu banco e escaneie o código ou copie a chave CNPJ abaixo.</p>
              
              
              <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-200 mx-auto rounded-xl flex items-center justify-center mb-8 relative group cursor-pointer hover:bg-gray-100 transition-colors">
                 <QrCode size={80} className="text-gray-300 group-hover:text-[#00CED1] transition-colors" />
                 <p className="absolute bottom-2 text-[10px] font-bold text-gray-400 uppercase">QR Code Ilustrativo</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-6">
                 <div className="text-left overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Chave PIX (CNPJ)</p>
                    <p className="font-mono text-gray-800 font-bold truncate">12.345.678/0001-99</p>
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

              <p className="text-xs text-gray-400 font-medium">Turma do Bem - OSCIP<br/>Instituição sem fins lucrativos.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}