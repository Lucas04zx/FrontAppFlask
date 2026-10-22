import React from 'react';
import { Play, RotateCcw, Sparkles, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { IrisFeatures } from '../types/iris';
import { PRESET_SAMPLES, SamplePreset } from '../data/speciesData';

interface PredictionFormProps {
  features: IrisFeatures;
  onChange: (features: IrisFeatures) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

interface FieldConfig {
  key: keyof IrisFeatures;
  label: string;
  botanicalTerm: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  typicalHint: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'sepal_length',
    label: 'Comprimento da Sépala',
    botanicalTerm: 'sepal_length',
    min: 3.0,
    max: 9.0,
    step: 0.1,
    unit: 'cm',
    typicalHint: 'Geralmente entre 4.3 e 7.9 cm',
  },
  {
    key: 'sepal_width',
    label: 'Largura da Sépala',
    botanicalTerm: 'sepal_width',
    min: 1.5,
    max: 5.5,
    step: 0.1,
    unit: 'cm',
    typicalHint: 'Geralmente entre 2.0 e 4.4 cm',
  },
  {
    key: 'petal_length',
    label: 'Comprimento da Pétala',
    botanicalTerm: 'petal_length',
    min: 0.5,
    max: 8.0,
    step: 0.1,
    unit: 'cm',
    typicalHint: 'Geralmente entre 1.0 e 6.9 cm',
  },
  {
    key: 'petal_width',
    label: 'Largura da Pétala',
    botanicalTerm: 'petal_width',
    min: 0.1,
    max: 3.5,
    step: 0.1,
    unit: 'cm',
    typicalHint: 'Geralmente entre 0.1 e 2.5 cm',
  },
];

export const PredictionForm: React.FC<PredictionFormProps> = ({
  features,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  error,
  onClearError,
}) => {
  const handleNumberChange = (key: keyof IrisFeatures, rawValue: string) => {
    onClearError();
    const val = parseFloat(rawValue);
    onChange({
      ...features,
      [key]: isNaN(val) ? 0 : val,
    });
  };

  const handleSliderChange = (key: keyof IrisFeatures, val: number) => {
    onClearError();
    onChange({
      ...features,
      [key]: Number(val.toFixed(1)),
    });
  };

  const handleApplyPreset = (preset: SamplePreset) => {
    onClearError();
    onChange(preset.features);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Validation
  const hasInvalidField =
    features.sepal_length <= 0 ||
    features.sepal_width <= 0 ||
    features.petal_length <= 0 ||
    features.petal_width <= 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Parâmetros Biométricos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Insira as 4 medidas morfológicas em centímetros para a classificação
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            POST JSON
          </span>
        </div>
      </div>

      {/* Preset Quick Load */}
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Exemplos Pré-definidos
          </span>
          <span className="text-[11px] text-slate-400">Clique para carregar</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_SAMPLES.map((preset) => {
            const isMatch =
              features.sepal_length === preset.features.sepal_length &&
              features.sepal_width === preset.features.sepal_width &&
              features.petal_length === preset.features.petal_length &&
              features.petal_width === preset.features.petal_width;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  isMatch
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium truncate">{preset.label}</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono truncate">
                  P:{preset.features.petal_length} S:{preset.features.sepal_length}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block text-rose-900 mb-0.5">
              Erro na Comunicação com a API
            </strong>
            <p className="text-rose-700 leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* 4 Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FIELDS.map((field) => {
            const currentValue = features[field.key];
            return (
              <div
                key={field.key}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor={field.key}
                    className="text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                  >
                    <span>{field.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({field.botanicalTerm})
                    </span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {field.unit}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={currentValue || field.min}
                    onChange={(e) =>
                      handleSliderChange(field.key, parseFloat(e.target.value))
                    }
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="w-24 relative">
                    <input
                      id={field.key}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={currentValue}
                      onChange={(e) => handleNumberChange(field.key, e.target.value)}
                      className="w-full text-right font-mono text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 tabular-nums shadow-xs"
                      required
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Mín: {field.min.toFixed(1)}</span>
                  <span className="text-slate-500">{field.typicalHint}</span>
                  <span>Máx: {field.max.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || hasInvalidField}
            className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer ${
              isLoading || hasInvalidField
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando dados para o modelo...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Calcular Predição da Espécie</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
            title="Redefinir campos para valores iniciais"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redefinir</span>
          </button>
        </div>
      </form>
    </div>
  );
};
