import { gymCases } from './academia';
import { schoolCases } from './escola';
import { companyCases } from './empresa';
import { stopTheBleedCases } from './stop-the-bleed';
import type { SimulationCase, SimulationEnvironment } from './types';
export const simulationFolders: { id: SimulationEnvironment; name: string; description: string; cases: SimulationCase[] }[] = [
  { id: 'academia', name: 'Academia', description: 'Atendimento no ambiente de atividade física.', cases: gymCases },
  { id: 'escola', name: 'Escola', description: 'Atendimento no ambiente escolar.', cases: schoolCases },
  { id: 'empresa', name: 'Empresa', description: 'Atendimento no ambiente de trabalho.', cases: companyCases },
  { id: 'stop-the-bleed', name: 'Stop the Bleed', description: 'Seis cenários de rua e clube de tiro para reconhecer hemorragias graves. Clique na máscara de corte para ampliar.', cases: stopTheBleedCases },
];

