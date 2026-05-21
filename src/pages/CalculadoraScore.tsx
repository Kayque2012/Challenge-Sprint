import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { type TipoDor, GRAVIDADE_SCORE, IDADE_SCORE, calcularRenda } from '../utils/scoreUtils';

export function CalculadoraScore() {
  const [idade, setIdade] = useState(14);
  const [renda, setRenda] = useState(1);
  const [tipoDor, setTipoDor] = useState<TipoDor>('forte');
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({ gravidade: 0, financeiro: 0, idade: 0 });

  useEffect(() => {
    const gravidade = GRAVIDADE_SCORE[tipoDor];
    const financeiro = calcularRenda(renda);
    const idadePts = IDADE_SCORE[idade] ?? 0;
    const total = gravidade + financeiro + idadePts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setBreakdown({ gravidade, financeiro, idade: idadePts });
    setScore(total);
  }, [idade, renda, tipoDor]);

  const idadeValida = idade >= 11 && idade <= 17;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg text-[#FF8C00]">
          <Calculator size={20} />
        </div>
        <h3 className="font-bold text-gray-800">Simulador de Score TdB</h3>
      </div>

      <div className="space-y-5">
        {/* Idade */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Idade</label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${idadeValida ? 'bg-orange-100 text-[#FF8C00]' : 'bg-red-100 text-red-500'}`}>
              {idade} anos {!idadeValida && '— fora do programa'}
            </span>
          </div>
          <input type="range" min="11" max="17" value={idadeValida ? idade : 11}
            onChange={(e) => setIdade(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]" />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>11</span><span>14</span><span>17</span>
          </div>
        </div>

        {/* Renda */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Renda Familiar</label>
            <span className="text-xs font-bold text-gray-600">{renda.toFixed(1)} SM</span>
          </div>
          <input type="range" min="0" max="5" step="0.5" value={renda}
            onChange={(e) => setRenda(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]" />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>0 SM</span><span>2.5 SM</span><span>5 SM</span>
          </div>
        </div>

        {/* Gravidade */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Gravidade da Dor</label>
          <div className="grid grid-cols-4 gap-2">
            {(['leve', 'moderada', 'forte', 'urgente'] as TipoDor[]).map((item) => (
              <button key={item} onClick={() => setTipoDor(item)}
                className={`py-2 rounded-xl text-[11px] font-bold capitalize transition-all ${tipoDor === item ? 'bg-[#FF8C00] text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                {item === 'urgente' ? 'Urgente' : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 space-y-2">
        {[
          { label: 'Gravidade', value: breakdown.gravidade, max: 45 },
          { label: 'Condição Financeira', value: breakdown.financeiro, max: 35 },
          { label: 'Prioridade Etária', value: breakdown.idade, max: 20 },
        ].map(({ label, value, max }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[11px] text-gray-500 w-[130px] font-medium shrink-0">{label}</span>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF8C00] h-full rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%` }} />
            </div>
            <span className="text-[11px] font-bold text-gray-600 w-12 text-right">{value}/{max}</span>
          </div>
        ))}
      </div>

      {/* Resultado Final */}
      <div className="mt-6 pt-6 border-t border-dashed border-gray-100 text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Prioridade Calculada</p>
        <div className="text-5xl font-black text-[#FF8C00] mb-2">{score}<span className="text-xl text-gray-400">/100</span></div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF8C00] to-[#8dc63f] h-full transition-all duration-500" style={{ width: `${score}%` }}></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Jovens mais velhos e em maior vulnerabilidade são priorizados.</p>
      </div>
    </div>
  );
}