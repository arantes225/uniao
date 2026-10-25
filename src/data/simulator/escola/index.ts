import { workshopBleeding } from '../empresa/hemorragia-oficina';
import { schoolCases as generatedSchoolCases } from '../contextCases';

// O caso de oficina continua canônico e compartilhado com a pasta Empresa;
// os 119 casos seguintes ampliam o treino específico do ambiente escolar.
export const schoolCases = [workshopBleeding, ...generatedSchoolCases.slice(0, 119)];
