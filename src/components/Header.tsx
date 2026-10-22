import React from 'react';
import { Flower2, BookOpen, Terminal, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'species' | 'api';
  setActiveTab: (tab: 'dashboard' | 'species' | 'api') => void;
  onQuickSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickSample,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Flower2 className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors"
            >
              Iris Classifier ML
            </a>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('species')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'species'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Guia Botânico
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('api')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'api'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Especificação API
            </button>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onQuickSample}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              title="Carrega o exemplo do enunciado e faz a predição"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exemplo do Modelo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
