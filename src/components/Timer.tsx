import React, { useState, useEffect, useRef } from 'react';
import { Subject } from '../types';
import { Play, Pause, RotateCcw, Check, Clock, Edit3, Save, Compass } from 'lucide-react';

interface TimerProps {
  subjects: Subject[];
  onAddStudySession: (subjectId: string, durationMinutes: number, notes: string) => void;
  activeSubjectIdFromCycle?: string; // Optional trigger when studying from cycle
}

export default function Timer({ subjects, onAddStudySession, activeSubjectIdFromCycle }: TimerProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [timerMode, setTimerMode] = useState<'free' | 'pomodoro'>('free');
  const [pomodoroLength, setPomodoroLength] = useState(25); // minutes

  // Active status
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with cycle triggers if requested
  useEffect(() => {
    if (activeSubjectIdFromCycle) {
      setSelectedSubjectId(activeSubjectIdFromCycle);
    }
  }, [activeSubjectIdFromCycle]);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const totalTargetSecs = timerMode === 'pomodoro' ? pomodoroLength * 60 : 0;
  const currentSecs = timerMode === 'pomodoro' ? Math.max(0, totalTargetSecs - secondsElapsed) : secondsElapsed;

  // Format display mm:ss
  const formatTime = (totalSecs: number) => {
    const mm = Math.floor(totalSecs / 60);
    const ss = totalSecs % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      // Pause
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      // Start
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          // If pomodoro completes, trigger audio feedback/end
          if (timerMode === 'pomodoro' && prev >= totalTargetSecs - 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Complete
            setShowLogForm(true);
            return totalTargetSecs;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsElapsed(0);
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (secondsElapsed > 5) {
      // Show form if they studied at least 5 seconds
      setShowLogForm(true);
    } else {
      alert("Esforce-se um pouco mais! Faça pelo menos alguns minutos antes de salvar a sessão.");
      setSecondsElapsed(0);
    }
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
    onAddStudySession(selectedSubjectId, durationMinutes, sessionNotes.trim());
    
    // reset states
    setShowLogForm(false);
    setSecondsElapsed(0);
    setSessionNotes('');
  };

  // Target Subject detail matching
  const targetSubject = subjects.find(s => s.id === selectedSubjectId);
  const strokeColor = targetSubject ? targetSubject.color : '#6366f1';

  // Circle visual radial progress percentage (dashOffset calculations)
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const progressRatio = timerMode === 'pomodoro' 
    ? (totalTargetSecs > 0 ? (secondsElapsed / totalTargetSecs) : 0)
    : (secondsElapsed % 3600) / 3600; // Free timer does a lap every 60 minutes
  const strokeDashoffset = circumference - (progressRatio * circumference);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-sm animate-fade-in" id="study-chronometer">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Cronômetro de Estudos
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Registre suas sessões líquidas focado nas disciplinas do seu edital</p>
      </div>

      {!showLogForm ? (
        <div className="space-y-6">
          {/* Options Panel selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200/50 dark:border-zinc-750">
            <button
              onClick={() => { if (!isRunning) { setTimerMode('free'); setSecondsElapsed(0); } }}
              disabled={isRunning}
              className={`py-2 px-3.5 text-xs font-semibold rounded-xl transition-all ${
                timerMode === 'free'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-150 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-750 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer disabled:opacity-50'
              }`}
            >
              Livre / Progressivo
            </button>
            <button
              onClick={() => { if (!isRunning) { setTimerMode('pomodoro'); setSecondsElapsed(0); } }}
              disabled={isRunning}
              className={`py-2 px-3.5 text-xs font-semibold rounded-xl transition-all ${
                timerMode === 'pomodoro'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-150 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-750 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer disabled:opacity-50'
              }`}
            >
              Pomodoro (Meta)
            </button>
          </div>

          {/* Form controllers for mode specifics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Matéria de Estudo</label>
              <select
                disabled={isRunning}
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-200 font-medium"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Configurar Tempo</label>
              {timerMode === 'pomodoro' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    disabled={isRunning}
                    value={pomodoroLength}
                    onChange={(e) => { setPomodoroLength(Number(e.target.value)); setSecondsElapsed(0); }}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 w-12 text-right shrink-0">{pomodoroLength} min</span>
                </div>
              ) : (
                <div className="py-2 px-3 text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-150 dark:border-zinc-800/60 font-medium select-none">
                  Livre: Cronômetro incrementa.
                </div>
              )}
            </div>
          </div>

          {/* Dynamic ticking screen dial */}
          <div className="flex flex-col items-center justify-center py-6 relative">
            <svg className="w-56 h-56 transform -rotate-90 select-none pointer-events-none" viewBox="0 0 200 200">
              {/* Dial Track backdrop */}
              <circle
                cx="100"
                cy="100"
                r={circleRadius}
                fill="transparent"
                stroke="#f4f4f5"
                strokeWidth="8"
                className="dark:stroke-zinc-800"
              />
              {/* Dial Active Fill */}
              <circle
                cx="100"
                cy="100"
                r={circleRadius}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>

            {/* Inner text values */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-100 ${isRunning ? 'animate-pulse' : ''}`} id="timer-display">
                {formatTime(currentSecs)}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-1.5 flex items-center gap-1 font-mono">
                <Compass className="w-3.5 h-3.5" style={{ color: strokeColor }} />
                {targetSubject?.name || 'Selecione'}
              </span>
            </div>
          </div>

          {/* Chrono Buttons bar */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-650 dark:text-zinc-300 rounded-full transition-all cursor-pointer shadow-xs border border-zinc-200/40 dark:border-zinc-700/40"
              title="Resetar tempo"
              id="btn-timer-reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleStartStop}
              className={`p-5 rounded-full text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center`}
              style={{ backgroundColor: strokeColor }}
              id="btn-timer-play-pause"
            >
              {isRunning ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleCompleteSession}
              className="p-3 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-400 rounded-full transition-all cursor-pointer shadow-xs border border-indigo-100/50 dark:border-indigo-900/30"
              title="Concluir e Salvar sessão"
              id="btn-timer-complete"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Log dialog form panel */
        <form onSubmit={handleSaveSession} className="space-y-5 animate-slide-in">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl flex items-center gap-3">
            <span className="bg-emerald-500 text-white rounded-full p-1 leading-none">
              <Check className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">Excelente! Ciclo concluído!</p>
              <p className="text-[11px] text-zinc-550 dark:text-zinc-400">Você estudou <strong className="font-bold">{Math.round(secondsElapsed / 60)} minutos</strong> de <strong className="text-zinc-850 dark:text-emerald-300 font-semibold">{targetSubject?.name}</strong>.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" /> Notas da Sessão (Opcional)
            </label>
            <textarea
              rows={3}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Ex: Resolvi o assunto de Organização do Estado, fiz resumo das competências concorrentes da União..."
              className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-150 resize-hidden leading-relaxed"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => { setShowLogForm(false); setSecondsElapsed(0); }}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-all cursor-pointer"
            >
              Parar sem salvar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xs cursor-pointer"
              id="btn-timer-save"
            >
              <Save className="w-4 h-4" />
              Salvar Sessão
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
