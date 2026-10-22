import React from 'react';
import { SPECIES_DICTIONARY } from '../data/speciesData';
import { Check, Sparkles, BookOpen } from 'lucide-react';
import { IrisFeatures } from '../types/iris';

interface SpeciesGuideViewProps {
  onLoadPreset: (features: IrisFeatures) => void;
}

export const SpeciesGuideView: React.FC<SpeciesGuideViewProps> = ({ onLoadPreset }) => {
  return (
    <div className="space-y-8">
      {/* Intro section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Compêndio Botânico
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          As Três Espécies Clássicas do Dataset Iris
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Publicado em 1936 pelo biólogo e estatístico britânico Ronald Fisher, o conjunto de dados da flor Íris tornou-se o benchmark mais famoso do aprendizado de máquina supervisionado. O gênero <em>Iris</em> compreende plantas perenes rizomatosas caracterizadas por flores trímeras com tépalas externas caídas (sépalas ou <em>falls</em>) e tépalas internas eretas (pétalas ou <em>standards</em>).
        </p>
      </div>

      {/* 3 Species Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(SPECIES_DICTIONARY).map(([key, item]) => {
          return (
            <div
              key={key}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Photo */}
              <div className="h-48 overflow-hidden relative group">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  Código: {item.code}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <div className="text-xs italic text-slate-500 mt-0.5">
                    {item.scientificName}
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Typical averages table */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-2">
                      Médias Morfológicas (Fisher 1936):
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sépala C:</span>
                        <strong className="text-slate-800">{item.averages.sepal_length} cm</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sépala L:</span>
                        <strong className="text-slate-800">{item.averages.sepal_width} cm</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Pétala C:</span>
                        <strong className="text-slate-800">{item.averages.petal_length} cm</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Pétala L:</span>
                        <strong className="text-slate-800">{item.averages.petal_width} cm</strong>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic characteristics */}
                  <div className="mt-4 space-y-1.5">
                    {item.characteristics.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onLoadPreset(item.averages)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Testar Valores Médios no Modelo</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
