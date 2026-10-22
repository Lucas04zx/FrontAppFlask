import React from 'react';
import { IrisFeatures } from '../types/iris';

interface IrisAnatomyDiagramProps {
  features: IrisFeatures;
  predictedSpecies?: string;
  accentColor?: string;
}

export const IrisAnatomyDiagram: React.FC<IrisAnatomyDiagramProps> = ({
  features,
  predictedSpecies,
  accentColor = '#4f46e5',
}) => {
  const { sepal_length, sepal_width, petal_length, petal_width } = features;

  // Scale calculations for dynamic SVG representation
  // Max expected length is ~8cm, width ~4.5cm
  const sepalHeight = Math.max(25, Math.min(105, sepal_length * 13));
  const sepalRadiusX = Math.max(12, Math.min(38, sepal_width * 10));

  const petalHeight = Math.max(15, Math.min(95, petal_length * 13));
  const petalRadiusX = Math.max(8, Math.min(28, petal_width * 11));

  const petalSepalRatio = sepal_length > 0 ? (petal_length / sepal_length).toFixed(2) : '0.00';

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-slate-700">Morfologia Proporcional (SVG)</span>
        <span className="font-mono text-slate-500 tabular-nums">
          Razão Pétala/Sépala: <strong className="text-slate-800">{petalSepalRatio}x</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
        {/* Sepal Visual */}
        <div className="flex flex-col items-center">
          <svg width="120" height="130" viewBox="0 0 120 130" className="overflow-visible">
            <defs>
              <linearGradient id="sepalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {/* Stem base */}
            <path d="M 60 120 Q 60 110 60 95" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
            {/* Calyx */}
            <ellipse cx="60" cy="95" rx="8" ry="4" fill="#15803d" />
            {/* Sepal fall */}
            <path
              d={`M 60 95 C ${60 - sepalRadiusX} 75, ${60 - sepalRadiusX * 1.1} 40, 60 ${95 - sepalHeight} C ${60 + sepalRadiusX * 1.1} 40, ${60 + sepalRadiusX} 75, 60 95 Z`}
              fill="url(#sepalGrad)"
              stroke="#3730a3"
              strokeWidth="1.5"
            />
            {/* Sepal central vein & gold guide */}
            <path
              d={`M 60 95 L 60 ${95 - sepalHeight * 0.7}`}
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Dimension brackets */}
            <text x="60" y="125" textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
              {sepal_width.toFixed(1)} cm larg.
            </text>
          </svg>
          <div className="text-center mt-1">
            <span className="text-xs font-semibold text-slate-800 block">Sépala (Cálice)</span>
            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
              {sepal_length.toFixed(1)} × {sepal_width.toFixed(1)} cm
            </span>
          </div>
        </div>

        {/* Petal Visual */}
        <div className="flex flex-col items-center">
          <svg width="120" height="130" viewBox="0 0 120 130" className="overflow-visible">
            <defs>
              <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {/* Stem */}
            <path d="M 60 120 Q 60 110 60 95" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
            {/* Petal standard */}
            <path
              d={`M 60 95 C ${60 - petalRadiusX} 75, ${60 - petalRadiusX * 1.1} 45, 60 ${95 - petalHeight} C ${60 + petalRadiusX * 1.1} 45, ${60 + petalRadiusX} 75, 60 95 Z`}
              fill="url(#petalGrad)"
              stroke="#7e22ce"
              strokeWidth="1.5"
            />
            <path
              d={`M 60 95 L 60 ${95 - petalHeight * 0.6}`}
              stroke="#fef08a"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <text x="60" y="125" textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
              {petal_width.toFixed(1)} cm larg.
            </text>
          </svg>
          <div className="text-center mt-1">
            <span className="text-xs font-semibold text-slate-800 block">Pétala (Estandarte)</span>
            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
              {petal_length.toFixed(1)} × {petal_width.toFixed(1)} cm
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Dimensões ajustadas em escala real</span>
        <span className="font-medium text-slate-600">
          {predictedSpecies ? `Diagnóstico: ${predictedSpecies}` : 'Aguardando predição'}
        </span>
      </div>
    </div>
  );
};
