import { useState, useEffect } from 'react';
import { Subject, StudySession, QuestionLog, CycleItem, RevisionAlert, Topic } from './types';
import {
  INITIAL_SUBJECTS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_QUESTION_LOGS,
  INITIAL_CYCLE,
  INITIAL_REVISIONS
} from './data/mockData';

// Component Imports
import Dashboard from './components/Dashboard';
import SyllabusManager from './components/SyllabusManager';
import Timer from './components/Timer';
import QuestionTracker from './components/QuestionTracker';
import StudyCycle from './components/StudyCycle';
import RevisionScheduler from './components/RevisionScheduler';
import MiniSimulado from './components/MiniSimulado';

// Icon Imports
import {
  Sun,
  Moon,
  LayoutDashboard,
  BookOpen,
  Clock,
  HelpCircle,
  RefreshCw,
  Bell,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Core application states loaded with mocks
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [studySessions, setStudySessions] = useState<StudySession[]>(INITIAL_STUDY_SESSIONS);
  const [questionLogs, setQuestionLogs] = useState<QuestionLog[]>(INITIAL_QUESTION_LOGS);
  const [cycle, setCycle] = useState<CycleItem[]>(INITIAL_CYCLE);
  const [revisions, setRevisions] = useState<RevisionAlert[]>(INITIAL_REVISIONS);

  // Layout navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'timer' | 'questions' | 'cycle' | 'revisions' | 'simulado'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for study trigger from cycle
  const [triggeredSubjectId, setTriggeredSubjectId] = useState<string | undefined>(undefined);

  // Study targets (highly relatable for Brazilian candidates)
  const [examTarget, setExamTarget] = useState('Receita Federal (Auditor) / TCU');
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(examTarget);

  // Sync isDarkMode class on document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Triggers timer preselection when studying from cycle tab
  const handleTriggerStudyFromCycle = (subjectId: string) => {
    setTriggeredSubjectId(subjectId);
    setActiveTab('timer');
  };

  // 1. TOPIC STATS UPDATE (E.g. Checking Theory, Summary, Review inside syllabus manager)
  const handleUpdateTopic = (subjectId: string, topicId: string, updatedFields: Partial<Topic>) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id !== subjectId) return subject;

      const updatedTopics = subject.topics.map(topic => {
        if (topic.id !== topicId) return topic;
        return { ...topic, ...updatedFields };
      });

      return {
        ...subject,
        topics: updatedTopics
      };
    });

    setSubjects(updatedSubjects);

    // If reviewDone was checked to true, automatically find/complete any matching revision alert!
    if (updatedFields.reviewDone === true) {
      const updatedRevisions = revisions.map(rev => {
        if (rev.subjectId === subjectId && rev.topicId === topicId) {
          return { ...rev, completed: true };
        }
        return rev;
      });
      setRevisions(updatedRevisions);
    }
  };

  // 2. ADD STUDY SESSIONS FROM CHRONOMETER
  const handleAddStudySession = (subjectId: string, durationMinutes: number, notes: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const newSession: StudySession = {
      id: `sh-${Date.now()}`,
      subjectId,
      subjectName: subject.name,
      duration: durationMinutes,
      date: new Date().toISOString().split('T')[0],
      notes: notes || undefined
    };

    // Prepend session log
    setStudySessions([newSession, ...studySessions]);

    // Update parent subject's hours counter
    const updatedSubjects = subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          totalStudyTime: s.totalStudyTime + durationMinutes
        };
      }
      return s;
    });
    setSubjects(updatedSubjects);

    // Create automatically a revision alert in 24 hours!
    // Since spaced review triggers are automatic, we'll append a 24h revision item to the list
    const newRevision: RevisionAlert = {
      id: `rev-${Date.now()}`,
      subjectId,
      subjectName: subject.name,
      topicId: subject.topics[0]?.id || `topic-${subjectId}`,
      topicName: subject.topics[0]?.name || 'Revisão Geral do Assunto',
      type: '24h',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      completed: false
    };
    setRevisions([newRevision, ...revisions]);
  };

  // 3. DELETE STUDY SESSIONS
  const handleDeleteSession = (id: string) => {
    const session = studySessions.find(s => s.id === id);
    if (!session) return;

    const filtered = studySessions.filter(s => s.id !== id);
    setStudySessions(filtered);

    // Decrement from corresponding subject time
    const updatedSubjects = subjects.map(s => {
      if (s.id === session.subjectId) {
        return {
          ...s,
          totalStudyTime: Math.max(0, s.totalStudyTime - session.duration)
        };
      }
      return s;
    });
    setSubjects(updatedSubjects);
  };

  // 4. ADD MANUAL OFFLINE OR SIMULADO QUESTION SOLVED LOG
  const handleAddQuestionLog = (
    subjectId: string,
    topicId: string,
    totalQuestions: number,
    correctAnswers: number,
    notes: string
  ) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const topic = subject.topics.find(t => t.id === topicId);
    const topicName = topic ? topic.name : 'Assunto Geral';

    const newLog: QuestionLog = {
      id: `ql-${Date.now()}`,
      subjectId,
      subjectName: subject.name,
      topicId,
      topicName,
      totalQuestions,
      correctAnswers,
      date: new Date().toISOString().split('T')[0],
      notes: notes || undefined
    };

    setQuestionLogs([newLog, ...questionLogs]);

    // Update subject and topic question totals dynamically
    const updatedSubjects = subjects.map(s => {
      if (s.id !== subjectId) return s;

      const updatedTopics = s.topics.map(t => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          questionsSolved: t.questionsSolved + totalQuestions
        };
      });

      return {
        ...s,
        questionsAttempted: s.questionsAttempted + totalQuestions,
        questionsCorrect: s.questionsCorrect + correctAnswers,
        topics: updatedTopics
      };
    });

    setSubjects(updatedSubjects);
  };

  // 5. DELETE QUESTION LOG
  const handleDeleteQuestionLog = (id: string) => {
    const log = questionLogs.find(q => q.id === id);
    if (!log) return;

    const filtered = questionLogs.filter(q => q.id !== id);
    setQuestionLogs(filtered);

    // Decrement from corresponding subject stats
    const updatedSubjects = subjects.map(s => {
      if (s.id !== log.subjectId) return s;

      const updatedTopics = s.topics.map(t => {
        if (t.id !== log.topicId) return t;
        return {
          ...t,
          questionsSolved: Math.max(0, t.questionsSolved - log.totalQuestions)
        };
      });

      return {
        ...s,
        questionsAttempted: Math.max(0, s.questionsAttempted - log.totalQuestions),
        questionsCorrect: Math.max(0, s.questionsCorrect - log.correctAnswers),
        topics: updatedTopics
      };
    });
    setSubjects(updatedSubjects);
  };

  // 6. ADD SUBJECT
  const handleAddSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name,
      color,
      totalStudyTime: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      topics: []
    };
    setSubjects([...subjects, newSubject]);
  };

  // 7. ADD TOPIC
  const handleAddTopic = (subjectId: string, name: string) => {
    const updatedSubjects = subjects.map(s => {
      if (s.id !== subjectId) return s;
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        name,
        theoryStudied: false,
        summaryCreated: false,
        reviewDone: false,
        questionsSolved: 0
      };
      return {
        ...s,
        topics: [...s.topics, newTopic]
      };
    });
    setSubjects(updatedSubjects);
  };

  // 8. DELETE SUBJECT
  const handleDeleteSubject = (subjectId: string) => {
    const filtered = subjects.filter(s => s.id !== subjectId);
    setSubjects(filtered);
    
    // Also remove matching cycle configurations
    const filteredCycle = cycle.filter(c => c.subjectId !== subjectId);
    setCycle(filteredCycle);
  };

  // 9. COMPLETE REVISION ALERT
  const handleCompleteRevision = (id: string) => {
    const updatedRevisions = revisions.map(rev => {
      if (rev.id === id) {
        // Also update topic state checkbox
        handleUpdateTopic(rev.subjectId, rev.topicId, { reviewDone: true });
        return { ...rev, completed: true };
      }
      return rev;
    });
    setRevisions(updatedRevisions);
  };

  // 10. UPDATE CYCLE
  const handleUpdateCycle = (newCycle: CycleItem[]) => {
    setCycle(newCycle);
  };

  const handleSaveTarget = () => {
    if (tempTarget.trim()) {
      setExamTarget(tempTarget.trim());
    }
    setIsEditingTarget(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Edital', icon: BookOpen },
    { id: 'timer', label: 'Cronômetro', icon: Clock },
    { id: 'questions', label: 'Questões', icon: Award },
    { id: 'cycle', label: 'Ciclo de Estudos', icon: RefreshCw },
    { id: 'revisions', label: 'Revisões', icon: Bell },
    { id: 'simulado', label: 'Simulado Prático', icon: Sparkles }
  ];

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-250 ${
      isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-800'
    }`}>
      {/* 1. Header Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b min-w-0 transition-colors duration-200 ${
        isDarkMode ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md' : 'bg-white/80 border-zinc-200 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* National green-gold badge for Brazil contest theme */}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-amber-400 p-0.5 shadow-sm shrink-0 flex items-center justify-center">
              <div className="h-full w-full bg-zinc-900 rounded-[10px] flex items-center justify-center font-display font-black text-xs text-amber-300">
                AC
              </div>
            </div>
            
            <div className="min-w-0">
              <h1 className="text-sm font-bold font-display tracking-tight leading-none text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Zurc Concursos
                <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold px-1.5 py-0.5 rounded-full">
                  v2.4
                </span>
              </h1>
              {isEditingTarget ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="text"
                    value={tempTarget}
                    onChange={(e) => setTempTarget(e.target.value)}
                    onBlur={handleSaveTarget}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTarget(); }}
                    className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                    autoFocus
                  />
                </div>
              ) : (
                <p 
                  onClick={() => { setTempTarget(examTarget); setIsEditingTarget(true); }}
                  className="text-[11px] text-zinc-450 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs font-semibold cursor-pointer hover:underline flex items-center gap-1 mt-0.5"
                  title="Clique para clicar e editar seu concurso alvo"
                >
                  Foco: <span className="text-zinc-650 dark:text-zinc-350 font-bold">{examTarget}</span>
                </p>
              )}
            </div>
          </div>

          {/* Desktop Links Grid */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer border ${
                    isActive
                      ? isDarkMode
                        ? 'bg-zinc-900 border-zinc-800 text-white shadow-xs'
                        : 'bg-zinc-200/60 border-zinc-300 text-zinc-900 shadow-xs'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/55'
                  }`}
                  id={`nav-${item.id}`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls block */}
          <div className="flex items-center gap-2">
            {/* Dark Mode toggle button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-transparent transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-mono text-zinc-450 hover:text-zinc-650 dark:hover:text-zinc-300"
              title={isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
              id="theme-toggler"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            {/* Mobile Navigation Toggle menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 lg:hidden rounded-xl bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-350"
              id="mobile-menu-toggler"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 bg-zinc-900 relative">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as typeof activeTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-305 hover:bg-zinc-800/40 text-left text-zinc-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* 2. Main Tab View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-20">
        {activeTab === 'dashboard' && (
          <Dashboard
            subjects={subjects}
            studySessions={studySessions}
            questionLogs={questionLogs}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusManager
            subjects={subjects}
            onUpdateTopic={handleUpdateTopic}
            onAddSubject={handleAddSubject}
            onAddTopic={handleAddTopic}
            onDeleteSubject={handleDeleteSubject}
          />
        )}

        {activeTab === 'timer' && (
          <Timer
            subjects={subjects}
            onAddStudySession={handleAddStudySession}
            activeSubjectIdFromCycle={triggeredSubjectId}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionTracker
            subjects={subjects}
            questionLogs={questionLogs}
            onAddQuestionLog={handleAddQuestionLog}
            onDeleteQuestionLog={handleDeleteQuestionLog}
          />
        )}

        {activeTab === 'cycle' && (
          <StudyCycle
            subjects={subjects}
            cycle={cycle}
            onTriggerStudy={handleTriggerStudyFromCycle}
            onUpdateCycle={handleUpdateCycle}
          />
        )}

        {activeTab === 'revisions' && (
          <RevisionScheduler
            subjects={subjects}
            revisions={revisions}
            onCompleteRevision={handleCompleteRevision}
          />
        )}

        {activeTab === 'simulado' && (
          <MiniSimulado
            onAddQuestionLog={handleAddQuestionLog}
          />
        )}
      </main>

      {/* 3. Footer branding info */}
      <footer className={`border-t py-4 text-center text-[10px] font-mono tracking-wide ${
        isDarkMode ? 'border-zinc-900 bg-zinc-950 text-zinc-500' : 'border-zinc-200 bg-white text-zinc-400'
      }`}>
        <p>Desenvolvido com carinho para Aspirantes a Concursos Públicos • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
