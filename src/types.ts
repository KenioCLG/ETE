/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubjectType = 'Língua Portuguesa' | 'Matemática';

export type TopicStatus = 'Não Iniciado' | 'Teoria' | 'Exercícios' | 'Revisado';

export interface SyllabusTopic {
  id: string;
  title: string;
  section: string;
  subject: SubjectType;
  status: TopicStatus;
  confidence: number; // 0 to 5
  minutes: number;    // study time logged
  notes: string;      // custom study notes
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number; // 0 to 4 (A to E)
  explanation: string;
}

export interface MockQuestion extends QuizQuestion {
  id: string;
  subject: SubjectType;
}

export interface StudySessionLog {
  id: string;
  topicId: string;
  topicTitle: string;
  subject: SubjectType;
  minutes: number;
  date: string; // ISO String
}

export interface EditalMilestone {
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  description: string;
  type: 'inscricao' | 'prova' | 'resultado' | 'matricula' | 'aulas';
}

export interface SimuladoResult {
  id: string;
  date: string;
  scorePort: number;
  scoreMat: number;
  totalPort: number;
  totalMat: number;
  passed: boolean;
  userNote?: string;
  aiFeedback?: string;
}
