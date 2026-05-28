import { Subject, StudySession, QuestionLog, CycleItem, RevisionAlert, QuizQuestion } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'dir-const',
    name: 'Direito Constitucional',
    color: '#6366f1', // Indigo
    totalStudyTime: 1980, // 33 hours
    questionsAttempted: 320,
    questionsCorrect: 262,
    topics: [
      { id: 'dc-1', name: 'Direitos e Garantias Fundamentais (Art. 5º ao 17)', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 120 },
      { id: 'dc-2', name: 'Organização do Estado (Art. 18 ao 43)', theoryStudied: true, summaryCreated: true, reviewDone: false, questionsSolved: 80 },
      { id: 'dc-3', name: 'Organização dos Poderes (Art. 44 ao 135)', theoryStudied: false, summaryCreated: false, reviewDone: false, questionsSolved: 40 },
      { id: 'dc-4', name: 'Controle de Constitucionalidade', theoryStudied: true, summaryCreated: false, reviewDone: false, questionsSolved: 50 },
      { id: 'dc-5', name: 'Defesa do Estado e das Instituições Democráticas', theoryStudied: false, summaryCreated: false, reviewDone: false, questionsSolved: 30 }
    ]
  },
  {
    id: 'dir-admin',
    name: 'Direito Administrativo',
    color: '#3b82f6', // Blue
    totalStudyTime: 1620, // 27 hours
    questionsAttempted: 280,
    questionsCorrect: 218,
    topics: [
      { id: 'da-1', name: 'Princípios da Administração Pública (LIMPE)', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 90 },
      { id: 'da-2', name: 'Atos Administrativos (Atributos, Elementos, Extinção)', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 95 },
      { id: 'da-3', name: 'Licitações e Contratos Administrativos (Lei 14.133/21)', theoryStudied: true, summaryCreated: false, reviewDone: false, questionsSolved: 45 },
      { id: 'da-4', name: 'Agentes Públicos e Regime Jurídico Único (Lei 8.112/90)', theoryStudied: false, summaryCreated: false, reviewDone: false, questionsSolved: 50 }
    ]
  },
  {
    id: 'port',
    name: 'Língua Portuguesa',
    color: '#ec4899', // Pink
    totalStudyTime: 2100, // 35 hours
    questionsAttempted: 450,
    questionsCorrect: 351,
    topics: [
      { id: 'pt-1', name: 'Ortografia Oficial e Acentuação Gráfica', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 100 },
      { id: 'pt-2', name: 'Sintaxe da Oração e do Período', theoryStudied: true, summaryCreated: true, reviewDone: false, questionsSolved: 150 },
      { id: 'pt-3', name: 'Regência Nominal e Verbal. Crase', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 110 },
      { id: 'pt-4', name: 'Coesão, Coerência e Interpretação de Textos', theoryStudied: false, summaryCreated: false, reviewDone: false, questionsSolved: 90 }
    ]
  },
  {
    id: 'rlm',
    name: 'Raciocínio Lógico-Matemático',
    color: '#10b981', // Emerald
    totalStudyTime: 1200, // 20 hours
    questionsAttempted: 210,
    questionsCorrect: 155,
    topics: [
      { id: 'rl-1', name: 'Lógica de Proposições e Conectivos Lógicos', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 80 },
      { id: 'rl-2', name: 'Equivalências e Negações Lógicas', theoryStudied: true, summaryCreated: true, reviewDone: false, questionsSolved: 60 },
      { id: 'rl-3', name: 'Análise Combinatória e Probabilidade', theoryStudied: false, summaryCreated: false, reviewDone: false, questionsSolved: 40 },
      { id: 'rl-4', name: 'Conjuntos Lógicos e Diagramas de Venn', theoryStudied: true, summaryCreated: false, reviewDone: false, questionsSolved: 30 }
    ]
  },
  {
    id: 'info',
    name: 'Informática',
    color: '#f59e0b', // Amber
    totalStudyTime: 720, // 12 hours
    questionsAttempted: 140,
    questionsCorrect: 102,
    topics: [
      { id: 'if-1', name: 'Conceito de Internet, Intranet e Redes de Computadores', theoryStudied: true, summaryCreated: false, reviewDone: false, questionsSolved: 50 },
      { id: 'if-2', name: 'Segurança da Informação (Vírus, Backup, Criptografia)', theoryStudied: true, summaryCreated: true, reviewDone: true, questionsSolved: 60 },
      { id: 'if-3', name: 'Sistemas Operacionais (Windows 11 e Linux)', theoryStudied: false, summaryCreated: false, reviewDone: false, questionsSolved: 30 }
    ]
  }
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  { id: 'sh-1', subjectId: 'dir-const', subjectName: 'Direito Constitucional', duration: 90, date: '2026-05-22', notes: 'Estudo focado no Artigo 5º da CF, com destaque para remédios constitucionais.' },
  { id: 'sh-2', subjectId: 'port', subjectName: 'Língua Portuguesa', duration: 60, date: '2026-05-22', notes: 'Revisão de regência verbal e exercício sobre crase.' },
  { id: 'sh-3', subjectId: 'dir-admin', subjectName: 'Direito Administrativo', duration: 120, date: '2026-05-23', notes: 'Lei 14.133/21: Modalidades de licitação (concorrência, pregão e leilão).' },
  { id: 'sh-4', subjectId: 'rlm', subjectName: 'Raciocínio Lógico-Matemático', duration: 90, date: '2026-05-24', notes: 'Tabela verdade, implicação e equivalência lógica.' },
  { id: 'sh-5', subjectId: 'info', subjectName: 'Informática', duration: 45, date: '2026-05-25', notes: 'Segurança da informação: Malwares comuns e ferramentas de prevenção.' },
  { id: 'sh-6', subjectId: 'dir-const', subjectName: 'Direito Constitucional', duration: 110, date: '2026-05-26', notes: 'Organização do Estado e repartição de competências.' },
  { id: 'sh-7', subjectId: 'port', subjectName: 'Língua Portuguesa', duration: 75, date: '2026-05-27', notes: 'Estudo intensivo de sintaxe do período e conjunções subordinativas.' },
  { id: 'sh-8', subjectId: 'dir-admin', subjectName: 'Direito Administrativo', duration: 80, date: '2026-05-27', notes: 'Atos Administrativos: Elementos/requisitos de validade (Competência, Finalidade, Forma, Motivo, Objeto).' },
  { id: 'sh-9', subjectId: 'rlm', subjectName: 'Raciocínio Lógico-Matemático', duration: 50, date: '2026-05-28', notes: 'Negações de proposições compostas (Leis de De Morgan).' }
];

export const INITIAL_QUESTION_LOGS: QuestionLog[] = [
  { id: 'ql-1', subjectId: 'dir-const', subjectName: 'Direito Constitucional', topicId: 'dc-1', topicName: 'Direitos e Garantias Fundamentais (Art. 5º ao 17)', totalQuestions: 30, correctAnswers: 26, date: '2026-05-22', notes: 'Simulado focado em remédios constitucionais.' },
  { id: 'ql-2', subjectId: 'port', subjectName: 'Língua Portuguesa', topicId: 'pt-3', topicName: 'Regência Nominal e Verbal. Crase', totalQuestions: 25, correctAnswers: 18, date: '2026-05-23', notes: 'Crase pós-verbos transitivos e pronomes.' },
  { id: 'ql-3', subjectId: 'dir-admin', subjectName: 'Direito Administrativo', topicId: 'da-2', topicName: 'Atos Administrativos (Atributos, Elementos, Extinção)', totalQuestions: 40, correctAnswers: 34, date: '2026-05-24', notes: 'Atos administrativos discricionários e vinculados.' },
  { id: 'ql-4', subjectId: 'rlm', subjectName: 'Raciocínio Lógico-Matemático', topicId: 'rl-1', topicName: 'Lógica de Proposições e Conectivos Lógicos', totalQuestions: 20, correctAnswers: 15, date: '2026-05-25', notes: 'Questões de tabela verdade no site QConcursos.' },
  { id: 'ql-5', subjectId: 'info', subjectName: 'Informática', topicId: 'if-2', topicName: 'Segurança da Informação (Vírus, Backup, Criptografia)', totalQuestions: 15, correctAnswers: 12, date: '2026-05-26', notes: 'Ataques de phishing e engenharia social.' },
  { id: 'ql-6', subjectId: 'dir-const', subjectName: 'Direito Constitucional', topicId: 'dc-2', topicName: 'Organização do Estado (Art. 18 ao 43)', totalQuestions: 35, correctAnswers: 28, date: '2026-05-27', notes: 'Banca FGV - Competências exclusivas e concorrentes.' }
];

export const INITIAL_CYCLE: CycleItem[] = [
  { id: 'cy-1', subjectId: 'dir-const', hours: 2.0, color: 'bg-indigo-500' },
  { id: 'cy-2', subjectId: 'port', hours: 1.5, color: 'bg-pink-500' },
  { id: 'cy-3', subjectId: 'dir-admin', hours: 2.0, color: 'bg-blue-500' },
  { id: 'cy-4', subjectId: 'rlm', hours: 1.0, color: 'bg-emerald-500' },
  { id: 'cy-5', subjectId: 'info', hours: 1.0, color: 'bg-amber-500' }
];

export const INITIAL_REVISIONS: RevisionAlert[] = [
  { id: 'rev-1', subjectId: 'dir-const', subjectName: 'Direito Constitucional', topicId: 'dc-1', topicName: 'Direitos e Garantias Fundamentais (Art. 5º ao 17)', type: '24h', dueDate: '2026-05-28', completed: false },
  { id: 'rev-2', subjectId: 'dir-admin', subjectName: 'Direito Administrativo', topicId: 'da-2', topicName: 'Atos Administrativos (Atributos, Elementos, Extinção)', type: '7d', dueDate: '2026-05-28', completed: false },
  { id: 'rev-3', subjectId: 'port', subjectName: 'Língua Portuguesa', topicId: 'pt-1', topicName: 'Ortografia Oficial e Acentuação Gráfica', type: '30d', dueDate: '2026-05-28', completed: false },
  { id: 'rev-4', subjectId: 'rlm', subjectName: 'Raciocínio Lógico-Matemático', topicId: 'rl-2', topicName: 'Equivalências e Negações Lógicas', type: '7d', dueDate: '2026-05-29', completed: false }
];

export const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    subjectName: 'Direito Administrativo',
    topicName: 'Princípios da Administração Pública',
    bank: 'FGV',
    year: '2024',
    enunciation: 'No que concerne aos princípios expressos da Administração Pública na Constituição Federal de 1988 (Art. 37, caput), assinale a opção que indica o princípio voltado a coibir favoritismos, perseguições ou discriminações de cunho pessoal por parte de agentes estatais na execução de políticas ou serviços públicos:',
    options: [
      'Princípio da Legalidade',
      'Princípio da Impessoalidade',
      'Princípio da Moralidade',
      'Princípio da Publicidade',
      'Princípio da Eficiência'
    ],
    correctIndex: 1,
    explanation: 'O princípio da Impessoalidade (Art. 37, caput) veda favoritismos, protecionismos ou perseguições gratuitas pela Administração Pública. Os atos administrativos devem visar exclusivamente o interesse público e não a promoção pessoal ou prejuízo direcionado a pessoas específicas.'
  },
  {
    id: 'q-2',
    subjectName: 'Direito Constitucional',
    topicName: 'Direitos e Garantias Fundamentais',
    bank: 'Cebraspe',
    year: '2025',
    enunciation: 'Acerca dos direitos e garantias expressos na Constituição da República, determine qual dos seguintes remédios constitucionais é isento de custas no tocante ao ajuizamento, garantindo a defesa de direitos relativos à liberdade de locomoção quando ameaçada por ilegalidade ou abuso de poder:',
    options: [
      'Mandado de Segurança',
      'Habeas Data',
      'Ação Popular',
      'Habeas Corpus',
      'Mandado de Injunção'
    ],
    correctIndex: 3,
    explanation: 'Conforme estabelecido no Artigo 5º, inciso LXXVII da CF/88, são gratuitas as ações de Habeas Corpus e Habeas Data, sendo que o Habeas Corpus protege expressamente o direito de locomoção (ir, vir e permanecer).'
  },
  {
    id: 'q-3',
    subjectName: 'Língua Portuguesa',
    topicName: 'Regência Nominal e Verbal. Crase',
    bank: 'FCC',
    year: '2024',
    enunciation: 'O sinal indicativo de crase está empregado em absoluta conformidade com as normas gramaticais de regência na seguinte frase:',
    options: [
      'Muitos candidatos se recusavam à fazer anotações de estudo no papel.',
      'O professor se referia à todas as matérias de informática de forma entusiasmada.',
      'Entregamos a premiação à vencedora do simulado de Direito Constitucional.',
      'O cronômetro disparou à uma hora da madrugada inesperadamente.',
      'A dedicação diária à qualidades importantes levará à sua aprovação.'
    ],
    correctIndex: 2,
    explanation: 'Em "Entregamos a premiação à vencedora", quem entrega, entrega algo (a premiação) a alguém (à vencedora). O substantivo "vencedora" exige artigo feminino "a", que se funde com a preposição "a", resultando em crase ("à"). Nos demais itens, há crase antes de verbo (fazer), antes de pronome indefinido (todas), antes de artigo indefinido (uma) ou substantivo no plural com crase singular.'
  },
  {
    id: 'q-4',
    subjectName: 'Direito Administrativo',
    topicName: 'Atos Administrativos',
    bank: 'FGV',
    year: '2025',
    enunciation: 'Os atos administrativos possuem atributos que os diferenciam dos atos de direito privado. O atributo que impõe a imediata execução do ato administrativo pelo próprio poder público, inclusive por meios coercitivos diretos, independentemente de prévia autorização judicial, é denominado:',
    options: [
      'Presunção de Legitimidade',
      'Tipicidade',
      'Autoexecutoriedade',
      'Imperatividade',
      'Discricionariedade'
    ],
    correctIndex: 2,
    explanation: 'A Autoexecutoriedade é o atributo pelo qual os atos administrativos são executados diretamente pela própria Administração Pública, inclusive com meios coercitivos materiais se necessário, sem a necessidade de intervenção do poder judiciário previamente.'
  },
  {
    id: 'q-5',
    subjectName: 'Raciocínio Lógico-Matemático',
    topicName: 'Equivalências e Negações Lógicas',
    bank: 'Cebraspe',
    year: '2024',
    enunciation: 'Considere a proposição simples composta: "Se o candidato estuda com planejamento, então ele atinge o seu objetivo". De acordo com as leis do Raciocínio Lógico, a proposição que expressa uma EQUIVALÊNCIA da afirmativa inicial é:',
    options: [
      'Se o candidato atinge o seu objetivo, então ele estuda com planejamento.',
      'O candidato estuda com planejamento e não atinge o seu objetivo.',
      'Se o candidato não atinge o seu objetivo, então ele não estuda com planejamento.',
      'Se o candidato não estuda com planejamento, então ele não atinge o seu objetivo.',
      'O candidato não estuda com planejamento ou não atinge o seu objetivo.'
    ],
    correctIndex: 2,
    explanation: 'A proposição condicional "Se P, então Q" (P -> Q) possui duas equivalências clássicas principais: 1) Contrapositiva: "Se não Q, então não P" (~Q -> ~P); e 2) Disjuntiva: "Não P ou Q" (~P v Q). A opção C está na forma contrapositiva exata: contrapondo o consequente e o antecedente com negação.'
  }
];
