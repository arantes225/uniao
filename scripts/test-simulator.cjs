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

for (const asset of manifest.assets) {
  assert.equal(hash(fs.readFileSync(path.join(root, asset.path))), asset.sha256, `Approved asset changed: ${asset.path}`);
}
const bundle = path.join(root, 'node_modules/.cache/simulator-test.cjs');
buildSync({
  stdin: { contents: `export { simulationFolders } from './src/data/simulator';
    export { SimulatorCatalog } from './src/components/simulator/SimulatorCatalog';
    export { ClinicalScenario } from './src/components/simulator/ClinicalScenario';
    export { ThemeProvider } from './src/context/ThemeContext';`, resolveDir: root },
  outfile: bundle, bundle: true, platform: 'node', format: 'cjs',
  external: ['react', 'react-dom'], mainFields: ['module', 'main'],
  define: { 'import.meta.env.BASE_URL': '"./"' },
});
global.localStorage = { getItem: () => 'dark' };
const { simulationFolders, SimulatorCatalog, ClinicalScenario, ThemeProvider } = require(bundle);
assert.deepEqual(simulationFolders.map(folder => folder.id), ['academia', 'escola', 'empresa', 'stop-the-bleed']);
assert.equal(simulationFolders[0].cases.length, 0, 'Do not invent gym cases');
const existingCase = simulationFolders[2].cases[0];
assert.equal(hash(JSON.stringify(existingCase.steps)), manifest.originalCaseSha256, 'Existing clinical content must remain intact');
assert.strictEqual(simulationFolders[1].cases[0], existingCase, 'Shared workshop case must have one canonical definition');
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
assert.equal(stopTheBleedFolder.cases.length, 6);
assert(stopTheBleedFolder.cases.every(simulationCase => simulationCase.steps.every(step => step.bleedingFocus)), 'Stop the Bleed cases must expose a clickable bleeding focus');
const catalog = render(React.createElement(SimulatorCatalog));
for (const name of ['Academia', 'Escola', 'Empresa', 'Stop the Bleed', 'Personagens da academia']) assert(catalog.includes(name));
assert.equal((catalog.match(/aria-controls="simulation-folder"/g) || []).length, 4);
const scenario = render(React.createElement(ClinicalScenario, { scenario: existingCase, onBack() {} }));
assert(scenario.includes('Voltar aos casos'));
assert(scenario.includes('canvas'));
const stopScenario = render(React.createElement(ClinicalScenario, { scenario: stopTheBleedFolder.cases[0], onBack() {} }));
assert(stopScenario.includes('Clique na máscara de corte para ampliar'));
assert.equal(stopTheBleedFolder.cases.filter(simulationCase => simulationCase.patientKind === 'stop-the-bleed').length, 6);
for (const file of ['stb-rua-ciclista-coxa.png', 'stb-rua-vidro-antebraco.png', 'stb-rua-juncao-virilha.png', 'stb-clube-braco.png', 'stb-clube-perna.png', 'stb-clube-axila.png']) assert(fs.existsSync(path.join(root, 'public/simulador/personagens/stop-the-bleed', file)));
for (const file of ['arterial.svg', 'venous.svg', 'junctional.svg']) assert(fs.existsSync(path.join(root, 'public/simulador/personagens/stop-the-bleed/masks', file)));
assert.equal(stopTheBleedFolder.cases[0].steps[0].bleedingFocus.title, 'Sangramento arterial na coxa');
for (const option of existingCase.steps[0].options) assert(scenario.includes(option.text));
console.log('PASS: 18 approved files unchanged; 8 characters; 4 folders; original clinical case intact; Stop the Bleed characters, masks, focus and catalog render.');



