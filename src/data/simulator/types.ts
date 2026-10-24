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
  bleedingFocus?: BleedingFocus;
  options: {
    id: string;
    text: string;
    type: 'essential' | 'adequate' | 'incorrect' | 'critical_error';
    feedback: string;
    score: number;
  }[];
}

export interface BleedingFocus {
  x: number;
  y: number;
  size: number;
  kind: 'arterial' | 'venous' | 'junctional' | 'controlled';
  title: string;
  appearance: string;
  action: string;
}

export type SimulationEnvironment = 'academia' | 'escola' | 'empresa' | 'stop-the-bleed';
export interface SimulationCase {
  id: string;
  title: string;
  description: string;
  characterId: string;
  steps: SimulationStep[];
}

