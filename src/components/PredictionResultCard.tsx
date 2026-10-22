import React, { useState } from 'react';
import {
  Flower2,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { IrisPredictionResponse, IrisFeatures } from '../types/iris';
import { SPECIES_DICTIONARY } from '../data/speciesData';
import { IrisAnatomyDiagram } from './IrisAnatomyDiagram';

interface PredictionResultCardProps {
  result: IrisPredictionResponse | null;
  features: IrisFeatures;
  isLoading: boolean;
  latencyMs: number | null;
  endpointUrl: string;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  features,
  isLoading,
  latencyMs,
  endpointUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const speciesKey = result?.predicao?.trim() || '';
  const species = SPECIES_DICTIONARY[speciesKey];

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-md">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-20" />
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-200 animate-spin" />
            <div className="h-6 bg-slate-300 rounded w-64" />
            <div className="h-4 bg-slate-200 rounded w-40" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-slate-100 rounded-xl" />
            <div className="h-20 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
          <Flower2 className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Aguardando Execução do Modelo
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          Preencha os valores de sépalas e pétalas ao lado ou selecione um dos exemplos para submeter à API e obter a classificação da espécie em tempo real.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <span>Endpoint configurado:</span>
          <span className="font-mono text-slate-600 truncate max-w-[200px]">
            {endpointUrl.replace('https://', '')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* Top Banner / Status Line */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">Classificação Concluída com Sucesso</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px] tabular-nums">
          {latencyMs !== null && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {latencyMs} ms
            </span>
          )}
          <span>Código: {result.codigo}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* HERO PREDICTION HIGHLIGHT BOX */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500/10 via-white to-purple-500/10 border-2 border-indigo-300/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="text-center sm:text-left flex-1">
              <div className="text-xs font-semibold tracking-wider uppercase text-indigo-600 mb-1">
                Resultado da Predição (API)
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <span>{result.predicao}</span>
                <span className="text-sm font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Código #{result.codigo}
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1.5 font-medium italic">
                {species?.scientificName || `Iris ${result.predicao.toLowerCase()}`}
              </div>
              <p className="text-xs text-slate-600 mt-3 max-w-md leading-relaxed">
                {species?.description ||
                  'Espécime classificado com base nas medições biométricas informadas.'}
              </p>
            </div>

            {/* Species Botanical Photo */}
            {species?.image && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-white shadow-md relative group">
                  <img
                    src={species.image}
                    alt={`Foto botânica de ${species.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 font-medium">
                  {species.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Anatomical Proportional Diagram */}
        <IrisAnatomyDiagram
          features={result.dados_recebidos || features}
          predictedSpecies={result.predicao}
        />

        {/* Received Data Verification Grid */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-700">
              Dados Validados pela API (`dados_recebidos`)
            </span>
            <span className="font-mono text-slate-500 text-[11px]">Unidade: cm</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wide">
                Sepal Length
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                {result.dados_recebidos?.sepal_length ?? features.sepal_length} cm
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wide">
                Sepal Width
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                {result.dados_recebidos?.sepal_width ?? features.sepal_width} cm
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wide">
                Petal Length
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                {result.dados_recebidos?.petal_length ?? features.petal_length} cm
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wide">
                Petal Width
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                {result.dados_recebidos?.petal_width ?? features.petal_width} cm
              </span>
            </div>
          </div>
        </div>

        {/* JSON Inspector Accordion */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              Payload & Resposta JSON da API
            </span>
            <span className="text-[11px] text-slate-400">
              {showJson ? 'Recolher' : 'Expandir JSON'}
            </span>
          </button>

          {showJson && (
            <div className="p-4 bg-slate-900 text-slate-100 text-xs font-mono relative">
              <button
                type="button"
                onClick={handleCopyJson}
                className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-slate-300 transition-colors cursor-pointer"
                title="Copiar JSON de resposta"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
              <pre className="overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
