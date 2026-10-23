import { useState } from 'react';
import { Building2, ChevronRight, Dumbbell, FolderOpen, School } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { simulationFolders } from '../../data/simulator';
import type { SimulationCase, SimulationEnvironment } from '../../data/simulator/types';
import { ClinicalScenario } from './ClinicalScenario';
import { CharacterGallery } from './CharacterGallery';
const environmentIcons = { academia: Dumbbell, escola: School, empresa: Building2 };
export const SimulatorCatalog = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [environment, setEnvironment] = useState<SimulationEnvironment>('academia');
  const [activeCase, setActiveCase] = useState<SimulationCase | null>(null);
  const folder = simulationFolders.find(item => item.id === environment)!;
  if (activeCase) return <ClinicalScenario key={activeCase.id} scenario={activeCase} onBack={() => setActiveCase(null)} />;
  return <div className={`min-h-full p-4 sm:p-6 lg:p-8 ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${dark ? 'text-emerald-400' : 'text-emerald-700'}`}>União · prática</p>
        <h1 className="text-2xl font-bold sm:text-3xl">Simulador</h1>
        <p className="mt-2 text-sm opacity-70">Escolha o ambiente para acessar os casos.</p>
      </header>
      <nav className="grid gap-3 sm:grid-cols-3" aria-label="Pastas de casos do simulador">
        {simulationFolders.map(item => {
          const Icon = environmentIcons[item.id];
          const selected = item.id === environment;
          return <button key={item.id} type="button" aria-pressed={selected} aria-controls="simulation-folder" onClick={() => setEnvironment(item.id)}
            className={`rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${selected ? 'border-emerald-600 bg-emerald-700 text-white' : dark ? 'border-slate-700 bg-slate-900 hover:border-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-600'}`}>
            <div className="mb-4 flex items-center justify-between"><Icon size={25} aria-hidden="true" /><FolderOpen size={18} aria-hidden="true" /></div>
            <span className="block text-lg font-bold">{item.name}</span>
            <span className="mt-1 block text-sm opacity-80">{item.cases.length} {item.cases.length === 1 ? 'caso disponível' : 'casos disponíveis'}</span>
          </button>;
        })}
      </nav>
      <section id="simulation-folder" aria-labelledby="folder-title" className="mt-7">
        <h2 id="folder-title" className="text-xl font-bold">{folder.name}</h2>
        <p className="mt-1 text-sm opacity-70">{folder.description}</p>
        {folder.cases.length ? <div className="mt-4 grid gap-3">
          {folder.cases.map(scenario => <button key={scenario.id} type="button" onClick={() => setActiveCase(scenario)}
            className={`flex items-center justify-between gap-4 rounded-xl border p-5 text-left transition-colors ${dark ? 'border-slate-700 bg-slate-900 hover:border-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-600'}`}>
            <span><span className="block font-bold">{scenario.title}</span><span className="mt-1 block text-sm opacity-70">{scenario.description}</span><span className="mt-3 block text-xs font-semibold">{scenario.steps.length} etapas · Iniciar caso</span></span>
            <ChevronRight className="shrink-0" size={22} aria-hidden="true" />
          </button>)}
        </div> : <p role="status" className={`mt-4 rounded-xl border border-dashed p-5 text-sm ${dark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-600'}`}>Nenhum caso clínico disponível nesta pasta.</p>}
      </section>
      {environment === 'academia' && <CharacterGallery />}
    </div>
  </div>;
};
