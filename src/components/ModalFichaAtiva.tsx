import {
  MapPin, CalendarCheck, Printer, Plus, Trash2, Ban,
  CheckCircle2, Send, Clock, Activity, X,
} from 'lucide-react';

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

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
  historico?: HistoricoConsulta[];
}

interface SlotProposto {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  dentistaNome: string;
  dentistaCidade: string;
  procedimento: string;
  slots: SlotProposto[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

interface Props {
  ficha: Paciente;
  usuarioLogado: string;
  slotsPropostos: SlotProposto[];
  novaData: string;
  novaHora: string;
  procedimentoOferta: string;
  slotsOcupados: string[];
  slotsLivres: SlotProposto[];
  dataHoje: string;
  ofertaAtiva?: OfertaAgendamento;
  onClose: () => void;
  onGerarRelatorio: (p: Paciente) => void;
  onAdicionarSlot: () => void;
  onRemoverSlot: (id: string) => void;
  onEnviarOferta: () => void;
  setNovaData: (v: string) => void;
  setNovaHora: (v: string) => void;
  setProcedimentoOferta: (v: string) => void;
}

export function ModalFichaAtiva({
  ficha, slotsPropostos, novaData, novaHora, procedimentoOferta,
  slotsOcupados, slotsLivres, dataHoje, ofertaAtiva,
  onClose, onGerarRelatorio, onAdicionarSlot, onRemoverSlot, onEnviarOferta,
  setNovaData, setNovaHora, setProcedimentoOferta,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>

        {/* Painel esquerdo — agendamento */}
        <div className="p-8 md:w-1/2 overflow-y-auto bg-white border-r border-gray-100">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-dashed border-gray-200">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-gray-800 truncate">{ficha.nome}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><MapPin size={14} /> {ficha.cidade}, {ficha.pais}</p>
            </div>
            <div className="flex flex-col items-end gap-2 ml-3 flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center font-black text-xl border-2 border-orange-200">{ficha.idade}</div>
              <button onClick={() => onGerarRelatorio(ficha)}
                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-2 py-1 rounded-lg transition-all uppercase tracking-wide">
                <Printer size={12} /> Relatório
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="font-bold text-gray-800 flex items-center gap-2"><CalendarCheck size={18} className="text-[#8dc63f]" /> Propor Horários ao Paciente</h4>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Procedimento</label>
              <select value={procedimentoOferta} onChange={e => setProcedimentoOferta(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF8C00] appearance-none cursor-pointer">
                <option>Primeira Consulta - Avaliação</option>
                <option>Restauração (Cárie)</option>
                <option>Limpeza (Profilaxia)</option>
                <option>Canal (Endodontia)</option>
                <option>Extração Simples</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Adicionar Opção de Horário</label>
              <div className="flex gap-2">
                <input type="date" min={dataHoje} value={novaData} onChange={e => setNovaData(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF8C00]" />
                <input type="time" value={novaHora} onChange={e => setNovaHora(e.target.value)}
                  className="w-[110px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF8C00]" />
                <button type="button" onClick={onAdicionarSlot}
                  className="bg-[#FF8C00] text-white p-2.5 rounded-xl hover:bg-[#E67E22] transition-colors flex-shrink-0">
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">Adicione várias opções para o paciente escolher a melhor.</p>
            </div>

            {slotsPropostos.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Horários na proposta:</p>
                {slotsPropostos.map(slot => {
                  const ocupado = slotsOcupados.includes(`${slot.data}|${slot.hora}`);
                  return (
                    <div key={slot.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium ${ocupado ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-700'}`}>
                      <span className="flex items-center gap-2">
                        {ocupado ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                        {slot.data.split('-').reverse().join('/')} às {slot.hora}
                        {ocupado && <span className="text-[10px] font-bold uppercase bg-red-100 text-red-500 px-2 py-0.5 rounded ml-1">Horário Ocupado</span>}
                      </span>
                      <button type="button" onClick={() => onRemoverSlot(slot.id)} className="text-gray-300 hover:text-red-500 ml-2 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button type="button" onClick={onEnviarOferta} disabled={slotsLivres.length === 0}
              className="w-full bg-[#8dc63f] text-white font-bold py-4 rounded-xl hover:bg-[#7ebd34] transition-colors shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              <Send size={18} />
              Enviar Proposta ao Paciente
              {slotsLivres.length > 0 && <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">{slotsLivres.length} opção(ões)</span>}
            </button>

            {ofertaAtiva && (
              <div className={`p-4 rounded-xl border text-sm ${ofertaAtiva.status === 'confirmado' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <p className="font-bold text-gray-700 flex items-center gap-2 mb-1">
                  {ofertaAtiva.status === 'confirmado'
                    ? <><CheckCircle2 size={16} className="text-green-500" /> Consulta confirmada pelo paciente!</>
                    : <><Clock size={16} className="text-[#FF8C00]" /> Proposta enviada — aguardando escolha...</>}
                </p>
                <p className="text-gray-500 text-xs">{ofertaAtiva.procedimento}</p>
                {ofertaAtiva.status === 'confirmado' && ofertaAtiva.slotEscolhido && (
                  <p className="text-green-700 font-bold text-xs mt-1">📅 {ofertaAtiva.slotEscolhido.data.split('-').reverse().join('/')} às {ofertaAtiva.slotEscolhido.hora}</p>
                )}
                {ofertaAtiva.status === 'pendente' && (
                  <p className="text-gray-400 text-xs mt-1">{ofertaAtiva.slots.length} opção(ões) enviada(s)</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Painel direito — histórico */}
        <div className="p-8 md:w-1/2 overflow-y-auto bg-gray-50/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Activity size={20} className="text-[#8dc63f]" /> Histórico de Tratamento</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
          </div>

          <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
            {ficha.historico && ficha.historico.length > 0 ? (
              ficha.historico.map((item, idx) => (
                <div key={idx} className="relative pl-6 animate-fade-in">
                  <div className={`absolute w-5 h-5 rounded-full -left-[11px] top-0.5 border-4 border-white shadow-sm ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`} />
                  <p className="text-xs font-bold text-gray-400 mb-1">{item.data}</p>
                  <div className={`p-4 rounded-xl border ${item.status === 'Agendado' ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h4 className={`font-bold text-sm ${item.status === 'Agendado' ? 'text-orange-800' : 'text-gray-800'}`}>
                      {item.proc} <span className="text-[10px] font-normal uppercase ml-2 text-gray-500">({item.status})</span>
                    </h4>
                    <p className={`text-xs mt-1 ${item.status === 'Agendado' ? 'text-orange-600' : 'text-gray-500'}`}>
                      Responsável: Dr(a). {item.dentista}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Activity size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">Nenhum histórico de tratamento ainda.</p>
                <p className="text-gray-400 text-xs mt-1">O histórico aparecerá aqui quando for agendado algum procedimento.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
