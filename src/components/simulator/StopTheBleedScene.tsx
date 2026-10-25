import type { BleedingFocus } from '../../data/simulator/types';
import { stopTheBleedCharacterById } from '../../data/simulator/stop-the-bleed/characters';
import { StopTheBleedSimulator } from './StopTheBleedSimulator';

export function StopTheBleedScene({ characterId }: { characterId: string; focus?: BleedingFocus }) {
  // Never fall back to STB case 01 when another environment accidentally
  // reaches this renderer with an academy/school character id.
  if (!stopTheBleedCharacterById[characterId]) {
    return <p role="alert">Personagem Stop the Bleed indisponível para este caso.</p>;
  }
  return <StopTheBleedSimulator caseId={characterId} />;
}
