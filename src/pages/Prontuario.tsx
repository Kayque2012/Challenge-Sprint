import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Activity } from 'lucide-react';

export function Prontuario() {
  // Rota dinamica
  const { nome } = useParams<{ nome: string }>();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F5F5DC] dark:bg-slate-900 p-8 pt-[100px] font-sans flex justify-center transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 dark:text-slate-400 hover:text-[#FF8C00] font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/30 text-[#FF8C00] rounded-2xl flex items-center justify-center font-black text-2xl">
            {nome?.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white">{nome}</h2>
            <p className="text-gray-500 dark:text-slate-400 font-medium flex items-center gap-2">
              <FileText size={16}/> Prontuário Digital Ativo
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700/40 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-gray-700 dark:text-slate-200 flex items-center gap-2">
            <Activity size={18} className="text-[#8dc63f]"/> Observações Clínicas
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            Dados carregados dinamicamente para o paciente <strong>{nome}</strong>.
            Este ecrã utiliza parâmetros de rota para identificar o beneficiário no banco de dados Java/DDD.
          </p>
        </div>
      </div>
    </main>
  );
}