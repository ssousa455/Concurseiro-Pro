import React, { useState } from 'react';
import { Subject, CycleItem } from '../types';
import { RefreshCw, Play, Edit3, Save, Info, Plus, Trash2 } from 'lucide-react';

interface StudyCycleProps {
  subjects: Subject[];
  cycle: CycleItem[];
  onTriggerStudy: (subjectId: string) => void;
  onUpdateCycle: (newCycle: CycleItem[]) => void;
}

export default function StudyCycle({
  subjects,
  cycle,
  onTriggerStudy,
  onUpdateCycle
}: StudyCycleProps) {
  const [editingWeights, setEditingWeights] = useState(false);
  const [cycleMinutesMap, setCycleMinutesMap] = useState<Record<string, number>>({});
  const [newCycleSubId, setNewCycleSubId] = useState(subjects[0]?.id || '');
  const [newCycleHours, setNewCycleHours] = useState(1);

  // Active highlighted item index of study cycle (simulated for current session)
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);

  const startEditWeights = () => {
    const hoursMap: Record<string, number> = {};
    cycle.forEach(c => {
      hoursMap[c.id] = c.hours;
    });
    setCycleMinutesMap(hoursMap);
    setEditingWeights(true);
  };

  const saveWeights = () => {
    const updatedCycle = cycle.map(item => ({
      ...item,
      hours: cycleMinutesMap[item.id] !== undefined ? cycleMinutesMap[item.id] : item.hours
    }));
    onUpdateCycle(updatedCycle);
    setEditingWeights(false);
  };

  const handleCreateCycleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCycleSubId) return;
    
    const matchedSubject = subjects.find(s => s.id === newCycleSubId);
    if (!matchedSubject) return;

    // Map color or pick standard bg color
    const tailwindColorsList = [
      'bg-indigo-500', 'bg-blue-500', 'bg-pink-500', 'bg-emerald-500', 
      'bg-amber-500', 'bg-purple-500', 'bg-red-500', 'bg-fuchsia-500'
    ];
    // Select color based on subject or random from list
    const rColor = tailwindColorsList[cycle.length % tailwindColorsList.length];

    const newItem: CycleItem = {
      id: `cy-${Date.now()}`,
      subjectId: newCycleSubId,
      hours: newCycleHours,
      color: rColor
    };

    onUpdateCycle([...cycle, newItem]);
  };

  const handleDeleteCycleItem = (id: string) => {
    const filtered = cycle.filter(item => item.id !== id);
    onUpdateCycle(filtered);
    if (currentCycleIndex >= filtered.length && filtered.length > 0) {
      setCurrentCycleIndex(0);
    }
  };

  const handleNextInCycle = () => {
    if (cycle.length > 1) {
      setCurrentCycleIndex((currentCycleIndex + 1) % cycle.length);
    }
  };

  const currentActiveItem = cycle[currentCycleIndex];
  const currentActiveSubject = currentActiveItem ? subjects.find(s => s.id === currentActiveItem.subjectId) : null;

  return (
    <div className="space-y-6 animate-fade-in" id="study-cycle">
      {/* Description Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Ciclo de Estudos Dinâmico
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Alternância eficiente de matérias para fixação constante de longo prazo</p>
        </div>
        <div className="flex gap-2">
          {editingWeights ? (
            <button
              onClick={saveWeights}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Ciclo
            </button>
          ) : (
            <button
              onClick={startEditWeights}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all border border-zinc-200/40 dark:border-zinc-700/40 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Horas
            </button>
          )}
        </div>
      </div>

      {/* Cycle Informative Banner */}
      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <strong>Como funciona:</strong> Ao invés de uma rotina semanal rígida de dias específicos, o ciclo de estudos propõe estudar uma matéria por vez na ordem abaixo. Se você parar na metade de uma matéria ontem, reinsira de onde parou hoje. Isso evita acumular matérias difíceis e aumenta a sua aprovação.
        </p>
      </div>

      {/* Active Studying Block Focus */}
      {currentActiveSubject && (
        <div className="border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-center gap-6" id="active-cycle-focus">
          <div className="space-y-2">
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-widest">
              Em Destaque no Ciclo ({currentCycleIndex + 1} de {cycle.length})
            </span>
            <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
              {currentActiveSubject.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
              Você deve programar <strong className="font-bold text-zinc-700 dark:text-zinc-300 font-mono">{currentActiveItem.hours} horas</strong> de estudo concentrado para esta disciplina antes de pular para o próximo bloco.
            </p>
          </div>

          <div className="flex gap-2.5 w-full md:w-auto font-mono">
            <button
              onClick={handleNextInCycle}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-750 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Pular / Avançar
            </button>
            <button
              onClick={() => onTriggerStudy(currentActiveItem.subjectId)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg"
              id="btn-trigger-study-cycle"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Estudar Matéria
            </button>
          </div>
        </div>
      )}

      {/* Grid of Cycle Elements */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Estrutura Sequencial do Ciclo</label>
        
        {/* Dynamic Horizontal bar timeline */}
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-2.5 flex items-center gap-1.5 overflow-hidden border border-zinc-200/40 dark:border-zinc-750/30">
          {cycle.length === 0 ? (
            <div className="text-xs text-zinc-450 italic py-2 text-center w-full font-medium select-none">Adicione matérias ao seu ciclo de estudos abaixo!</div>
          ) : (
            cycle.map((item, idx) => {
              const matchedSub = subjects.find(s => s.id === item.subjectId);
              const isActive = idx === currentCycleIndex;

              return (
                <div 
                  key={item.id}
                  onClick={() => setCurrentCycleIndex(idx)}
                  className={`h-11 rounded-xl transition-all flex items-center justify-center text-white text-xs font-bold font-mono cursor-pointer grow relative group overflow-hidden ${item.color} ${
                    isActive ? 'ring-3 ring-indigo-500 scale-102 z-10 font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ flexGrow: item.hours }}
                  title={`${matchedSub?.name || 'Matéria'} - ${item.hours}h`}
                >
                  <span>{matchedSub?.name ? matchedSub.name.slice(0, 3).toUpperCase() : 'SUB'}</span>
                  {/* Subtle hover effect to show hours */}
                  <span className="absolute bottom-0.5 right-1 text-[8px] opacity-80">{item.hours}h</span>
                </div>
              );
            })
          )}
        </div>

        {/* List layout of Cycle Items showing weight inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-3xs">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-display flex items-center justify-between">
              Disciplinas do Ciclo
              <span className="text-[10px] font-mono text-zinc-400 font-normal">Sempre sequencial</span>
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cycle.map((item, idx) => {
                const sub = subjects.find(s => s.id === item.subjectId);
                const isActive = idx === currentCycleIndex;

                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isActive 
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/15 border-indigo-200 dark:border-indigo-900/40' 
                        : 'bg-zinc-50 dark:bg-zinc-800/20 border-zinc-150 dark:border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-3 h-3 rounded-md shrink-0 ${item.color}`} />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-40">{sub?.name || 'Disciplina'}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      {editingWeights ? (
                        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="12"
                            value={cycleMinutesMap[item.id] !== undefined ? cycleMinutesMap[item.id] : item.hours}
                            onChange={(e) => setCycleMinutesMap({
                              ...cycleMinutesMap,
                              [item.id]: Math.max(0.5, parseFloat(e.target.value) || 0.5)
                            })}
                            className="w-12 text-center text-xs p-1 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                          />
                          <span className="text-[10px] pr-2 font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-850 p-1 font-semibold">horas</span>
                        </div>
                      ) : (
                        <span className="font-bold text-zinc-650 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg text-[11px]">
                          {item.hours}h
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteCycleItem(item.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 rounded-lg"
                        title="Remover do ciclo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form to insert new items into cycle */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-display mb-3">Inserir Matéria no Ciclo</h3>
            
            <form onSubmit={handleCreateCycleItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-widest mb-1 font-mono">Matéria a Inserir</label>
                <select
                  value={newCycleSubId}
                  onChange={(e) => setNewCycleSubId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-350"
                  required
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-widest mb-1 grid grid-cols-2 font-mono">
                  <span>Meta de Duração</span>
                  <span className="text-right text-indigo-600 dark:text-indigo-400 font-bold">{newCycleHours}h</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.5"
                  value={newCycleHours}
                  onChange={(e) => setNewCycleHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                id="btn-add-to-cycle"
              >
                <Plus className="w-4 h-4" />
                Adicionar Matéria ao Ciclo
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
