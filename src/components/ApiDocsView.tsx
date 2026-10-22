import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, RefreshCw, Send } from 'lucide-react';

interface ApiDocsViewProps {
  endpointUrl: string;
  onUpdateEndpoint: (url: string) => void;
  onTestPing: () => void;
  isTesting: boolean;
  pingStatus: 'idle' | 'success' | 'error';
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({
  endpointUrl,
  onUpdateEndpoint,
  onTestPing,
  isTesting,
  pingStatus,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const curlExample = `curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sepal_length": 6.7,
    "sepal_width": 3.0,
    "petal_length": 5.2,
    "petal_width": 2.3
  }'`;

  const fetchExample = `const response = await fetch("${endpointUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sepal_length: 6.7,
    sepal_width: 3.0,
    petal_length: 5.2,
    petal_width: 2.3
  }),
});

const data = await response.json();
console.log("Predição:", data.predicao); // "Virginica"`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Endpoint configuration card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Configuração do Web Service
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Endpoint de Inferência de Machine Learning
            </h2>
          </div>
          <button
            type="button"
            onClick={onTestPing}
            disabled={isTesting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Testar Conectividade</span>
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            URL do Endpoint (POST)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={endpointUrl}
              onChange={(e) => onUpdateEndpoint(e.target.value)}
              className="flex-1 font-mono text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Hospedado no Microsoft Azure App Service com suporte a CORS liberado.
          </p>
        </div>

        {pingStatus === 'success' && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            Conexão com o endpoint estabelecida com sucesso! API respondendo normalmente.
          </div>
        )}
        {pingStatus === 'error' && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            Falha na conexão. Verifique se o serviço está ativo ou se há restrições de rede.
          </div>
        )}
      </div>

      {/* Schema comparison card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Payload de Entrada (POST JSON)
              </h3>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        sepal_length: 6.7,
                        sepal_width: 3.0,
                        petal_length: 5.2,
                        petal_width: 2.3,
                      },
                      null,
                      2
                    ),
                    'req'
                  )
                }
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'req' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copiar</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Quatro campos numéricos correspondentes aos atributos morfológicos da flor Iris.
            </p>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
{`{
  "sepal_length": 6.7,
  "sepal_width": 3.0,
  "petal_length": 5.2,
  "petal_width": 2.3
}`}
            </pre>
          </div>
        </div>

        {/* Response */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                Payload de Retorno da API (200 OK)
              </h3>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        codigo: 2,
                        dados_recebidos: {
                          petal_length: 5.2,
                          petal_width: 2.3,
                          sepal_length: 6.7,
                          sepal_width: 3.0,
                        },
                        predicao: 'Virginica',
                      },
                      null,
                      2
                    ),
                    'res'
                  )
                }
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'res' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copiar</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Retorna o código ordinal (0, 1 ou 2), eco dos dados recebidos e o nome da espécie predita.
            </p>
            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
{`{
  "codigo": 2,
  "dados_recebidos": {
    "petal_length": 5.2,
    "petal_width": 2.3,
    "sepal_length": 6.7,
    "sepal_width": 3.0
  },
  "predicao": "Virginica"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Exemplos de Integração (cURL e Fetch)
        </h3>

        {/* cURL */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Terminal (cURL)</span>
            <button
              type="button"
              onClick={() => handleCopy(curlExample, 'curl')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'curl' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copiar cURL</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            {curlExample}
          </pre>
        </div>

        {/* Fetch */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">JavaScript (Fetch API)</span>
            <button
              type="button"
              onClick={() => handleCopy(fetchExample, 'fetch')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'fetch' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copiar Código</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            {fetchExample}
          </pre>
        </div>
      </div>
    </div>
  );
};
