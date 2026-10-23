export interface SimulationStep {
  id: number;
  phase: string;
  scenarioText: string;
  vitalSigns: {
    consciousness: string;
    breathing: string;
    circulation: string;
    bleeding: string;
  };
  options: {
    id: string;
    text: string;
    type: 'essential' | 'adequate' | 'incorrect' | 'critical_error';
    feedback: string;
    score: number;
  }[];
}

export type SimulationEnvironment = 'academia' | 'escola' | 'empresa';
export interface SimulationCase {
  id: string;
  title: string;
  description: string;
  characterId: string;
  steps: SimulationStep[];
}
