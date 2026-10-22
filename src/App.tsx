import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResultCard } from './components/PredictionResultCard';
import { BiometricScatterChart } from './components/BiometricScatterChart';
import { PredictionHistory } from './components/PredictionHistory';
import { SpeciesGuideView } from './components/SpeciesGuideView';
import { ApiDocsView } from './components/ApiDocsView';
import {
  IrisFeatures,
  IrisPredictionResponse,
  PredictionHistoryItem,
} from './types/iris';
import {
  DEFAULT_API_ENDPOINT,
  PRESET_SAMPLES,
} from './data/speciesData';
import {
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'iris_classifier_history_v1';
const STORAGE_KEY_ENDPOINT = 'iris_classifier_endpoint_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'species' | 'api'>('dashboard');

  // API Endpoint
  const [endpointUrl, setEndpointUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ENDPOINT) || DEFAULT_API_ENDPOINT;
  });

  // Form inputs initialized with prompt model payload
  const [features, setFeatures] = useState<IrisFeatures>({
    sepal_length: 6.7,
    sepal_width: 3.0,
    petal_length: 5.2,
    petal_width: 2.3,
  });

  // Prediction State
  const [result, setResult] = useState<IrisPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // History
  const [history, setHistory] = useState<PredictionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Ping test state
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Persist history & endpoint changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ENDPOINT, endpointUrl);
  }, [endpointUrl]);

  const handlePredict = async (customFeatures?: IrisFeatures) => {
    const inputPayload = customFeatures || features;

    // Validate inputs
    if (
      !inputPayload.sepal_length ||
      !inputPayload.sepal_width ||
      !inputPayload.petal_length ||
      !inputPayload.petal_width ||
      inputPayload.sepal_length <= 0 ||
      inputPayload.sepal_width <= 0 ||
      inputPayload.petal_length <= 0 ||
      inputPayload.petal_width <= 0
    ) {
      setError('Por favor, preencha todos os 4 campos com valores numéricos positivos maiores que zero.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    // 15 seconds timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sepal_length: Number(inputPayload.sepal_length),
          sepal_width: Number(inputPayload.sepal_width),
          petal_length: Number(inputPayload.petal_length),
          petal_width: Number(inputPayload.petal_width),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);

      if (!response.ok) {
        let errorDetails = `Status HTTP ${response.status} (${response.statusText})`;
        try {
          const errBody = await response.text();
          if (errBody) {
            errorDetails += `: ${errBody.slice(0, 150)}`;
          }
        } catch {
          // ignore error body reading
        }
        throw new Error(errorDetails);
      }

      const data: IrisPredictionResponse = await response.json();

      if (!data || typeof data.predicao !== 'string') {
        throw new Error('A API retornou uma resposta sem o campo "predicao" esperado.');
      }

      setResult(data);

      // Add to history
      const newItem: PredictionHistoryItem = {
        id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        input: inputPayload,
        result: data,
        latencyMs: elapsed,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      let message = 'Ocorreu um erro inesperado ao conectar com o servidor.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          message = 'Tempo limite de requisição excedido (15 segundos). O servidor demorou muito para responder.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          message = 'Falha de conexão com a API. Verifique sua conexão com a internet ou se o endpoint está acessível.';
        } else {
          message = err.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFeatures({
      sepal_length: 5.1,
      sepal_width: 3.5,
      petal_length: 1.4,
      petal_width: 0.2,
    });
    setError(null);
  };

  const handleQuickModelSample = () => {
    const sample = PRESET_SAMPLES[0].features; // Virginica model example
    setFeatures(sample);
    setActiveTab('dashboard');
    handlePredict(sample);
  };

  const handleSelectHistoryItem = (historicalFeatures: IrisFeatures) => {
    setFeatures(historicalFeatures);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleTestPing = async () => {
    setIsTestingPing(true);
    setPingStatus('idle');
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sepal_length: 5.1,
          sepal_width: 3.5,
          petal_length: 1.4,
          petal_width: 0.2,
        }),
      });
      if (response.ok) {
        setPingStatus('success');
      } else {
        setPingStatus('error');
      }
    } catch {
      setPingStatus('error');
    } finally {
      setIsTestingPing(false);
    }
  };

  // Compute stats from history
  const totalPredictions = history.length;
  const countVirginica = history.filter((h) => h.result.predicao === 'Virginica').length;
  const countSetosa = history.filter((h) => h.result.predicao === 'Setosa').length;
  const countVersicolor = history.filter((h) => h.result.predicao === 'Versicolor').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar following Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSample={handleQuickModelSample}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Strip (Below Header) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Predições Realizadas
              </span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {totalPredictions}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Distribuição Setosa
              </span>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                {countSetosa}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {totalPredictions > 0
                ? `${Math.round((countSetosa / totalPredictions) * 100)}%`
                : '0%'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Distribuição Versicolor
              </span>
              <div className="text-xl font-bold font-mono text-sky-600 mt-1 tabular-nums">
                {countVersicolor}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {totalPredictions > 0
                ? `${Math.round((countVersicolor / totalPredictions) * 100)}%`
                : '0%'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Distribuição Virginica
              </span>
              <div className="text-xl font-bold font-mono text-indigo-600 mt-1 tabular-nums">
                {countVirginica}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {totalPredictions > 0
                ? `${Math.round((countVirginica / totalPredictions) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form & Visualizer (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                <PredictionForm
                  features={features}
                  onChange={setFeatures}
                  onSubmit={() => handlePredict()}
                  onReset={handleReset}
                  isLoading={isLoading}
                  error={error}
                  onClearError={() => setError(null)}
                />

                <BiometricScatterChart
                  currentFeatures={features}
                  predictedSpecies={result?.predicao}
                />
              </div>

              {/* Right Column: Prominent Prediction Highlight Card & History (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                <PredictionResultCard
                  result={result}
                  features={features}
                  isLoading={isLoading}
                  latencyMs={latencyMs}
                  endpointUrl={endpointUrl}
                />

                <PredictionHistory
                  history={history}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Botanical Species Guide */}
        {activeTab === 'species' && (
          <SpeciesGuideView
            onLoadPreset={(presetFeatures) => {
              setFeatures(presetFeatures);
              setActiveTab('dashboard');
              handlePredict(presetFeatures);
            }}
          />
        )}

        {/* Tab 3: API Specification & Sandbox */}
        {activeTab === 'api' && (
          <ApiDocsView
            endpointUrl={endpointUrl}
            onUpdateEndpoint={setEndpointUrl}
            onTestPing={handleTestPing}
            isTesting={isTestingPing}
            pingStatus={pingStatus}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Iris ML Classifier</span>
            <span>·</span>
            <span>Classificação Biométrica Baseada no Modelo Flask ML em Azure</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Vite 8.3 & React 19</span>
            <span>·</span>
            <span>Pronto para Deploy na Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
