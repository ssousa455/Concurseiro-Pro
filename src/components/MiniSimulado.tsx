import { useState } from 'react';
import { QuizQuestion } from '../types';
import { SAMPLE_QUESTIONS } from '../data/mockData';
import { Award, CheckCircle, XCircle, HelpCircle, ArrowRight, RotateCcw, Send, AlertTriangle } from 'lucide-react';

interface MiniSimuladoProps {
  onAddQuestionLog: (subjectId: string, topicId: string, totalQuestions: number, correctAnswers: number, notes: string) => void;
}

export default function MiniSimulado({ onAddQuestionLog }: MiniSimuladoProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(SAMPLE_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [simuladoAnswers, setSimuladoAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [scoreLogged, setScoreLogged] = useState(false);

  const question = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (!isAnswered) {
      setSelectedOption(idx);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedOption !== null && !isAnswered) {
      setIsAnswered(true);
      setSimuladoAnswers({
        ...simuladoAnswers,
        [question.id]: selectedOption
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Calculate scores
  const totalQuestionsScored = questions.length;
  const correctCount = questions.reduce((acc, q) => {
    const answeredIdx = simuladoAnswers[q.id];
    return answeredIdx === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const hitRate = Math.round((correctCount / totalQuestionsScored) * 105); // dynamic rate representation

  const handleRestart = () => {
    setSimuladoAnswers({});
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setScoreLogged(false);
  };

  const handleLogScoreToDashboard = () => {
    if (scoreLogged) return;
    
    // Log overall simulado to Direito Administrativo topic or Direito Constitucional
    // We will register it under 'dir-const' or whatever matches, representing the quiz
    onAddQuestionLog(
      'dir-const', 
      'dc-1', 
      totalQuestionsScored, 
      correctCount, 
      'Simulado rápido interativo realizado na plataforma.'
    );
    setScoreLogged(true);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-xs" id="mini-simulado">
      {!isFinished ? (
        <div className="space-y-6" id="simulado-active-screen">
          {/* Header Progress Counter */}
          <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-650 dark:text-indigo-400">
                Simulado Interativo de Concursos
              </span>
              <h3 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mt-0.5">
                Questão {currentIdx + 1} de {questions.length}
              </h3>
            </div>
            
            {/* Visual Mini Progress dots */}
            <div className="flex gap-1.5 font-mono">
              {questions.map((q, i) => {
                const answer = simuladoAnswers[q.id];
                const isCurrent = i === currentIdx;
                const isCorrect = answer !== undefined ? answer === q.correctIndex : null;

                return (
                  <span 
                    key={q.id}
                    className={`h-2.5 rounded-full transition-all ${
                      isCurrent 
                        ? 'w-6 bg-indigo-500' 
                        : isCorrect === true
                          ? 'w-2.5 bg-emerald-500'
                          : isCorrect === false
                            ? 'w-2.5 bg-red-500'
                            : 'w-2.5 bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bank Origin Info */}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold font-mono">
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded-xl uppercase">
              Banca: {question.bank}
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-450 px-2.5 py-1 rounded-xl">
              Ano: {question.year}
            </span>
            <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
              {question.subjectName}
            </span>
          </div>

          {/* Question Enunciation text */}
          <div className="bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-150 dark:border-zinc-800/80 p-5 rounded-2xl leading-relaxed text-zinc-800 dark:text-zinc-200 text-sm font-sans" id="question-enunciation">
            {question.enunciation}
          </div>

          {/* Options Selection list */}
          <div className="space-y-3 font-sans">
            {question.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i); // A, B, C, D, E
              const isSelected = selectedOption === i;
              
              // Evaluation styles
              let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850';
              let letterStyle = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';

              if (isAnswered) {
                if (i === question.correctIndex) {
                  // Correct alternative
                  btnStyle = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450';
                  letterStyle = 'bg-emerald-500 text-white';
                } else if (isSelected) {
                  // Selected is incorrect
                  btnStyle = 'border-red-400 dark:border-red-650 bg-red-50/40 dark:bg-red-950/20 text-red-700 dark:text-red-400';
                  letterStyle = 'bg-red-500 text-white';
                } else {
                  // Others when answered
                  btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-902 text-zinc-400 dark:text-zinc-600 opacity-60';
                }
              } else if (isSelected) {
                // Not answered but selected
                btnStyle = 'border-indigo-500 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400';
                letterStyle = 'bg-indigo-600 text-white';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-all outline-hidden text-xs cursor-pointer ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${letterStyle}`}>
                    {letter}
                  </span>
                  <span className="leading-relaxed pt-0.5 font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Correct Explanation & feedback panels */}
          {isAnswered && (
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 space-y-2 animate-slide-in" id="explanation-box">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                {selectedOption === question.correctIndex ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Gabarito Correto !</span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" /> Gabarito Incorreto</span>
                )}
              </h4>
              <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-sans pt-1">
                <strong className="font-semibold block text-zinc-700 dark:text-zinc-250 mb-1 font-sans">Gabarito comentado:</strong>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Action buttons panel */}
          <div className="flex justify-end pt-2">
            {!isAnswered ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedOption === null}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-755 text-white disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                id="btn-submit-answer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Responder Questão
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer font-mono"
                id="btn-next-question"
              >
                Próxima Questão
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Final score block layout */
        <div className="text-center space-y-6 py-6 animate-scale-in" id="simulado-finished-screen">
          <div className="flex justify-center flex-col items-center">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-full mb-4 animate-bounce">
              <Award className="w-12 h-12 stroke-1.5" />
            </div>
            <h3 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">Simulado Finalizado!</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">Você completou todas as questões do teste rápido de treinamento.</p>
          </div>

          {/* Dynamic Score Widget */}
          <div className="bg-zinc-50 dark:bg-zinc-850/30 border border-zinc-150 dark:border-zinc-800 max-w-xs mx-auto rounded-2xl p-5 shadow-3xs font-mono">
            <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-bold mb-2">Seu Aproveitamento</p>
            <p className="text-4xl font-bold text-zinc-850 dark:text-zinc-150">
              {correctCount} <span className="text-lg text-zinc-400 font-normal">/ {totalQuestionsScored}</span>
            </p>
            
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  correctCount / totalQuestionsScored >= 0.75 ? 'bg-emerald-500' : correctCount / totalQuestionsScored >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${(correctCount / totalQuestionsScored) * 100}%` }}
              />
            </div>
            
            <p className="text-[10px] text-zinc-400 mt-2 font-bold">{Math.round((correctCount / totalQuestionsScored) * 100)}% de acertos</p>
          </div>

          {/* Instructions to dynamic submit */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans flex gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>Deseja computar este aproveitamento diretamente nos seus gráficos e estatísticas gerais? Clique no botão abaixo para adicionar estes {correctCount} acertos às suas métricas!</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 font-mono">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all border border-zinc-200/40 dark:border-zinc-700/40 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Refazer Simulado
              </button>

              <button
                onClick={handleLogScoreToDashboard}
                disabled={scoreLogged}
                className={`flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  scoreLogged 
                    ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 disabled:opacity-100' 
                    : 'bg-indigo-650 hover:bg-indigo-500 text-white'
                }`}
                id="btn-log-quiz-score"
              >
                {scoreLogged ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Pontuações Enviadas!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Pontuação ao Painel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
