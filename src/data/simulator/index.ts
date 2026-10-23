import { gymCases } from './academia';
import { schoolCases } from './escola';
import { companyCases } from './empresa';
import type { SimulationCase, SimulationEnvironment } from './types';
export const simulationFolders: { id: SimulationEnvironment; name: string; description: string; cases: SimulationCase[] }[] = [
  { id: 'academia', name: 'Academia', description: 'Atendimento no ambiente de atividade física.', cases: gymCases },
  { id: 'escola', name: 'Escola', description: 'Atendimento no ambiente escolar.', cases: schoolCases },
  { id: 'empresa', name: 'Empresa', description: 'Atendimento no ambiente de trabalho.', cases: companyCases },
];
