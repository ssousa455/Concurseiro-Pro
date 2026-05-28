import { useState } from 'react';
import { Subject, StudySession, QuestionLog } from '../types';
import { BookOpen, HelpCircle, Award, Flame, Calendar, Trash2, Clock, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';

interface DashboardProps {
  subjects: Subject[];
  studySessions: StudySession[];
  questionLogs: QuestionLog[];
  onDeleteSession: (id: string) => void;
}

export default function Dashboard({
  subjects,
  studySessions,
  questionLogs,
  onDeleteSession,
}: DashboardProps) {
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  // 1. Calculate stats
  const totalMinutes = subjects.reduce((acc, s) => acc + s.totalStudyTime, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const totalQuestions = subjects.reduce((acc, s) => acc + s.questionsAttempted, 0);
  const totalCorrect = subjects.reduce((acc, s) => acc + s.questionsCorrect, 0);
  const overallAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : '0';

  const weeklyGoalHours = 25;
  const currentWeekMinutes = studySessions
    .filter(s => {
      // Simple mock check - sessions from the last 7 days from mock dates
      return true; // Use all mock sessions for demonstration
    })
    .reduce((acc, s) => acc + s.duration, 0);
  const currentWeekHours = +(currentWeekMinutes / 60).toFixed(1);
  const goalPercentage = Math.min(Math.round((currentWeekHours / weeklyGoalHours) * 100), 100);

  // 2. Prepare data for weekly bar chart (last 7 days of raw study duration)
  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const dayStudyMap = { 'Seg': 0, 'Ter': 0, 'Qua': 0, 'Qui': 0, 'Sex': 0, 'Sáb': 0, 'Dom': 0 };

  // Populating dates into days of local week
  studySessions.forEach(session => {
    const dateObj = new Date(session.date + 'T00:00:00');
    let dayIndex = dateObj.getDay(); // 0 is Sunday, 1 is Monday ...
    // Convert Sunday=0 to Index 6 (last) and Monday=1 to Index 0
    dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    const dayLabel = daysOfWeek[dayIndex];
    if (dayLabel !== undefined) {
      dayStudyMap[dayLabel as keyof typeof dayStudyMap] += session.duration;
    }
  });

  const barChartData = daysOfWeek.map(day => ({
    name: day,
    minutes: dayStudyMap[day as keyof typeof dayStudyMap],
    hours: +(dayStudyMap[day as keyof typeof dayStudyMap] / 60).toFixed(1)
  }));

  const maxDailyMinutes = Math.max(...barChartData.map(d => d.minutes), 60);

  // 3. Subject distributions
  const subjectDistribution = subjects.map(s => ({
    id: s.id,
    name: s.name,
    color: s.color,
    minutes: s.totalStudyTime,
    percentage: totalMinutes > 0 ? Math.round((s.totalStudyTime / totalMinutes) * 100) : 0,
    questions: s.questionsAttempted,
    accuracy: s.questionsAttempted > 0 ? Math.round((s.questionsCorrect / s.questionsAttempted) * 100) : 0
  })).sort((a, b) => b.minutes - a.minutes);

  // 4. Trend data: accuracy rate trend on recent 6 question logs
  const sortedQuestionLogs = [...questionLogs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-6);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1" id="metrics-grid">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-indigo-500/30" id="card-hours">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">Tempo Total</p>
            <p className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{totalHours}<span className="text-sm font-normal text-zinc-500 ml-1">horas</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-pink-500/30" id="card-questions">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">Questões Respondidas</p>
            <p className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{totalQuestions}<span className="text-sm font-normal text-zinc-500 ml-1">resolvidas</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-emerald-500/30" id="card-accuracy">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">Aproveitamento Geral</p>
            <p className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{overallAccuracy}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-amber-500/30" id="card-streak">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl animate-pulse">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">Ofensiva de Estudos</p>
            <p className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100">12<span className="text-sm font-normal text-zinc-500 ml-1">dias seguidos</span></p>
          </div>
        </div>
      </div>

      {/* 2. Goal Progress Indicator */}
      <div className="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 border border-indigo-100 dark:border-indigo-950 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" id="banner-goal">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-400 uppercase tracking-widest font-mono">Meta Semanal de Estudos</h3>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 max-w-xl text-sm">
            Você estudou <strong className="text-indigo-600 dark:text-indigo-400">{currentWeekHours}h</strong> de um objetivo de <strong className="text-zinc-900 dark:text-white">{weeklyGoalHours}h</strong> planejadas para essa semana. Mantenha o ritmo!
          </p>
        </div>
        <div className="w-full md:w-80 space-y-2 shrink-0">
          <div className="flex justify-between items-end">
            <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium font-mono">Progresso: {goalPercentage}%</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold font-mono">{currentWeekHours}h / {weeklyGoalHours}h</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="charts-container">
        {/* Weekly Activities - 7 days Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between" id="chart-weekly">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-display">Horas Logadas por Dia</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Duração dos estudos na semana corrente</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full font-medium font-mono text-zinc-600 dark:text-zinc-400">Minutos / Dia</span>
          </div>

          <div className="h-64 flex items-end justify-between px-2 pt-4 relative">
            {/* Visual background lines */}
            <div className="absolute inset-x-0 top-4 bottom-0 flex flex-col justify-between pointer-events-none border-b border-zinc-100 dark:border-zinc-900">
              <div className="border-t border-dashed border-zinc-100 dark:border-zinc-800 w-full h-0"></div>
              <div className="border-t border-dashed border-zinc-100 dark:border-zinc-800 w-full h-0"></div>
              <div className="border-t border-dashed border-zinc-100 dark:border-zinc-800 w-full h-0"></div>
            </div>

            {barChartData.map((day) => {
              const heightPct = Math.max(10, Math.min(100, Math.round((day.minutes / maxDailyMinutes) * 100)));
              return (
                <div key={day.name} className="flex flex-col items-center group w-1/8 z-10">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full mb-1 transition-all duration-200 bg-zinc-900 dark:bg-white text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-1 rounded shadow-sm font-mono whitespace-nowrap">
                    {day.minutes > 0 ? `${day.hours}h (${day.minutes} min)` : 'Sem estudo'}
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-10 rounded-t-lg bg-zinc-150 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 h-48 flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-indigo-600 dark:bg-indigo-500 rounded-t-lg transition-all duration-700 ease-out origin-bottom group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  {/* Label */}
                  <span className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 font-mono">{day.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Distribution Side Visual Block */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between" id="chart-distribution">
          <div>
            <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-display">Distribuição do Estudo</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">Porcentagem proporcional estudada por matéria</p>
          </div>

          <div className="space-y-4">
            {subjectDistribution.map(item => (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl border border-transparent transition-all cursor-pointer ${
                  hoveredSubject === item.id 
                    ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 shadow-3xs scale-101' 
                    : ''
                }`}
                onMouseEnter={() => setHoveredSubject(item.id)}
                onMouseLeave={() => setHoveredSubject(null)}
              >
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">
                    {item.percentage}% ({Math.round(item.minutes / 60)}h)
                  </span>
                </div>
                {/* Visual Progress percentage */}
                <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`, 
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                {hoveredSubject === item.id && (
                  <div className="flex justify-between mt-2 pt-1 border-t border-dashed border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-500 font-mono">
                    <span>Questões: <strong className="text-zinc-700 dark:text-zinc-300">{item.questions}</strong></span>
                    <span>Acerto: <strong className="text-emerald-600 dark:text-emerald-400">{item.accuracy}%</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Accuracy Trend and Recent Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="bottom-grid">
        {/* Recent Performance trend area */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between" id="performance-history">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-display">Desempenho Recente</h4>
              <span className="p-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-md">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Aproveitamento nos últimos simulados por matéria da semana</p>
          </div>

          {/* SVG line trend chart */}
          <div className="my-6 h-36 flex items-end justify-center relative">
            {sortedQuestionLogs.length > 1 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                {/* Horizontal guide lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-zinc-800" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-zinc-800" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-zinc-800" />

                {/* SVG path of the line */}
                {(() => {
                  const points = sortedQuestionLogs.map((log, i) => {
                    const pct = (log.correctAnswers / log.totalQuestions) * 100;
                    // Map x from 0 to 400 across logs
                    const x = (i / (sortedQuestionLogs.length - 1)) * 360 + 20;
                    // Map y. Higher accuracy (100) -> smaller Y (closer to 10), lower (0) -> larger Y (110)
                    const y = 110 - (pct / 100) * 95;
                    return { x, y, pct, log };
                  });

                  const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
                  const fillD = `${pathD} L ${points[points.length - 1].x} 115 L ${points[0].x} 115 Z`;

                  return (
                    <>
                      {/* Gradient fill */}
                      <path d={fillD} fill="url(#accuracyGradient)" opacity="0.15" />
                      {/* Stroke line */}
                      <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                      {/* Point Dots */}
                      {points.map((p, index) => (
                        <g key={index} className="group/dot cursor-pointer">
                          <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" className="dark:stroke-zinc-900 group-hover/dot:r-7 transition-all duration-150" />
                          <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="9" fill="#71717a" className="dark:fill-zinc-400 font-mono font-bold opacity-0 group-hover/dot:opacity-100 transition-opacity bg-zinc-900">
                            {p.pct.toFixed(0)}%
                          </text>
                        </g>
                      ))}
                      {/* Defs definition for gradient */}
                      <defs>
                        <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </>
                  );
                })()}
              </svg>
            ) : (
              <div className="text-zinc-400 text-xs text-center font-mono py-12">Registros de questões insuficientes para gerar histórico.</div>
            )}
          </div>

          {/* List recent simulated results */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sortedQuestionLogs.map(log => {
              const pct = Math.round((log.correctAnswers / log.totalQuestions) * 100);
              return (
                <div key={log.id} className="flex justify-between items-center p-2 rounded-lg bg-zinc-55 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">{log.subjectName}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{log.topicName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-semibold font-mono ${pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {log.correctAnswers}/{log.totalQuestions} ({pct}%)
                    </span>
                    <p className="text-[9px] text-zinc-400 font-mono">{log.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Study Sessions Logs */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between" id="sessions-history">
          <div>
            <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-display mb-1 flex items-center justify-between">
              Histórico de Sessões de Estudo
              <span className="text-xs text-zinc-400 font-normal font-mono">Últimos logs</span>
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Registro automático de sessões completas do cronômetro</p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {studySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-600">
                <BookOpen className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-medium">Nenhuma sessão de estudo gravada.</p>
                <p className="text-[10px]">Ligue o cronômetro para adicionar sessões!</p>
              </div>
            ) : (
              [...studySessions]
                .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
                .slice(0, 5)
                .map(session => {
                  const subColor = subjects.find(s => s.id === session.subjectId)?.color || '#9ca3af';
                  const dateStr = new Date(session.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
                  return (
                    <div key={session.id} className="flex justify-between items-center p-3.5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Dot */}
                        <span 
                          className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" 
                          style={{ backgroundColor: subColor }} 
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm truncate">{session.subjectName}</p>
                          {session.notes && <p className="text-xs text-zinc-650 dark:text-zinc-400 truncate max-w-sm">{session.notes}</p>}
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {dateStr}</span>
                            <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 font-bold">{session.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1 px-2 text-zinc-400 hover:text-red-500 rounded-lg transition-all"
                        id={`btn-del-${session.id}`}
                        title="Deletar sessão de estudo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
