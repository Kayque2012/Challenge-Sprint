import { Phone, Target } from 'lucide-react';

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  pais: string;
  cidade: string;
  tipo_dor: string;
  score_match: number;
  renda: number;
  tempo_dor: number;
  telefone?: string;
}

interface Props {
  paciente: Paciente;
  onClose: () => void;
  onAdotar: (p: Paciente) => void;
}

export function ModalAvaliarPaciente({ paciente, onClose, onAdotar }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-4xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Drag handle — mobile only */}
        <div className="flex justify-center py-2.5 md:hidden flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex-1 min-h-0 p-6 md:p-8 md:w-1/2 md:flex-none overflow-y-auto">
          <button onClick={onClose} className="mb-6 text-gray-400 hover:text-gray-800 text-sm font-bold transition-colors">← Fechar</button>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 text-xl font-bold border border-gray-200">{paciente.nome.charAt(0)}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{paciente.nome}</h2>
              <p className="text-sm font-semibold text-[#FF8C00]">Match: {paciente.score_match}%</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Idade</p><p className="text-sm font-bold text-[#FF8C00]">{paciente.idade} anos</p></div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Renda</p><p className="text-sm font-bold text-gray-700">{paciente.renda} SM</p></div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tempo Dor</p><p className="text-sm font-bold text-gray-700">{paciente.tempo_dor} dias</p></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="text-gray-800 font-bold text-sm mb-2 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> Contato e Localização</h4>
              <p className="text-sm font-medium text-gray-600">{paciente.telefone || '(11) 90000-0000'}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{paciente.cidade}, {paciente.pais}</p>
            </div>
            <button onClick={() => onAdotar(paciente)} className="w-full mt-4 bg-[#FF8C00] text-white font-bold py-3.5 rounded-xl hover:bg-[#E67E22] transition-colors shadow-md flex items-center justify-center gap-2">
              <Target size={18} /> Adotar Paciente
            </button>
          </div>
        </div>
        <div className="bg-gray-100 md:w-1/2 md:flex-none h-[200px] md:h-auto relative flex-shrink-0">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 pointer-events-none"><p className="text-[10px] font-bold text-gray-500 uppercase">Geolocalização</p></div>
          <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(paciente.cidade + ", " + paciente.pais)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            title="Mapa" />
        </div>
      </div>
    </div>
  );
}
