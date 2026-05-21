import { CalendarCheck, Clock, Ban } from 'lucide-react';

interface OfertaAgendamento {
  status: 'pendente' | 'confirmado';
}

interface Props {
  oferta?: OfertaAgendamento;
  temAgendamento: boolean;
}

export function StatusAgendamento({ oferta, temAgendamento }: Props) {
  if (oferta?.status === 'confirmado' || temAgendamento)
    return <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg w-fit"><CalendarCheck size={13} /> Agendado</div>;
  if (oferta?.status === 'pendente')
    return <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1.5 rounded-lg w-fit"><Clock size={13} /> Em Andamento</div>;
  return <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg w-fit"><Ban size={13} /> Não Agendado</div>;
}
