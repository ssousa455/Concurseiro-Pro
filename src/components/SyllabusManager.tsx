import React, { useState } from 'react';
import { Subject, Topic } from '../types';
import { ChevronDown, ChevronUp, Plus, Check, BookOpen, FileText, CheckCircle2, Award, Trash2 } from 'lucide-react';

interface SyllabusManagerProps {
  subjects: Subject[];
  onUpdateTopic: (subjectId: string, topicId: string, updatedFields: Partial<Topic>) => void;
  onAddSubject: (name: string, color: string) => void;
  onAddTopic: (subjectId: string, name: string) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export default function SyllabusManager({
  subjects,
  onUpdateTopic,
  onAddSubject,
  onAddTopic,
  onDeleteSubject
}: SyllabusManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>('dir-const');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#3b82f6');
  const [newTopicNames, setNewTopicNames] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const colors = [
    { value: '#6366f1', name: 'Indigo' },
    { value: '#3b82f6', name: 'Blue' },
    { value: '#ec4899', name: 'Pink' },
    { value: '#10b981', name: 'Emerald' },
    { value: '#f59e0b', name: 'Amber' },
    { value: '#ef4444', name: 'Red' },
    { value: '#8b5cf6', name: 'Purple' }
  ];

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim(), newSubjectColor);
      setNewSubjectName('');
      setShowAddForm(false);
    }
  };

  const handleCreateTopic = (subjectId: string) => {
    const topicName = newTopicNames[subjectId];
    if (topicName && topicName.trim()) {
      onAddTopic(subjectId, topicName.trim());
      setNewTopicNames({ ...newTopicNames, [subjectId]: '' });
    }
  };

  // Helper to calculate subject progress percentage
  const getSubjectProgress = (subject: Subject) => {
    if (subject.topics.length === 0) return 0;
    // Let's count completion. Theory, summary, review each equal 1 point out of 3 total points per topic.
    const totalPoints = subject.topics.length * 3;
    let earnedPoints = 0;
    subject.topics.forEach(t => {
      if (t.theoryStudied) earnedPoints += 1;
      if (t.summaryCreated) earnedPoints += 1;
      if (t.reviewDone) earnedPoints += 1;
    });
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="syllabus-manager">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">Edital Esquematizado</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Gerencie disciplinas e marque seu progresso no edital oficial</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
          id="btn-new-subject"
        >
          <Plus className="w-4 h-4" />
          Nova Disciplina
        </button>
      </div>

      {/* Add New Subject Form */}
      {showAddForm && (
        <form onSubmit={handleCreateSubject} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-6 shadow-xs space-y-4 animate-slide-in">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-display">Adicionar Nova Disciplina</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Nome da Disciplina</label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ex: Direito Penal ou Estatística"
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-150"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Cor de Destaque</label>
              <div className="flex items-center gap-2.5 h-10">
                {colors.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setNewSubjectColor(c.value)}
                    className={`w-6.5 h-6.5 rounded-full transition-all flex items-center justify-center ${
                      newSubjectColor === c.value ? 'scale-120 ring-2 ring-offset-2 ring-indigo-500' : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {newSubjectColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all"
            >
              Criar Disciplina
            </button>
          </div>
        </form>
      )}

      {/* Accordion list */}
      <div className="space-y-3.5">
        {subjects.map(subject => {
          const isExpanded = expandedId === subject.id;
          const progress = getSubjectProgress(subject);
          const totalHours = (subject.totalStudyTime / 60).toFixed(1);

          return (
            <div 
              key={subject.id} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              id={`subject-item-${subject.id}`}
            >
              {/* Header block */}
              <div 
                onClick={() => handleToggleExpand(subject.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Subject Left Indicator Block */}
                  <span 
                    className="w-3.5 h-11 rounded-full shrink-0" 
                    style={{ backgroundColor: subject.color }} 
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2 truncate">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      {subject.topics.length} tópicos cadastrados • {totalHours} horas estudadas
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  {/* Progress Meter bar */}
                  <div className="flex items-center gap-3 w-40 sm:w-36">
                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progress}%`, 
                          backgroundColor: subject.color 
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-650 dark:text-zinc-300 w-10 text-right">{progress}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Trash Button for deletion */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Tem certeza que deseja remover ${subject.name}? Tudo será apagado.`)) {
                          onDeleteSubject(subject.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 transition-all"
                      title="Apagar matéria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                  </div>
                </div>
              </div>

              {/* Topics Details Checklist inside accordion */}
              {isExpanded && (
                <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-5 space-y-4 animate-slide-in">
                  {/* Active Topics table list */}
                  <div className="space-y-2">
                    {subject.topics.length === 0 ? (
                      <p className="text-xs text-center text-zinc-400 dark:text-zinc-650 py-4 font-medium italic">Nenhum edital cadastrado para esta disciplina. Adicione abaixo!</p>
                    ) : (
                      subject.topics.map(topic => (
                        <div 
                          key={topic.id} 
                          className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850/80 rounded-xl"
                        >
                          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 max-w-xl flex-1">
                            {topic.name}
                          </span>

                          {/* Checklist Buttons columns */}
                          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 font-mono">
                            {/* Teoria ✅ */}
                            <button
                              onClick={() => onUpdateTopic(subject.id, topic.id, { theoryStudied: !topic.theoryStudied })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                                topic.theoryStudied
                                  ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40'
                                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Teoria
                              {topic.theoryStudied && <span className="text-[9px] bg-indigo-200/50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1 rounded">ok</span>}
                            </button>

                            {/* Resumo 📝 */}
                            <button
                              onClick={() => onUpdateTopic(subject.id, topic.id, { summaryCreated: !topic.summaryCreated })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                                topic.summaryCreated
                                  ? 'bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/40'
                                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Resumo
                              {topic.summaryCreated && <span className="text-[9px] bg-pink-200/50 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-1 rounded">ok</span>}
                            </button>

                            {/* Revisão 🔄 */}
                            <button
                              onClick={() => onUpdateTopic(subject.id, topic.id, { reviewDone: !topic.reviewDone })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                                topic.reviewDone
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Revisão
                              {topic.reviewDone && <span className="text-[9px] bg-emerald-200/50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-1 rounded">ok</span>}
                            </button>

                            {/* Questions Count clicker */}
                            <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                              <span className="bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1.5 text-[10px] uppercase font-bold text-zinc-550 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
                                <Award className="w-3 h-3" /> Qst:
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={topic.questionsSolved}
                                onChange={(e) => onUpdateTopic(subject.id, topic.id, { questionsSolved: Math.max(0, parseInt(e.target.value) || 0) })}
                                className="w-14 px-2 py-1 text-center text-xs bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Topic Inline Input */}
                  <div className="flex items-center gap-2 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                    <input
                      type="text"
                      value={newTopicNames[subject.id] || ''}
                      onChange={(e) => setNewTopicNames({ ...newTopicNames, [subject.id]: e.target.value })}
                      placeholder="Adicionar novo tópico do edital a esta matéria..."
                      className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-zinc-700 dark:text-zinc-300"
                    />
                    <button
                      onClick={() => handleCreateTopic(subject.id)}
                      className="p-2 bg-zinc-850 dark:bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all cursor-pointer shrink-0"
                      title="Salvar tópico"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
