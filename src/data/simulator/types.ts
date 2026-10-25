export interface SimulationStep {
  id: number;
  phase: string;
  scenarioText: string;
  vitalSigns: {
    consciousness: string;
    breathing: string;
    circulation: string;
    bleeding?: string;
    status?: string;
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
  mask?: string;
  woundShape?: 'laceration' | 'puncture' | 'controlled';
  visibleRegion?: string;
  skinExposed?: boolean;
}

export type SimulationEnvironment = 'academia' | 'escola' | 'empresa' | 'stop-the-bleed';
export interface SimulationCase {
  id: string;
  title: string;
  description: string;
  characterId: string;
  patientKind?: 'default' | 'academia' | 'escola' | 'stop-the-bleed';
  steps: SimulationStep[];
}

