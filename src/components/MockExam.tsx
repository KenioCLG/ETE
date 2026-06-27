/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { MOCK_EXAM_QUESTIONS } from '../data/mockQuiz';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { SimuladoResult } from '../types';

export default function MockExam() {
  const [examStarted, setExamStarted] = useState<boolean>(() => {
    return localStorage.getItem('ete_exam_started') === 'true';
  });
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('ete_exam_seconds_left');
    return saved ? parseInt(saved, 10) : 60 * 60;
  });
  const [answers, setAnswers] = useState<{ [qId: string]: number }>(() => {
    const saved = localStorage.getItem('ete_exam_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [submitted, setSubmitted] = useState<boolean>(() => {
    return localStorage.getItem('ete_exam_submitted') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'port' | 'mat'>('port');
  const [filterMode, setFilterMode] = useState<'todos' | 'certos' | 'errados'>('todos');
  const [questions, setQuestions] = useState<any[]>(() => {
    const saved = localStorage.getItem('ete_exam_questions');
    return saved ? JSON.parse(saved) : MOCK_EXAM_QUESTIONS;
  });
  const [loadingSimulado, setLoadingSimulado] = useState(false);
  const [isCustomSimulado, setIsCustomSimulado] = useState(false);
  const [tecConfigured, setTecConfigured] = useState(false);
  const [loadingTec, setLoadingTec] = useState(false);
  const [history, setHistory] = useState<SimuladoResult[]>([]);
  const [userNote, setUserNote] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const handleSubmitRef = useRef<any>(null);

  // Sync state values to localStorage
  useEffect(() => {
    localStorage.setItem('ete_exam_started', String(examStarted));
    localStorage.setItem('ete_exam_submitted', String(submitted));
    localStorage.setItem('ete_exam_seconds_left', String(secondsLeft));
    localStorage.setItem('ete_exam_answers', JSON.stringify(answers));
    localStorage.setItem('ete_exam_questions', JSON.stringify(questions));
  }, [examStarted, submitted, secondsLeft, answers, questions]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ete_simulado_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const timerRef = useRef<any>(null);

  // Check TecConcursos availability on mount
  useEffect(() => {
    fetch('/api/tec/status')
      .then(r => r.json())
      .then(data => setTecConfigured(data.configured))
      .catch(() => setTecConfigured(false));
  }, []);

  // Mount timer synchronization based on target end time
  useEffect(() => {
    const savedStarted = localStorage.getItem('ete_exam_started') === 'true';
    const savedSubmitted = localStorage.getItem('ete_exam_submitted') === 'true';
    if (savedStarted && !savedSubmitted) {
      const endTimeStr = localStorage.getItem('ete_exam_end_time');
      if (endTimeStr) {
        const endTime = parseInt(endTimeStr, 10);
        const now = Date.now();
        if (endTime > now) {
          setSecondsLeft(Math.ceil((endTime - now) / 1000));
        } else {
          // Time expired! Submit automatically
          setSecondsLeft(0);
          if (handleSubmitRef.current) {
            handleSubmitRef.current();
          }
        }
      }
    }
  }, []);

  // Timer tick loop
  useEffect(() => {
    if (examStarted && !submitted) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const endTimeStr = localStorage.getItem('ete_exam_end_time');
        let endTime = endTimeStr ? parseInt(endTimeStr, 10) : 0;
        if (!endTime) {
          endTime = now + secondsLeft * 1000;
          localStorage.setItem('ete_exam_end_time', String(endTime));
        }

        const msLeft = endTime - now;
        if (msLeft <= 0) {
          clearInterval(timerRef.current);
          setSecondsLeft(0);
          if (handleSubmitRef.current) {
            handleSubmitRef.current();
          }
        } else {
          setSecondsLeft(Math.ceil(msLeft / 1000));
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, submitted]);

  // Helper to start exam and setup localStorage keys
  const startExamState = (newQuestions: any[], isCustom: boolean) => {
    setQuestions(newQuestions);
    setIsCustomSimulado(isCustom);
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(60 * 60);
    localStorage.setItem('ete_exam_started', 'true');
    localStorage.setItem('ete_exam_submitted', 'false');
    localStorage.setItem('ete_exam_seconds_left', String(60 * 60));
    localStorage.setItem('ete_exam_answers', '{}');
    localStorage.setItem('ete_exam_questions', JSON.stringify(newQuestions));
    localStorage.setItem('ete_exam_end_time', String(Date.now() + 60 * 60 * 1000));
    setExamStarted(true);
    setActiveTab('port');
  };

  const handleStartExam = () => {
    // Embaralha as questões para que não apareçam na mesma ordem
    const shuffled = [...MOCK_EXAM_QUESTIONS].sort(() => Math.random() - 0.5);
    startExamState(shuffled, false);
  };

  const handleStartCustomExam = async () => {
    setLoadingSimulado(true);
    try {
      const response = await fetch('/api/generate-simulado');
      const data = await response.json();
      if (response.ok && data.questions) {
        const formattedQuestions = data.questions.map((q: any, index: number) => ({
          ...q,
          id: q.subject === 'Língua Portuguesa' ? `port-ai-q-${index}` : `mat-ai-q-${index}`
        }));
        startExamState(formattedQuestions, true);
      } else {
        console.warn("Fallback ao gerar simulado. Usando simulado padrão.");
        handleStartExam();
      }
    } catch (err) {
      console.error('Erro ao conectar ao gerador de simulado:', err);
      handleStartExam();
    } finally {
      setLoadingSimulado(false);
    }
  };

  const handleBackToPanel = () => {
    setExamStarted(false);
    setSubmitted(false);
    setQuestions([]);
    setAnswers({});
    localStorage.removeItem('ete_exam_started');
    localStorage.removeItem('ete_exam_submitted');
    localStorage.removeItem('ete_exam_seconds_left');
    localStorage.removeItem('ete_exam_answers');
    localStorage.removeItem('ete_exam_questions');
    localStorage.removeItem('ete_exam_end_time');
  };

  const handleStartTecExam = async () => {
    setLoadingTec(true);
    try {
      const response = await fetch('/api/tec/simulado');
      const data = await response.json();
      if (response.ok && data.portQuestoes && data.matQuestoes) {
        const formatTecQuestions = (questoes: any[], subject: string) => {
          if (!Array.isArray(questoes)) return [];
          return questoes.slice(0, 10).map((q: any, i: number) => ({
            id: subject === 'Língua Portuguesa' ? `tec-port-${i}` : `tec-mat-${i}`,
            subject,
            question: q.enunciado || q.question || q.texto || String(q),
            options: q.alternativas || q.options || [],
            answerIndex: q.gabaritoIndex ?? q.answerIndex ?? 0,
            explanation: q.explanation || `Gabarito: Alternativa ${['A','B','C','D','E'][q.gabaritoIndex ?? q.answerIndex ?? 0]}.`
          }));
        };

        const portFormatted = formatTecQuestions(data.portQuestoes, 'Língua Portuguesa');
        const matFormatted = formatTecQuestions(data.matQuestoes, 'Matemática');
        const allQuestions = [...portFormatted, ...matFormatted];

        if (allQuestions.length > 0) {
          startExamState(allQuestions, true);
        } else {
          console.warn("Sem questoes do TecConcursos. Usando simulado padrao.");
          handleStartExam();
        }
      } else {
        console.warn("Resposta invalida do TecConcursos:", data.error);
        handleStartExam();
      }
    } catch (err) {
      console.error('Erro ao conectar ao TecConcursos:', err);
      handleStartExam();
    } finally {
      setLoadingTec(false);
    }
  };

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Clear active exam local storage keys
    localStorage.removeItem('ete_exam_end_time');
    localStorage.removeItem('ete_exam_started');
    localStorage.removeItem('ete_exam_seconds_left');
    localStorage.removeItem('ete_exam_answers');
    localStorage.removeItem('ete_exam_questions');
    localStorage.setItem('ete_exam_submitted', 'true');

    // Compute stats to save in history
    const portQs = questions.filter(q => q.subject === 'Língua Portuguesa');
    const matQs = questions.filter(q => q.subject === 'Matemática');
    const cPort = portQs.filter(q => answers[q.id] === q.answerIndex).length;
    const cMat = matQs.filter(q => answers[q.id] === q.answerIndex).length;
    
    const isElimByPct = (cPort + cMat) < 4;
    const isElimByZeroPort = cPort === 0;
    const isElimByZeroMat = cMat === 0;
    const isAppr = !isElimByPct && !isElimByZeroPort && !isElimByZeroMat;

    const newResult: SimuladoResult = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      date: new Date().toISOString(),
      scorePort: cPort,
      scoreMat: cMat,
      totalPort: portQs.length,
      totalMat: matQs.length,
      passed: isAppr
    };

    setHistory(prev => {
      const updated = [newResult, ...prev];
      localStorage.setItem('ete_simulado_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleGetAIFeedback = async () => {
    const latestResult = history[0];
    if (!latestResult) return;

    setLoadingFeedback(true);
    try {
      const wrongQs = questions.filter(q => answers[q.id] !== q.answerIndex);
      const res = await fetch('/api/evaluate-simulado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: { ...latestResult, wrongQuestions: wrongQs }, userNote })
      });
      const data = await res.json();
      
      if (data.feedback) {
        setHistory(prev => {
          const copy = [...prev];
          copy[0] = { ...copy[0], userNote, aiFeedback: data.feedback };
          localStorage.setItem('ete_simulado_history', JSON.stringify(copy));
          return copy;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Keep ref up to date
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [questions, answers]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Filtered lists of questions
  const portQuestions = questions.filter(q => q.subject === 'Língua Portuguesa');
  const matQuestions = questions.filter(q => q.subject === 'Matemática');

  // Compute stats
  const totalQuestionsCount = questions.length;
  const answeredCount = Object.keys(answers).length;
  
  const correctPort = portQuestions.filter(q => answers[q.id] === q.answerIndex).length;
  const correctMat = matQuestions.filter(q => answers[q.id] === q.answerIndex).length;
  const totalCorrect = correctPort + correctMat;
  const scorePercentage = Math.round((totalCorrect / totalQuestionsCount) * 100);

  // ETE elimination conditions:
  // 1. Obtiver pontuação total nas Provas Objetivas menor que 20% (menos que 4 questões certas)
  // 2. Obtiver pontuação 0,0 em qualquer uma das duas disciplinas (zerar Português ou Matemática)
  const isEliminatedByPercentage = totalCorrect < 4;
  const isEliminatedByZeroPort = correctPort === 0;
  const isEliminatedByZeroMat = correctMat === 0;
  const isApproved = !isEliminatedByPercentage && !isEliminatedByZeroPort && !isEliminatedByZeroMat;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro state */}
      {!examStarted ? (
        <div className="bg-dark-card rounded-2xl border border-dark-border shadow-md p-6 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center border border-gold/15">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-serif italic text-gold tracking-wide">Simulado Eletrônico Presencial ETE</h2>
            <p className="text-dark-muted text-sm max-w-lg mx-auto leading-relaxed">
              Pratique no mesmo formato exigido pelo edital subsequente 2026.2. Teste seus conhecimentos e prepare-se sob pressão real de tempo!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-2xl mx-auto bg-dark-bg p-4 rounded-xl border border-dark-border">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-dark-muted">Total de Questões</div>
              <div className="text-base font-serif italic font-bold text-gold">20 Questões</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-dark-muted">Língua Portuguesa</div>
              <div className="text-base font-serif italic font-bold text-gold">10 Questões</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-dark-muted">Matemática</div>
              <div className="text-base font-serif italic font-bold text-gold">10 Questões</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-dark-muted">Tempo de Duração</div>
              <div className="text-base font-serif italic font-bold text-gold">60 Minutos</div>
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/15 rounded-xl p-4 max-w-2xl mx-auto text-left space-y-2">
            <h4 className="text-xs font-serif font-bold text-gold uppercase tracking-wide flex items-center gap-1.5 italic">
              <AlertTriangle className="w-4 h-4 text-gold animate-pulse" />
              Regras Importantes de Eliminação (Edital Item 7)
            </h4>
            <ul className="text-[11px] text-dark-text opacity-95 list-disc list-inside space-y-1 font-medium leading-relaxed">
              <li>Será eliminado o candidato que obtiver pontuação total menor que 20% (menos de 4 acertos no total).</li>
              <li>Será eliminado o candidato que obtiver nota 0,0 (zero) em qualquer uma das duas disciplinas.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto pt-2">
            <button
              onClick={handleStartExam}
              disabled={loadingSimulado}
              className="w-full sm:w-auto px-6 py-3 bg-dark-bg hover:bg-dark-card-lighter text-gold border border-gold/30 hover:border-gold/60 font-bold rounded-xl shadow-md transition duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" />
              Simulado Padrão ETE
            </button>
            <button
              onClick={handleStartCustomExam}
              disabled={loadingSimulado}
              className="w-full sm:w-auto px-6 py-3 bg-gold hover:bg-gold-hover text-dark-bg font-extrabold rounded-xl shadow-md transition duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              {loadingSimulado ? 'Gerando Simulado...' : 'Gerar Simulado com IA'}
            </button>
            {tecConfigured && (
              <button
                onClick={handleStartTecExam}
                disabled={loadingTec || loadingSimulado}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {loadingTec ? 'Buscando Questões...' : 'Simulado TecConcursos'}
              </button>
            )}
          </div>

          {/* Histórico de Provas */}
          {history.length > 0 && (
            <div className="mt-12 max-w-2xl mx-auto space-y-4 text-left">
              <h3 className="text-sm font-serif italic text-gold border-b border-dark-border pb-2">Seu Histórico de Simulados</h3>
              <div className="space-y-3">
                {history.map((res, i) => {
                  const dateStr = new Date(res.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={res.id} className="space-y-2">
                      <div className="bg-dark-bg/60 border border-dark-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] text-dark-muted font-mono">{dateStr}</div>
                          <div className="text-sm font-bold text-dark-text mt-1">Simulado #{history.length - i}</div>
                        </div>
                        <div className="flex gap-4 text-xs font-mono">
                          <div className="text-center">
                            <div className="text-dark-muted text-[10px] uppercase">Português</div>
                            <div className={res.scorePort > 0 ? "text-emerald-400" : "text-rose-400"}>{res.scorePort}/{res.totalPort}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-dark-muted text-[10px] uppercase">Matemática</div>
                            <div className={res.scoreMat > 0 ? "text-emerald-400" : "text-rose-400"}>{res.scoreMat}/{res.totalMat}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-dark-muted text-[10px] uppercase">Total</div>
                            <div className="text-gold">{res.scorePort + res.scoreMat}/20</div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                          {res.passed ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-950/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-900/50">
                              <CheckCircle className="w-3.5 h-3.5" /> Aprovado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-950/30 text-rose-400 px-3 py-1 rounded-full text-xs font-bold border border-rose-900/50">
                              <XCircle className="w-3.5 h-3.5" /> Eliminado
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Render AI Feedback if exists */}
                      {res.aiFeedback && (
                        <div className="bg-dark-bg p-4 rounded-xl border border-dark-border text-xs">
                          <div className="font-serif italic text-gold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Laudo Pedagógico da IA
                          </div>
                          {res.userNote && (
                            <div className="text-dark-muted mb-3 italic">"Sua observação: {res.userNote}"</div>
                          )}
                          <div className="text-dark-text whitespace-pre-wrap">{res.aiFeedback}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active exam/submitted state */
        <div className="space-y-6">
          {/* Header banner with timer and status */}
          <div className="bg-dark-card border border-dark-border text-dark-text rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-dark-bg border border-dark-border rounded-lg text-gold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono text-dark-muted block">Tempo Restante</span>
                <span className={`text-xl font-bold font-mono ${secondsLeft < 300 ? 'text-[#e06c75] animate-pulse' : 'text-gold'}`}>
                  {formatTime(secondsLeft)}
                </span>
              </div>
            </div>

            <div className="text-xs text-dark-muted font-mono">
              Respondidas: <span className="font-bold text-dark-text">{answeredCount}</span> de {totalQuestionsCount} questões
            </div>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-gold hover:bg-gold-hover text-dark-bg font-extrabold text-xs rounded-lg shadow-sm transition duration-200"
              >
                Entregar Prova
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToPanel}
                  className="px-4 py-2 border border-dark-border hover:bg-dark-card-lighter text-dark-muted hover:text-dark-text font-bold text-xs rounded-lg transition duration-200"
                >
                  Voltar ao Painel
                </button>
                <button
                  onClick={handleStartCustomExam}
                  disabled={loadingSimulado}
                  className="px-4 py-2 bg-gold hover:bg-gold-hover text-dark-bg font-extrabold text-xs rounded-lg shadow-sm transition duration-200 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loadingSimulado ? 'Gerando...' : <><Sparkles className="w-3.5 h-3.5" /> Novo Simulado IA</>}
                </button>
              </div>
            )}
          </div>

          {/* Submitted Results Overview Card */}
          {submitted && (
            <div className={`rounded-2xl border p-6 space-y-4 ${
              isApproved 
                ? 'bg-emerald-950/20 border-emerald-900/30' 
                : 'bg-rose-950/20 border-rose-900/30'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400" />
                    )}
                    <h3 className="font-serif italic text-lg text-dark-text">
                      {isApproved ? 'Aprovado na Nota de Corte!' : 'Candidato Desclassificado / Eliminado'}
                    </h3>
                  </div>
                  <p className="text-xs text-dark-muted">
                    {isApproved 
                      ? 'Você preencheu os requisitos do edital (acima de 20% e sem pontuação zero em nenhuma matéria).' 
                      : 'Verifique as razões da desclassificação com base nas regras do edital nos quadros abaixo.'}
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <span className="text-3xl font-black font-mono text-dark-text">{totalCorrect} / {totalQuestionsCount}</span>
                  <div className="text-[10px] text-dark-muted font-bold uppercase tracking-wider">Acertos Totais ({scorePercentage}%)</div>
                </div>
              </div>

              {/* Status parameters grids */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border">
                  <div className="text-[10px] uppercase font-mono text-dark-muted">Acertos em Português</div>
                  <div className="text-base font-serif italic text-dark-text font-semibold">{correctPort} de 10</div>
                  {isEliminatedByZeroPort ? (
                    <span className="text-[9px] font-mono font-bold uppercase text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30 inline-block mt-1">Eliminado (Nota Zero)</span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 inline-block mt-1">Válido</span>
                  )}
                </div>

                <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border">
                  <div className="text-[10px] uppercase font-mono text-dark-muted">Acertos em Matemática</div>
                  <div className="text-base font-serif italic text-dark-text font-semibold">{correctMat} de 10</div>
                  {isEliminatedByZeroMat ? (
                    <span className="text-[9px] font-mono font-bold uppercase text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30 inline-block mt-1">Eliminado (Nota Zero)</span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 inline-block mt-1">Válido</span>
                  )}
                </div>

                <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border">
                  <div className="text-[10px] uppercase font-mono text-dark-muted">Nota Total Mínima</div>
                  <div className="text-base font-serif italic text-dark-text font-semibold">{scorePercentage}% (Min. 20%)</div>
                  {isEliminatedByPercentage ? (
                    <span className="text-[9px] font-mono font-bold uppercase text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30 inline-block mt-1">Eliminado (&lt; 20%)</span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 inline-block mt-1">Aprovado</span>
                  )}
                </div>
              </div>

              {/* AI Feedback Section for current exam */}
              {history[0] && history[0].id && !history[0].aiFeedback && (
                <div className="bg-dark-bg p-4 rounded-xl border border-dark-border space-y-3 mt-4">
                  <h4 className="font-serif italic text-sm text-gold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Análise IA da sua Prova
                  </h4>
                  <p className="text-xs text-dark-muted">Adicione uma nota sobre como você se sentiu nesta prova (opcional) para o Tutor IA analisar junto com os seus erros.</p>
                  <textarea 
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Ex: Achei matemática muito difícil, faltou tempo para ler tudo..."
                    className="w-full bg-dark-card border border-dark-border rounded-lg p-3 text-xs text-dark-text focus:border-gold/50 outline-none min-h-[80px]"
                  />
                  <button 
                    onClick={handleGetAIFeedback}
                    disabled={loadingFeedback}
                    className="bg-gold hover:bg-gold-hover text-dark-bg font-bold text-xs px-4 py-2 rounded-lg transition"
                  >
                    {loadingFeedback ? 'Gerando Laudo...' : 'Receber Laudo Pedagógico'}
                  </button>
                </div>
              )}

              {history[0] && history[0].aiFeedback && (
                <div className="bg-dark-bg p-4 rounded-xl border border-gold/30 space-y-3 mt-4">
                   <h4 className="font-serif italic text-sm text-gold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Laudo Pedagógico da IA
                  </h4>
                  <div className="text-xs text-dark-text whitespace-pre-wrap leading-relaxed">
                    {history[0].aiFeedback}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subject Navigation Tab */}
          <div className="flex border-b border-dark-border">
            <button
              onClick={() => setActiveTab('port')}
              className={`flex-1 py-3 text-center border-b-2 font-serif italic text-sm transition ${
                activeTab === 'port' 
                  ? 'border-gold text-gold' 
                  : 'border-transparent text-dark-muted hover:text-dark-text'
              }`}
            >
              Língua Portuguesa (10 Questões)
            </button>
            <button
              onClick={() => setActiveTab('mat')}
              className={`flex-1 py-3 text-center border-b-2 font-serif italic text-sm transition ${
                activeTab === 'mat' 
                  ? 'border-gold text-gold' 
                  : 'border-transparent text-dark-muted hover:text-dark-text'
              }`}
            >
              Matemática (10 Questões)
            </button>
          </div>

          {/* Filter options on results list */}
          {submitted && (
            <div className="flex items-center gap-2 justify-end text-xs">
              <span className="text-dark-muted font-medium">Filtrar Respostas:</span>
              <div className="flex rounded-lg bg-dark-bg p-0.5 border border-dark-border">
                {(['todos', 'certos', 'errados'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterMode(f)}
                    className={`px-3 py-1 rounded-md font-semibold transition text-xs capitalize ${
                      filterMode === f ? 'bg-gold text-dark-bg font-bold shadow-md' : 'text-dark-muted hover:text-gold'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {(activeTab === 'port' ? portQuestions : matQuestions)
              .filter(q => {
                if (!submitted || filterMode === 'todos') return true;
                const isCorrect = answers[q.id] === q.answerIndex;
                if (filterMode === 'certos') return isCorrect;
                if (filterMode === 'errados') return !isCorrect;
                return true;
              })
              .map((q, idx) => {
                const globalIndex = questions.findIndex(item => item.id === q.id) + 1;
                const selectedOpt = answers[q.id];
                const isCorrect = selectedOpt === q.answerIndex;

                return (
                  <div key={q.id} className="bg-dark-card rounded-2xl border border-dark-border p-5 space-y-4 shadow-md">
                    {/* Header line of the question */}
                    <div className="flex items-center justify-between gap-2 border-b border-dark-border pb-3">
                      <span className="text-[10px] font-mono font-bold text-dark-muted uppercase tracking-wider">
                        Questão {globalIndex}
                      </span>
                      {submitted && (
                        <span>
                          {isCorrect ? (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/30 rounded">Acertou</span>
                          ) : selectedOpt === undefined ? (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-muted bg-dark-bg px-2 py-0.5 border border-dark-border rounded">Em Branco</span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/40 px-2 py-0.5 border border-rose-900/30 rounded">Errou</span>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-dark-text font-serif italic text-sm md:text-base leading-relaxed">
                      {q.question}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2.5 pl-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedOpt === oIdx;
                        const isCorrectOption = oIdx === q.answerIndex;

                        let optStyle = "border-dark-border hover:border-dark-muted hover:bg-dark-bg text-dark-text bg-dark-bg";
                        if (isSelected) {
                          optStyle = "border-gold bg-gold/10 text-gold font-medium";
                        }
                        if (submitted) {
                          if (isCorrectOption) {
                            optStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold";
                          } else if (isSelected && !isCorrect) {
                            optStyle = "border-rose-500 bg-rose-950/20 text-rose-300";
                          } else {
                            optStyle = "border-dark-border opacity-50 text-dark-muted";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={submitted}
                            onClick={() => handleSelectAnswer(q.id, oIdx)}
                            className={`text-left p-3.5 rounded-lg border text-xs transition duration-150 flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback and step-by-step mathematical or grammatical resolution */}
                    {submitted && (
                      <div className={`p-4 rounded-xl text-xs leading-relaxed space-y-1.5 ${
                        isCorrect ? 'bg-emerald-950/15 border border-emerald-900/30 text-emerald-300' : 'bg-rose-950/15 border border-rose-900/30 text-rose-300'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5">
                          {isCorrect ? '✓ Gabarito Comentado:' : '✗ Gabarito Comentado:'}
                        </div>
                        <div className="text-dark-text opacity-90 leading-relaxed font-medium">{q.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}

            {submitted && (activeTab === 'port' ? portQuestions : matQuestions).filter(q => {
              const isCorrect = answers[q.id] === q.answerIndex;
              if (filterMode === 'certos') return isCorrect;
              if (filterMode === 'errados') return !isCorrect;
              return true;
            }).length === 0 && (
              <div className="text-center py-12 bg-dark-card rounded-2xl border border-dark-border italic text-dark-muted text-xs">
                Nenhuma questão corresponde ao filtro selecionado.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
