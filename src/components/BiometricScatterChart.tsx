import React from 'react';
import { REFERENCE_SCATTER_POINTS } from '../data/speciesData';
import { IrisFeatures } from '../types/iris';

interface BiometricScatterChartProps {
  currentFeatures: IrisFeatures;
  predictedSpecies?: string;
}

export const BiometricScatterChart: React.FC<BiometricScatterChartProps> = ({
  currentFeatures,
  predictedSpecies,
}) => {
  // Chart coordinates:
  // X: Sepal Length (4.0 to 8.0 cm)
  // Y: Petal Length (0.5 to 7.5 cm)
  const minX = 4.0;
  const maxX = 8.0;
  const minY = 0.5;
  const maxY = 7.5;

  const width = 480;
  const height = 260;
  const padding = { top: 20, right: 24, bottom: 40, left: 45 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => {
    const clamped = Math.max(minX, Math.min(maxX, val));
    return padding.left + ((clamped - minX) / (maxX - minX)) * innerWidth;
  };

  const scaleY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + innerHeight - ((clamped - minY) / (maxY - minY)) * innerHeight;
  };

  const userX = scaleX(currentFeatures.sepal_length);
  const userY = scaleY(currentFeatures.petal_length);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Espaço Morfológico (Sépala × Pétala)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribuição clássica de Fisher e posição do espécime atual
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-600">Setosa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            <span className="text-slate-600">Versicolor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            <span className="text-slate-600">Virginica</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[380px] select-none"
        >
          {/* Grid lines */}
          {[4, 5, 6, 7, 8].map((val) => {
            const x = scaleX(val);
            return (
              <g key={`x-${val}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + innerHeight}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val}.0
                </text>
              </g>
            );
          })}

          {[1, 3, 5, 7].map((val) => {
            const y = scaleY(val);
            return (
              <g key={`y-${val}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val}.0
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + innerWidth / 2}
            y={height - 6}
            textAnchor="middle"
            className="text-[11px] font-medium fill-slate-600"
          >
            Comprimento da Sépala (cm)
          </text>
          <text
            x={14}
            y={padding.top + innerHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${padding.top + innerHeight / 2})`}
            className="text-[11px] font-medium fill-slate-600"
          >
            Comprimento da Pétala (cm)
          </text>

          {/* Reference scatter points */}
          {REFERENCE_SCATTER_POINTS.map((pt, i) => {
            const cx = scaleX(pt.sepal);
            const cy = scaleY(pt.petal);
            let fill = '#10b981';
            if (pt.species === 'Versicolor') fill = '#0ea5e9';
            if (pt.species === 'Virginica') fill = '#6366f1';

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={3.5}
                fill={fill}
                opacity={0.4}
                className="transition-all"
              />
            );
          })}

          {/* Active prediction crosshairs */}
          <line
            x1={userX}
            y1={padding.top}
            x2={userX}
            y2={padding.top + innerHeight}
            stroke="#f43f5e"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity={0.6}
          />
          <line
            x1={padding.left}
            y1={userY}
            x2={padding.left + innerWidth}
            y2={userY}
            stroke="#f43f5e"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity={0.6}
          />

          {/* Active sample point */}
          <circle
            cx={userX}
            cy={userY}
            r={10}
            fill="#f43f5e"
            fillOpacity={0.2}
            className="animate-ping"
          />
          <circle
            cx={userX}
            cy={userY}
            r={6}
            fill="#e11d48"
            stroke="#ffffff"
            strokeWidth="2"
            className="shadow-md"
          />

          {/* Label tooltip for user point */}
          <g transform={`translate(${Math.min(userX + 10, width - 110)}, ${Math.max(userY - 24, padding.top + 8)})`}>
            <rect
              width="95"
              height="20"
              rx="4"
              fill="#0f172a"
              fillOpacity="0.9"
            />
            <text
              x="47.5"
              y="13"
              textAnchor="middle"
              className="text-[10px] font-mono fill-white font-medium"
            >
              {currentFeatures.sepal_length.toFixed(1)}cm × {currentFeatures.petal_length.toFixed(1)}cm
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
        <span>Amostra atual (ponto vermelho pulsante)</span>
        <span className="font-mono text-slate-700">
          {predictedSpecies ? `Agrupamento compatível: ${predictedSpecies}` : 'Pronto para calcular'}
        </span>
      </div>
    </div>
  );
};
