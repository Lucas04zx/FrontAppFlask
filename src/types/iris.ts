export interface IrisFeatures {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
}

export interface IrisPredictionResponse {
  codigo: number;
  dados_recebidos: IrisFeatures;
  predicao: string;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: number;
  input: IrisFeatures;
  result: IrisPredictionResponse;
  latencyMs: number;
}

export interface SpeciesInfo {
  code: number;
  name: string;
  scientificName: string;
  author: string;
  description: string;
  characteristics: string[];
  image: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  ranges: {
    sepal_length: [number, number];
    sepal_width: [number, number];
    petal_length: [number, number];
    petal_width: [number, number];
  };
  averages: {
    sepal_length: number;
    sepal_width: number;
    petal_length: number;
    petal_width: number;
  };
}
