export interface Topic {
  id: string;
  name: string;
  theoryStudied: boolean; // ✅ Teoria
  summaryCreated: boolean; // 📝 Resumo
  reviewDone: boolean; // 🔄 Revisão
  questionsSolved: number; // Qtd Questões Resolvidas
}

export interface Subject {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex for graphics
  topics: Topic[];
  totalStudyTime: number; // in minutes
  questionsAttempted: number;
  questionsCorrect: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  duration: number; // in minutes
  date: string; // ISO date string YYYY-MM-DD
  notes?: string;
}

export interface QuestionLog {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface CycleItem {
  id: string;
  subjectId: string;
  hours: number;
  color: string;
}

export interface RevisionAlert {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  type: '24h' | '7d' | '30d';
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  subjectName: string;
  topicName: string;
  bank: string; // e.g., "FCC", "Cebraspe", "FGV"
  year: string;
  enunciation: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
