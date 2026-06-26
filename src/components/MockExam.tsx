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
} from 'lucide-react';

export default function MockExam() {
  const [examStarted, setExamStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60 * 60); // 60 minutes
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'port' | 'mat'>('port');
  const [filterMode, setFilterMode] = useState<'todos' | 'certos' | 'errados'>('todos');

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (examStarted && !submitted) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, submitted]);

  const handleStartExam = () => {
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(60 * 60);
    setExamStarted(true);
    setActiveTab('port');
  };

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Filtered lists of questions
  const portQuestions = MOCK_EXAM_QUESTIONS.filter(q => q.subject === 'Língua Portuguesa');
  const matQuestions = MOCK_EXAM_QUESTIONS.filter(q => q.subject === 'Matemática');

  // Compute stats
  const totalQuestionsCount = MOCK_EXAM_QUESTIONS.length;
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

          <button
            onClick={handleStartExam}
            className="px-8 py-3 bg-gold hover:bg-gold-hover text-dark-bg font-bold rounded-xl shadow-md transition duration-200"
          >
            Iniciar Simulado ETE
          </button>
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
              <button
                onClick={handleStartExam}
                className="px-5 py-2 border border-dark-border hover:bg-dark-card-lighter text-gold font-bold text-xs rounded-lg transition duration-200 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Simulado
              </button>
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
                const globalIndex = MOCK_EXAM_QUESTIONS.findIndex(item => item.id === q.id) + 1;
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
