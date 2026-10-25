import type { BleedingFocus } from '../../data/simulator/types';
import { StopTheBleedSimulator } from './StopTheBleedSimulator';

export function StopTheBleedScene({ characterId }: { characterId: string; focus?: BleedingFocus }) {
  return <StopTheBleedSimulator caseId={characterId} />;
}
