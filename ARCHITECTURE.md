# Arquitetura do Projeto: Zurc Concursos (App Concursos)

Este documento descreve a arquitetura de software, a estrutura do código, os modelos de dados e as decisões de design adotadas no **Zurc Concursos**, uma plataforma web SPA (Single Page Application) de alta performance focada na preparação e no planejamento de estudos de candidatos a concursos públicos no Brasil.

---

## 1. Visão Geral

O **Zurc Concursos** foi concebido como um gerenciador de estudos e simulador prático off-line com persistência em memória e reatividade instantânea. A aplicação auxilia o estudante na gestão do ciclo de estudos, controle de revisões baseadas no método de repetição espaçada, controle de horas líquidas de estudo (cronômetro/pomodoro), gerenciamento de edital verticalizado e acompanhamento analítico do percentual de acerto através de um painel estatístico inteligente.

### Requisitos Arquiteturais Principais
* **Single-View & Componentização Clara**: O aplicativo organiza suas seções por meio de uma barra de navegação responsiva e fluida, alternando entre abas modulares sem recarregar a página.
* **Fluxo Unidirecional de Dados**: O estado é mantido centralizado no componente raiz (`App.tsx`) para garantir que modificações feitas em cronômetros, simulados ou edital reflitam imediatamente nas estatísticas gerais do painel.
* **Polimento Visual com Tema "Elegant Dark"**: Interface escura elegante baseada na paleta de cores Zinc profunda (`#09090b` e `#18181b`), combinando tipografias geométricas de alta legibilidade (`Inter` & `Space Grotesk`) e detalhes vibrantes.

---

## 2. Pilha de Tecnologia (Tech Stack)

A aplicação utiliza as tecnologias web mais modernas para garantir velocidade de carregamento, responsividade e robustez do código:

* **React 19 (com TypeScript)**: Biblioteca principal de componentização e renderização reativa baseada em hooks funcionais, provendo checagem de tipos estática em todo o app.
* **Vite**: Ferramenta de build extremamente rápida, usada para bundling, servidor de desenvolvimento local e compilação de produção otimizada.
* **Tailwind CSS v4**: Framework utilitário de CSS que utiliza compilador de alta performance para renderizar uma interface adaptável, estilizada nativamente nos arquivos JSX.
* **Lucide React**: Biblioteca de ícones vetoriais modernos e consistentes baseada em SVG.
* **Motion**: Biblioteca usada na criação de micro-interações, feedbacks táteis de botões e transições fluidas de abas.

---

## 3. Estrutura do Projeto

A organização dos diretórios segue as melhores práticas para modularidade, permitindo fácil escalabilidade caso novos fluxos venham a ser implementados:

```text
/
├── public/                 # Assets estáticos de uso público
├── src/
│   ├── components/         # Componentes isolados e reaproveitáveis (Abas)
│   │   ├── Dashboard.tsx        # Resumos analíticos, gráficos e logs de sessões
│   │   ├── SyllabusManager.tsx  # Edital verticalizado e progresso teórico por matéria
│   │   ├── Timer.tsx            # Cronômetro de estudos c/ seleção rápida e bloco de notas
│   │   ├── QuestionTracker.tsx  # Histórico de resoluções de questões manuais/avulsas
│   │   ├── StudyCycle.tsx       # Editor interativo de ciclos metas de disciplinas
│   │   ├── RevisionScheduler.tsx# Alertas e agendador espaçado (24h, 7d, 30d)
│   │   └── MiniSimulado.tsx     # Motor de questões interativas c/ correção em tempo real
│   ├── data/
│   │   └── mockData.ts     # Banco de questões locais e massa inicial realista de testes
│   ├── types.ts            # Definições de Interfaces de dados e tipos estritos do TS
│   ├── index.css           # Configurações globais do Tailwind, fontes e animações
│   ├── main.tsx            # Ponto de entrada do React
│   └── App.tsx             # Componente raiz, gestor de estados globais e navegação
├── package.json            # Manifesto de dependências e scripts de execução
├── vite.config.ts          # Arquivo de configuração do compilador do Bundler Vite
└── ARCHITECTURE.md         # Este documento explicativo de arquitetura
```

---

## 4. Modelagem de Dados e Tipos (`types.ts`)

As principais decisões de modelagem de dados da aplicação estão estruturadas estritamente em interfaces no arquivo `/src/types.ts`. Os modelos representam as entidades de domínio da rotina de concursos públicos:

```typescript
// Representa um assunto individual contido dentro de uma disciplina (Matéria)
export interface Topic {
  id: string;
  name: string;
  theoryStudied: boolean; // Se a leitura teórica ou videoaula foi finalizada
  summaryCreated: boolean; // Se o candidato criou seu resumo de revisão
  reviewDone: boolean;     // Se a revisão programada foi executada
  questionsSolved: number; // Históricos de questões trabalhadas nesse tópico
}

// Representa uma disciplina principal (ex: Direito Constitucional)
export interface Subject {
  id: string;
  name: string;
  color: string;           // Cor base do tema associada à matéria para destaque visual
  topics: Topic[];
  totalStudyTime: number; // Tempo acumulado de estudo neste concurso (em minutos)
  questionsAttempted: number; // Questões resolvidas no total
  questionsCorrect: number;   // Acertos válidos
}

// Registro individual de uma sessão cronometrada finalizada
export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  duration: number;        // Duração que foi persistida (em minutos)
  date: string;            // Formato YYYY-MM-DD
  notes?: string;          // Observações sobre o conteúdo estudado
}

// Log manual de questões resolvidas fora da plataforma (ex: QConcursos ou TecConcursos)
export interface QuestionLog {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  notes?: string;
}

// Item configurado no Ciclo de Estudos adaptativo (Método de Ciclos de Alexandre Meirelles)
export interface CycleItem {
  id: string;
  subjectId: string;
  hours: number;           // Meta recomendada de horas contínuas antes de passar para a próxima
  color: string;
}

// Alerta de Revisão Periódica em tempo real
export interface RevisionAlert {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  type: '24h' | '7d' | '30d'; // Intervalo da repetição espaçada
  dueDate: string;         // Data limite para realização
  completed: boolean;
}

// Questão estruturada para o motor de Simulados Locais
export interface QuizQuestion {
  id: string;
  subjectName: string;
  topicName: string;
  bank: string;             // Banca organizadora (FCC, FGV, Cebraspe, Vunesp, etc.)
  year: string;
  enunciation: string;      // Enunciado detalhado
  options: string[];        // Alternativas
  correctIndex: number;     // Índice correto (0 a 4)
  explanation: string;      // Comentário do gabarito pedagógico
}
```

---

## 5. Gerenciamento de Estado e Fluxo de Dados

A arquitetura adota a metodologia de **Estado Centralizado Unificado** no elemento raiz `App.tsx` para garantir integridade referencial. O estado flui de cima para baixo (*Top-Down*) por meio de propriedades normais (*Props*), e o estado de volta flui de baixo para cima utilizando callbacks de eventos (*Event Handlers*), eliminando problemas de dessincronização de telas.

### Cenários de Integração Reativa de Estado:

1. **Do Cronômetro para o Painel Geral & Ciclo:**
   * Quando o cronômetro do `Timer.tsx` é finalizado e salvo pelo estudante através do callback `onAddStudySession`, a duração é somada ao `totalStudyTime` da matéria correspondente em `subjects`.
   * Um novo card histórico é registrado em `studySessions` de forma instantânea.
   * O sistema automaticamente cria um alerta em `revisions` do tipo `'24h'` para o dia seguinte, ensinando o estudante a agendar suas revisões críticas sem esforço mental de controle.

2. **De Questões e Simulados para Evolução das Matérias:**
   * Quando um usuário resolve um lote de questões manuais no `QuestionTracker.tsx` ou finaliza uma bateria de testes reais no `MiniSimulado.tsx`, o callback `onAddQuestionLog` é disparado.
   * O estado recalcula o total de acertos (`questionsCorrect`) e tentativas (`questionsAttempted`) na disciplina em questão, atualizando em tempo real a taxa global de acerto exibida no Painel Geral.

3. **Das Matérias do Edital para o Ciclo de Estudos:**
   * Caso o estudante adicione ou exclua uma disciplina do seu planejamento verticalizado no `SyllabusManager.tsx`, as listas de seleção do `StudyCycle.tsx` são sanitizadas e os registros obsoletos do ciclo são expurgados para garantir consistência de ID.

---

## 6. Descrição das Abas do Sistema

### 📊 Painel Geral (`Dashboard.tsx`)
Apresenta dados de alto nível com cartões de estatísticas reativos: questões resolvidas, taxa de acerto consolidada (com sinalização de cor de excelência profissional), horas totais brutas e consistência de dias de estudo. Fornece uma lista cronológica de sessões estendidas estudadas com opção de exclusão.

### 📖 Edital Verticalizado (`SyllabusManager.tsx`)
Permite ao estudante criar pastas de matérias personalizadas e listar tópicos de estudo. Os tópicos vêm com três controles chave fundamentais: **Teoria**, **Resumo** e **Revisão**. Um medidor de progresso visual avalia a porcentagem completada da matéria para motivar o candidato.

### ⏱️ Cronômetro (`Timer.tsx`)
Ferramenta principal de fixação que oferece contador clássico regressivo e progressivo com suporte de pause/resume. Ao acionar o botão de iniciar estudo vindo de outra tela (como a sugestão do ciclo), o cronômetro pré-seleciona a disciplina indicada. Permite preenchimento de anotações diárias que vão direto ao diário de bordo.

### 🏆 Questões (`QuestionTracker.tsx`)
Registrador de metas físicas com dados de taxa de conversão em tempo real. Ideal para registrar lotes resolvidos nos portais tradicionais de questões do mercado brasileiro.

### 🔄 Ciclo de Estudos (`StudyCycle.tsx`)
Um circuito visual onde o aluno estima tempos sugeridos por matéria para intercalação de conteúdos (evitando o erro clássico de estudar apenas uma matéria por semana inteiro). Inclui um editor para expandir e reordenar itens, além do botão de ação direta de disparo de estudo imediato.

### 🔔 Revisões Inteligentes (`RevisionScheduler.tsx`)
Painel espaçado que indica revisões ativas ou pendentes no dia. Ao concluir uma revisão nesta aba, o estado atualiza simultaneamente a marcação interna do tópico correspondente no edital verticalizado.

### ⚡ Simulado Prático (`MiniSimulado.tsx`)
Motor educacional de simulação rápida. O candidato resolve perguntas reais das bancas de maior prestígio e recebe feedback pedagógico instantâneo explicando por que aquela alternativa é o gabarito oficial.

---

## 7. Estilização e Identidade Visual (Elegant Dark Theme)

A interface do **Zurc Concursos** implementou o padrão **Elegant Dark** (Dark Mode moderno e confortável para longas horas de estudo em telas brilhantes):

* **Superfícies Escuras Sem Fadiga**: Base enriquecida em tons antracite `#09090b` e cartões em `#18181b`, contendo bordas suaves refinadas no tom `#27272a`.
* **Grades e Bordas Minimais**: Ausência de sombras carregadas ou gradientes poluídos, apostando no espaço negativo para separar os blocos funcionais perfeitamente.
* **Badges Nacionalistas**: Emblema de topo estilizado nas cores clássicas dos tribunais e ministérios (Verde e Ouro em gradiente suave), reforçando a identidade corporativa brasileira no topo esquerdo do cabeçalho.
* **Componentes Responsivos**: Menus flutuantes no celular para proteger o foco em telas menores e visual expansivo de dados densos em monitores desktop.

---
*Zurc Concursos — Desenvolvido de concurseiros para concurseiros.*
