import { useState } from 'react';
import { Subject, RevisionAlert } from '../types';
import { Bell, Check, Calendar, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';

interface RevisionSchedulerProps {
  subjects: Subject[];
  revisions: RevisionAlert[];
  onCompleteRevision: (id: string) => void;
}

export default function RevisionScheduler({
  subjects,
  revisions,
  onCompleteRevision
}: RevisionSchedulerProps) {
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('pending');

  const filteredRevisions = revisions.filter(rev => {
    if (filterType === 'pending') return !rev.completed;
    if (filterType === 'completed') return rev.completed;
    return true; // ‘all’
  });

  const getRevisionTypeLabel = (type: '24h' | '7d' | '30d') => {
    switch (type) {
      case '24h': return { text: 'Revisão de 24h', style: 'bg-red-50 text-red-700 border-red-205 dark:bg-red-950/20 dark:text-red-400' };
      case '7d': return { text: 'Revisão de 7 dias', style: 'bg-amber-50 text-amber-700 border-amber-205 dark:bg-amber-950/20 dark:text-amber-400' };
      case '30d': return { text: 'Revisão de 30 dias', style: 'bg-indigo-50 text-indigo-700 border-indigo-205 dark:bg-indigo-950/20 dark:text-indigo-400' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="revision-scheduler">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-650 dark:text-indigo-400 animate-swing" />
            Alerta de Revisões Espaçadas
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Ciclo de revisões científicas automáticas de 24h, 7 dias e 30 dias</p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200/50 dark:border-zinc-750 shrink-0 font-mono">
          <button
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'pending'
                ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-3xs'
                : 'text-zinc-500 hover:text-zinc-750 dark:text-zinc-400'
            }`}
          >
            A Fazer ({revisions.filter(r => !r.completed).length})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'completed'
                ? 'bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-200 shadow-3xs'
                : 'text-zinc-500 hover:text-zinc-750 dark:text-zinc-400'
            }`}
          >
            Concluídas
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-200 shadow-3xs'
                : 'text-zinc-500 hover:text-zinc-750 dark:text-zinc-400'
            }`}
          >
            Ver Todas
          </button>
        </div>
      </div>

      {/* Revision Alerts Main Box */}
      <div className="space-y-3">
        {filteredRevisions.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-650">
            <Check className="w-10 h-10 p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full mb-3 stroke-4" />
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nenhuma revisão pendente para hoje!</p>
            <p className="text-xs max-w-xs mt-1">Sua memória de longo prazo agradece. Continue estudando!</p>
          </div>
        ) : (
          filteredRevisions.map(rev => {
            const tag = getRevisionTypeLabel(rev.type);
            const subColor = subjects.find(s => s.id === rev.subjectId)?.color || '#6366f1';
            const dateStr = new Date(rev.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

            return (
              <div 
                key={rev.id} 
                className={`p-4 bg-white dark:bg-zinc-900 border rounded-2xl shadow-3xs flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all ${
                  rev.completed 
                    ? 'border-zinc-150 dark:border-zinc-850 opacity-60' 
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: subColor }} />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${tag.style}`}>
                        {tag.text}
                      </span>
                      {new Date(rev.dueDate + 'T00:00:00') <= new Date() && !rev.completed && (
                        <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-650 dark:text-red-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 font-mono">
                          <AlertCircle className="w-2.5 h-2.5" /> ATRASADO
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-zinc-850 dark:text-zinc-200 text-sm truncate">{rev.subjectName}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 truncate pl-0.5">{rev.topicName}</p>
                    <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      Prazo: {dateStr}
                    </div>
                  </div>
                </div>

                <div className="flex md:items-center justify-between md:justify-end gap-4 shrink-0 font-mono">
                  {rev.completed ? (
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5">
                      <Check className="w-4 h-4 stroke-3 text-emerald-500" />
                      Revisado
                    </div>
                  ) : (
                    <button
                      onClick={() => onCompleteRevision(rev.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-775 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      id={`btn-complete-rev-${rev.id}`}
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      Concluir Revisão
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* revision system info blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Gatilho 24 Horas</span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">Fixa o conteúdo na memória de curto prazo imediatamente após o primeiro contato teórico para evitar a curva de esquecimento inicial.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Gatilho 7 Dias</span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">Realizada através de questões rápidas e leitura de esquemas mentais. Reativa as conexões sinápticas cruciais obtidas.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Gatilho 30 Dias</span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">Transfere as informações de vez para a memória profunda (longo prazo). Essencial para manter matérias unidas até o dia da prova.</p>
        </div>
      </div>
    </div>
  );
}
