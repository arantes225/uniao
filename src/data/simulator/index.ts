import { gymCases } from './academia';
import { schoolCases } from './escola';
import { companyCases } from './empresa';
import { stopTheBleedCases } from './stop-the-bleed';
import type { SimulationCase, SimulationEnvironment } from './types';
export const simulationFolders: { id: SimulationEnvironment; name: string; description: string; cases: SimulationCase[] }[] = [
  { id: 'academia', name: 'Academia', description: '120 cenários de controle de hemorragias em musculação, cardio, aulas coletivas, piscina e atividades externas.', cases: gymCases },
  { id: 'escola', name: 'Escola', description: '120 cenários de controle de hemorragias em sala, pátio, recreio, cantina, quadra e transporte escolar.', cases: schoolCases },
  { id: 'empresa', name: 'Empresa', description: 'Atendimento no ambiente de trabalho.', cases: companyCases },
  { id: 'stop-the-bleed', name: 'Stop the Bleed', description: '80 cenários fotográficos e variações de treino para controle de hemorragias com pressão, packing e torniquete.', cases: stopTheBleedCases },
];


