import { SpeciesInfo, IrisFeatures } from '../types/iris';
import setosaImg from '../assets/images/iris_setosa_flower_1792668163662.jpg';
import versicolorImg from '../assets/images/iris_versicolor_flower_1792668164798.jpg';
import virginicaImg from '../assets/images/iris_virginica_flower_1792668165050.jpg';

export const SPECIES_DICTIONARY: Record<string, SpeciesInfo> = {
  Setosa: {
    code: 0,
    name: 'Iris Setosa',
    scientificName: 'Iris setosa Pall. ex Link',
    author: 'Peter Simon Pallas',
    description:
      'Caracterizada por pétalas notavelmente pequenas e sépalas curtas e largas. É uma espécie ártica e subártica, encontrada com frequência em regiões costeiras do Alasca e norte da Ásia.',
    characteristics: [
      'Pétalas muito curtas (1.0 a 1.9 cm)',
      'Largura das sépalas proporcionalmente ampla',
      'Floração precoce em climas temperados frios',
      'Facilmente separável linearmente das demais',
    ],
    image: setosaImg,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700',
    accentColor: '#059669',
    ranges: {
      sepal_length: [4.3, 5.8],
      sepal_width: [2.3, 4.4],
      petal_length: [1.0, 1.9],
      petal_width: [0.1, 0.6],
    },
    averages: {
      sepal_length: 5.01,
      sepal_width: 3.43,
      petal_length: 1.46,
      petal_width: 0.25,
    },
  },
  Versicolor: {
    code: 1,
    name: 'Iris Versicolor',
    scientificName: 'Iris versicolor L.',
    author: 'Carl Linnaeus',
    description:
      'Conhecida popularmente como Íris Harlequin ou Blue Flag. Possui dimensões intermediárias entre Setosa e Virginica, com pétalas moderadamente desenvolvidas e padrões azul-violeta marcantes.',
    characteristics: [
      'Dimensões intermediárias de pétalas (3.0 a 5.1 cm)',
      'Sépala elegante com veios dourados e brancos',
      'Comum em pântanos e áreas úmidas da América do Norte',
      'Leve sobreposição morfológica com Virginica',
    ],
    image: versicolorImg,
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    badgeText: 'text-sky-700',
    accentColor: '#0284c7',
    ranges: {
      sepal_length: [4.9, 7.0],
      sepal_width: [2.0, 3.4],
      petal_length: [3.0, 5.1],
      petal_width: [1.0, 1.8],
    },
    averages: {
      sepal_length: 5.94,
      sepal_width: 2.77,
      petal_length: 4.26,
      petal_width: 1.33,
    },
  },
  Virginica: {
    code: 2,
    name: 'Iris Virginica',
    scientificName: 'Iris virginica L.',
    author: 'Carl Linnaeus',
    description:
      'A maior das três espécies clássicas em termos de comprimento de pétalas e sépalas. Apresenta pétalas substancialmente longas e sépalas proeminentes em tons violeta-azulados profundos.',
    characteristics: [
      'Pétalas longas e robustas (4.5 a 6.9 cm)',
      'Largura de pétala superior a 1.4 cm',
      'Maior porte biométrico geral da tríade',
      'Frequente em planícies aluviais do leste dos EUA',
    ],
    image: virginicaImg,
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-700',
    accentColor: '#4f46e5',
    ranges: {
      sepal_length: [4.9, 7.9],
      sepal_width: [2.2, 3.8],
      petal_length: [4.5, 6.9],
      petal_width: [1.4, 2.5],
    },
    averages: {
      sepal_length: 6.59,
      sepal_width: 2.97,
      petal_length: 5.55,
      petal_width: 2.03,
    },
  },
};

export interface SamplePreset {
  id: string;
  label: string;
  speciesHint: 'Setosa' | 'Versicolor' | 'Virginica';
  features: IrisFeatures;
  description: string;
}

export const PRESET_SAMPLES: SamplePreset[] = [
  {
    id: 'virginica-default',
    label: 'Exemplo do Modelo (Virginica)',
    speciesHint: 'Virginica',
    features: {
      sepal_length: 6.7,
      sepal_width: 3.0,
      petal_length: 5.2,
      petal_width: 2.3,
    },
    description: 'Valores canônicos do payload de teste fornecido na especificação',
  },
  {
    id: 'setosa-typical',
    label: 'Iris Setosa Típica',
    speciesHint: 'Setosa',
    features: {
      sepal_length: 5.1,
      sepal_width: 3.5,
      petal_length: 1.4,
      petal_width: 0.2,
    },
    description: 'Pétalas diminutas e sépalas amplas características de Setosa',
  },
  {
    id: 'versicolor-typical',
    label: 'Iris Versicolor Típica',
    speciesHint: 'Versicolor',
    features: {
      sepal_length: 5.9,
      sepal_width: 3.0,
      petal_length: 4.2,
      petal_width: 1.5,
    },
    description: 'Dimensões intermediárias características de Versicolor',
  },
  {
    id: 'virginica-large',
    label: 'Iris Virginica Robusta',
    speciesHint: 'Virginica',
    features: {
      sepal_length: 7.2,
      sepal_width: 3.6,
      petal_length: 6.1,
      petal_width: 2.5,
    },
    description: 'Espécime de grandes proporções com pétalas longas',
  },
];

export const REFERENCE_SCATTER_POINTS = [
  // Setosa points (sepal_length, petal_length)
  { sepal: 5.1, petal: 1.4, species: 'Setosa' },
  { sepal: 4.9, petal: 1.4, species: 'Setosa' },
  { sepal: 4.7, petal: 1.3, species: 'Setosa' },
  { sepal: 4.6, petal: 1.5, species: 'Setosa' },
  { sepal: 5.0, petal: 1.4, species: 'Setosa' },
  { sepal: 5.4, petal: 1.7, species: 'Setosa' },
  { sepal: 4.6, petal: 1.4, species: 'Setosa' },
  { sepal: 5.0, petal: 1.5, species: 'Setosa' },
  { sepal: 4.4, petal: 1.4, species: 'Setosa' },
  { sepal: 4.9, petal: 1.5, species: 'Setosa' },
  { sepal: 5.4, petal: 1.5, species: 'Setosa' },
  { sepal: 4.8, petal: 1.6, species: 'Setosa' },

  // Versicolor points
  { sepal: 7.0, petal: 4.7, species: 'Versicolor' },
  { sepal: 6.4, petal: 4.5, species: 'Versicolor' },
  { sepal: 6.9, petal: 4.9, species: 'Versicolor' },
  { sepal: 5.5, petal: 4.0, species: 'Versicolor' },
  { sepal: 6.5, petal: 4.6, species: 'Versicolor' },
  { sepal: 5.7, petal: 4.5, species: 'Versicolor' },
  { sepal: 6.3, petal: 4.7, species: 'Versicolor' },
  { sepal: 4.9, petal: 3.3, species: 'Versicolor' },
  { sepal: 6.6, petal: 4.6, species: 'Versicolor' },
  { sepal: 5.2, petal: 3.9, species: 'Versicolor' },
  { sepal: 5.0, petal: 3.5, species: 'Versicolor' },
  { sepal: 5.9, petal: 4.2, species: 'Versicolor' },

  // Virginica points
  { sepal: 6.3, petal: 6.0, species: 'Virginica' },
  { sepal: 5.8, petal: 5.1, species: 'Virginica' },
  { sepal: 7.1, petal: 5.9, species: 'Virginica' },
  { sepal: 6.3, petal: 5.6, species: 'Virginica' },
  { sepal: 6.5, petal: 5.8, species: 'Virginica' },
  { sepal: 7.6, petal: 6.6, species: 'Virginica' },
  { sepal: 4.9, petal: 4.5, species: 'Virginica' },
  { sepal: 7.3, petal: 6.3, species: 'Virginica' },
  { sepal: 6.7, petal: 5.8, species: 'Virginica' },
  { sepal: 7.2, petal: 6.1, species: 'Virginica' },
  { sepal: 6.5, petal: 5.1, species: 'Virginica' },
  { sepal: 6.4, petal: 5.3, species: 'Virginica' },
  { sepal: 6.8, petal: 5.5, species: 'Virginica' },
  { sepal: 6.7, petal: 5.2, species: 'Virginica' },
];

export const DEFAULT_API_ENDPOINT =
  'https://irisflaskml-fqaagvarhacuehgy.canadacentral-01.azurewebsites.net/api/predict';
