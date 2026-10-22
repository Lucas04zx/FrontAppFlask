import React from 'react';
import {
  History,
  RotateCcw,
  Trash2,
  Download,
  ArrowUpRight,
  Clock,
  Layers,
} from 'lucide-react';
import { PredictionHistoryItem, IrisFeatures } from '../types/iris';

interface PredictionHistoryProps {
  history: PredictionHistoryItem[];
  onSelectHistoryItem: (features: IrisFeatures) => void;
  onClearHistory: () => void;
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const handleExportCSV = () => {
    if (history.length === 0) return;
    const header =
      'DataHora,Predicao,Codigo,Sepal_Length,Sepal_Width,Petal_Length,Petal_Width,Latencia_ms\n';
    const rows = history
      .map((item) => {
        const date = new Date(item.timestamp).toISOString();
        return `${date},${item.result.predicao},${item.result.codigo},${item.input.sepal_length},${item.input.sepal_width},${item.input.petal_length},${item.input.petal_width},${item.latencyMs}`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `iris_predicoes_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Histórico de Predições ({history.length})
          </h3>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              title="Exportar registros como planilha CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Limpar histórico local"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-80" />
          Nenhuma predição registrada nesta sessão ainda.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 font-medium">Horário</th>
                <th className="py-2.5 font-medium">Predição</th>
                <th className="py-2.5 font-medium text-right">Sépala (C × L)</th>
                <th className="py-2.5 font-medium text-right">Pétala (C × L)</th>
                <th className="py-2.5 font-medium text-right">Latência</th>
                <th className="py-2.5 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => {
                const date = new Date(item.timestamp);
                const timeStr = date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                let badgeColor = 'text-emerald-700 bg-emerald-50';
                if (item.result.predicao === 'Versicolor') {
                  badgeColor = 'text-sky-700 bg-sky-50';
                } else if (item.result.predicao === 'Virginica') {
                  badgeColor = 'text-indigo-700 bg-indigo-50';
                }

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 font-mono text-slate-500 tabular-nums">
                      {timeStr}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono text-[11px] ${badgeColor}`}
                      >
                        {item.result.predicao} (#{item.result.codigo})
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600 tabular-nums">
                      {item.input.sepal_length.toFixed(1)} ×{' '}
                      {item.input.sepal_width.toFixed(1)} cm
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600 tabular-nums">
                      {item.input.petal_length.toFixed(1)} ×{' '}
                      {item.input.petal_width.toFixed(1)} cm
                    </td>
                    <td className="py-3 text-right font-mono text-slate-400 tabular-nums">
                      {item.latencyMs} ms
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectHistoryItem(item.input)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        title="Recarregar estas medidas no formulário"
                      >
                        <span>Recarregar</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
