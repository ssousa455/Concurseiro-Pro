import React, { useState } from 'react';
import { Subject, QuestionLog } from '../types';
import { Award, Check, RefreshCw, Layers, ClipboardList, Trash2, Calendar } from 'lucide-react';

interface QuestionTrackerProps {
  subjects: Subject[];
  questionLogs: QuestionLog[];
  onAddQuestionLog: (subjectId: string, topicId: string, totalQuestions: number, correctAnswers: number, notes: string) => void;
  onDeleteQuestionLog: (id: string) => void;
}

export default function QuestionTracker({
  subjects,
  questionLogs,
  onAddQuestionLog,
  onDeleteQuestionLog
}: QuestionTrackerProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [correctAnswers, setCorrectAnswers] = useState(8);
  const [notes, setNotes] = useState('');
  const [errorText, setErrorText] = useState('');

  // Find active subject for topics dropdown list filtering
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);
  const activeTopics = activeSubject?.topics || [];

  // If subject switches, auto-select first topic
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = subjects.find(s => s.id === subjectId);
    if (sub && sub.topics.length > 0) {
      setSelectedTopicId(sub.topics[0].id);
    } else {
      setSelectedTopicId('');
    }
  };

  // Sync first topic on mounting or if empty
  if (selectedSubjectId && !selectedTopicId && activeTopics.length > 0) {
    setSelectedTopicId(activeTopics[0].id);
  }

  const handleSaveLogs = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (correctAnswers > totalQuestions) {
      setErrorText('O número de acertos não pode ser maior que o total de questões!');
      return;
    }

    if (!selectedSubjectId || !selectedTopicId) {
      setErrorText('Selecione uma matéria e um tópico correspondente.');
      return;
    }

    onAddQuestionLog(selectedSubjectId, selectedTopicId, totalQuestions, correctAnswers, notes.trim());

    // Reset notes
    setNotes('');
    setTotalQuestions(10);
    setCorrectAnswers(8);
  };

  const getPercentageColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-600 dark:text-emerald-450';
    if (pct >= 60) return 'text-amber-500 dark:text-amber-450';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="question-tracker">
      {/* 1. Log New Questions Form (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">Registrar Questões</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Insira a quantidade de acertos e erros resolvidos na sua rotina diária</p>
        </div>

        <form onSubmit={handleSaveLogs} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-zinc-505 dark:text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-400" /> Matéria / Disciplina
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-200 font-semibold"
              required
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-505 dark:text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-400" /> Assunto / Tópico
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-200"
              required
            >
              {activeTopics.length === 0 ? (
                <option value="">Sem tópicos cadastrados nesta disciplina.</option>
              ) : (
                activeTopics.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-505 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Questões Resolvidas</label>
              <input
                type="number"
                min="1"
                max="500"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-150 font-bold font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider mb-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">Respostas Corretas (Acertos)</label>
              <input
                type="number"
                min="0"
                max="500"
                value={correctAnswers}
                onChange={(e) => setCorrectAnswers(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-emerald-500 dark:bg-emerald-950/10 font-bold font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-505 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Anotações / Notas / Desempenho</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Errei bobeira sobre crimes afiançáveis, revisar lei dnv..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-300"
            />
          </div>

          {errorText && (
            <p className="text-xs text-red-500 font-mono font-medium">{errorText}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-825 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              id="btn-save-questions"
            >
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              Salvar Registro de Exercícios
            </button>
          </div>
        </form>
      </div>

      {/* 2. Historic Questions Logs (Right) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Histórico de Questões Solvidas
            <span className="text-xs font-normal text-zinc-400 font-mono">Totais acumulados</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Feedback detalhado dos exercícios logados nas últimas sessões</p>
        </div>

        <div className="space-y-3.5 max-h-120 overflow-y-auto pr-1">
          {questionLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-650 bg-white dark:bg-zinc-900">
              <ClipboardList className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-xs font-semibold">Nenhum simulado ou teste logado ainda.</p>
              <p className="text-[10px]">Utilize o painel esquerdo para registrar seus primeiros acertos!</p>
            </div>
          ) : (
            [...questionLogs]
              .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
              .map(log => {
                const pct = Math.round((log.correctAnswers / log.totalQuestions) * 100);
                const subColor = subjects.find(s => s.id === log.subjectId)?.color || '#6366f1';
                
                return (
                  <div 
                    key={log.id} 
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all shadow-3xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: subColor }} />
                        <span className="font-bold text-zinc-900 dark:text-zinc-150 text-sm truncate">{log.subjectName}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-455 font-medium pl-5">{log.topicName}</p>
                      {log.notes && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-5 italic truncate max-w-md">"{log.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-5 sm:pl-0">
                      <div className="text-right flex items-center gap-3 bg-zinc-50 dark:bg-zinc-850 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 font-mono">
                        <div>
                          <p className={`font-bold text-sm ${getPercentageColor(pct)}`}>
                            {log.correctAnswers}/{log.totalQuestions}
                          </p>
                          <p className="text-[9px] text-zinc-400 uppercase font-bold">Respostas</p>
                        </div>
                        <div className="border-l border-zinc-200 dark:border-zinc-700 h-6"></div>
                        <div>
                          <p className={`font-bold text-sm ${getPercentageColor(pct)}`}>
                            {pct}%
                          </p>
                          <p className="text-[9px] text-zinc-400 uppercase font-bold">Acertos</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <div className="text-right text-[10px] text-zinc-400 hidden sm:block">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {log.date.split('-').reverse().join('/')}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja apagar este log de questões?')) {
                              onDeleteQuestionLog(log.id);
                            }
                          }}
                          className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Apagar log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
