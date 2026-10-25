const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { buildSync } = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const manifest = require('./simulator-approved-assets.json');
const schoolGallerySource = fs.readFileSync(path.join(root, 'src/components/simulator/SchoolPatientGallery.tsx'), 'utf8');

for (const asset of manifest.assets) {
  assert.equal(hash(fs.readFileSync(path.join(root, asset.path))), asset.sha256, `Approved asset changed: ${asset.path}`);
}
const bundle = path.join(root, 'node_modules/.cache/simulator-test.cjs');
buildSync({
  stdin: { contents: `export { simulationFolders } from './src/data/simulator';
    export { stopTheBleedCharacters } from './src/data/simulator/stop-the-bleed/characters';
    export { SimulatorCatalog } from './src/components/simulator/SimulatorCatalog';
    export { ClinicalScenario } from './src/components/simulator/ClinicalScenario';
    export { ThemeProvider } from './src/context/ThemeContext';`, resolveDir: root },
  outfile: bundle, bundle: true, platform: 'node', format: 'cjs',
  external: ['react', 'react-dom'], mainFields: ['module', 'main'],
  define: { 'import.meta.env.BASE_URL': '"./"' },
});
global.localStorage = { getItem: () => 'dark' };
const { simulationFolders, stopTheBleedCharacters, SimulatorCatalog, ClinicalScenario, ThemeProvider } = require(bundle);
assert.deepEqual(simulationFolders.map(folder => folder.id), ['academia', 'escola', 'empresa', 'stop-the-bleed']);
assert.equal(simulationFolders[0].cases.length, 120, 'Academia must expose 120 bleeding-control cases');
const existingCase = simulationFolders[2].cases[0];
assert.equal(hash(JSON.stringify(existingCase.steps)), manifest.originalCaseSha256, 'Existing clinical content must remain intact');
assert.notStrictEqual(simulationFolders[1].cases[0], existingCase, 'School cases must remain separate from company cases');
const characters = require('../src/data/simulator/characters.json');
assert.equal(characters.length, 8);
assert.equal(new Set(characters.map(character => character.id)).size, 8);
assert(characters.some(character => character.id === existingCase.characterId));
for (const character of characters) {
  assert.equal(character.eyes.length, 2);
  for (const file of [character.file, character.closedFile]) {
    assert(fs.existsSync(path.join(root, 'public/simulador/personagens/academia-v20261022', file)));
  }
}
const render = component => renderToStaticMarkup(React.createElement(ThemeProvider, null, component));
const stopTheBleedFolder = simulationFolders[3];
const stopTheBleedCharacterIds = new Set(stopTheBleedCharacters.map(character => character.id));
assert.equal(simulationFolders[1].cases.length, 120, 'Escola must expose 120 bleeding-control cases');
assert(simulationFolders[0].cases.every(simulationCase => simulationCase.patientKind === 'academia'), 'Academia cases must use only academy characters');
assert(simulationFolders[1].cases.every(simulationCase => simulationCase.patientKind === 'escola'), 'School cases must use only school characters');
assert(simulationFolders[0].cases.every(simulationCase => !stopTheBleedCharacterIds.has(simulationCase.characterId)), 'Academia cases must not use Stop the Bleed characters');
assert(simulationFolders[1].cases.every(simulationCase => !stopTheBleedCharacterIds.has(simulationCase.characterId)), 'School cases must not use Stop the Bleed characters');
assert(stopTheBleedFolder.cases.every(simulationCase => simulationCase.patientKind === 'stop-the-bleed' && stopTheBleedCharacterIds.has(simulationCase.characterId)), 'Stop the Bleed cases must use only Stop the Bleed characters');
assert(simulationFolders[0].cases.every(simulationCase => simulationCase.id.startsWith('academia-emergencia-')), 'Academia cases must not be Stop the Bleed cases');
assert(simulationFolders[1].cases.every(simulationCase => simulationCase.id.startsWith('escola-emergencia-')), 'School cases must not be Stop the Bleed cases');
assert(simulationFolders[0].cases.every(simulationCase => simulationCase.steps.every(step => !step.bleedingFocus)), 'Academia cases must not contain bleeding or wound scenes');
assert(simulationFolders[1].cases.every(simulationCase => simulationCase.steps.every(step => !step.bleedingFocus)), 'School cases must not contain bleeding or wound scenes');
const contextCaseText = [...simulationFolders[0].cases, ...simulationFolders[1].cases]
  .flatMap(simulationCase => [simulationCase.title, simulationCase.description, ...simulationCase.steps.flatMap(step => [step.scenarioText, step.vitalSigns.status ?? '', ...step.options.map(option => `${option.text} ${option.feedback}`)])])
  .join(' ');
assert(!/\b(sangramento|sangramentos|hemorragia|hemorragias|corte|cortes)\b/i.test(contextCaseText), 'Academia and School cases must not mention bleeding or cuts');
assert(!/\b(sangramento|sangramentos|hemorragia|hemorragias|corte|cortes)\b/i.test(`${simulationFolders[0].description} ${simulationFolders[1].description}`), 'Academia and School folders must not advertise bleeding or cuts');
assert(schoolGallerySource.includes('import.meta.env.BASE_URL'), 'School gallery must resolve assets from the deployed base path');
assert(!schoolGallerySource.includes("open: '/simulador/"), 'School gallery must not use root-absolute asset paths');
for (const file of [
  'professora-sentada.png', 'professora-deitada.png', 'zelador-sentado.png', 'zelador-deitado.png',
  'crianca-menina-sentada.png', 'crianca-menina-deitada.png', 'crianca-menino-sentado.png', 'crianca-menino-deitado.png',
  'bebe-sentado.png', 'bebe-deitado.png',
]) assert(fs.existsSync(path.join(root, 'public/simulador/personagens/escola-horizontal-v20261023', file)), `Missing school asset: ${file}`);
assert.equal(stopTheBleedFolder.cases.length, 80, 'Stop the Bleed must expose 80 cases');
assert(stopTheBleedFolder.cases.every(simulationCase => simulationCase.steps.every(step => step.bleedingFocus)), 'Stop the Bleed cases must expose a clickable bleeding focus');
const catalog = render(React.createElement(SimulatorCatalog));
for (const name of ['Academia', 'Escola', 'Empresa', 'Stop the Bleed', 'Personagens da academia']) assert(catalog.includes(name));
assert.equal((catalog.match(/aria-controls="simulation-folder"/g) || []).length, 4);
const scenario = render(React.createElement(ClinicalScenario, { scenario: existingCase, onBack() {} }));
assert(scenario.includes('Voltar aos casos'));
assert(scenario.includes('canvas'));
const academyScenario = render(React.createElement(ClinicalScenario, { scenario: simulationFolders[0].cases[0], onBack() {} }));
assert(academyScenario.includes('Personagem da academia'));
assert(academyScenario.includes('Condição atual'));
const schoolScenario = render(React.createElement(ClinicalScenario, { scenario: simulationFolders[1].cases[0], onBack() {} }));
assert(schoolScenario.includes('Personagem escolar'));
assert(schoolScenario.includes('Condição atual'));
const stopScenario = render(React.createElement(ClinicalScenario, { scenario: stopTheBleedFolder.cases[0], onBack() {} }));
assert(stopScenario.includes('Stop the Bleed'));
assert.equal(stopTheBleedFolder.cases.filter(simulationCase => simulationCase.patientKind === 'stop-the-bleed').length, 80);
const sharedActionIds = new Set(stopTheBleedFolder.cases.flatMap(simulationCase => simulationCase.steps[0].options.map(option => option.id)));
assert(sharedActionIds.has('shared-tourniquet-limb'));
assert(sharedActionIds.has('shared-do-not-use-powder'));
assert(fs.existsSync(path.join(root, 'public/simulador/personagens/stop-the-bleed/casos/casos-config.json')));
for (const file of ['arterial.svg', 'venous.svg', 'junctional.svg']) assert(fs.existsSync(path.join(root, 'public/simulador/personagens/stop-the-bleed/masks', file)));
assert(stopTheBleedFolder.cases[0].steps[0].bleedingFocus.title.includes('Caso 01'));
for (const option of existingCase.steps[0].options) assert(scenario.includes(option.text));
console.log('PASS: 18 approved files unchanged; 8 characters; 4 folders; original clinical case intact; Stop the Bleed characters, masks, focus and catalog render.');





