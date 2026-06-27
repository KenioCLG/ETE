/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { SyllabusTopic, TopicStatus, SubjectType, QuizQuestion } from '../types';
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Clock, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  FileDown,
  FileUp,
  Loader2,
  X,
  Play,
  Youtube,
  ExternalLink,
  Pause,
  RotateCcw,
  Coffee,
  Volume2,
  VolumeX,
  Brain
} from 'lucide-react';
import { STUDY_RESOURCES } from '../data/studyResources';

interface SyllabusTrackerProps {
  topics: SyllabusTopic[];
  onUpdateTopic: (updated: SyllabusTopic) => void;
  onImportData: (imported: SyllabusTopic[]) => void;
}

export const DAYS_METADATA = [
  {
    day: 1,
    title: 'Dia 1: Compreensão Temática & Aritmética Primária',
    subtitle: 'Interpretação textual, coesão, coerência, quatro operações, frações e decimais.',
    topicIds: ['lp-comp-01', 'lp-comp-02', 'mat-01', 'mat-02', 'mat-03']
  },
  {
    day: 2,
    title: 'Dia 2: Gêneros Textuais, Potência & Radiciação',
    subtitle: 'Tipos textuais, significação de palavras, propriedades de potência, radicais e expressões com números reais.',
    topicIds: ['lp-comp-03', 'lp-comp-04', 'mat-04', 'mat-05', 'mat-06']
  },
  {
    day: 3,
    title: 'Dia 3: Recursos Estilísticos & Razão e Proporção',
    subtitle: 'Figuras de linguagem, norma culta, sistemas de medidas, conceitos de razão e partilha proporcional.',
    topicIds: ['lp-comp-05', 'lp-ling-01', 'mat-07', 'mat-08', 'mat-09']
  },
  {
    day: 4,
    title: 'Dia 4: Estrutura de Palavras, Regra de Três & Médias',
    subtitle: 'Formação de palavras, regra de três simples/composta, porcentagem e médias estatísticas.',
    topicIds: ['lp-ling-02', 'mat-10', 'mat-11', 'mat-12']
  },
  {
    day: 5,
    title: 'Dia 5: Classes de Palavras & Simplificação de Expressões',
    subtitle: 'Classes gramaticais, termos da oração, expressões algébricas, produtos notáveis, fatoração e frações algébricas.',
    topicIds: ['lp-ling-03', 'mat-13', 'mat-14', 'mat-15', 'mat-16']
  },
  {
    day: 6,
    title: 'Dia 6: Conectivos, Equações & Sistemas Lineares',
    subtitle: 'Coordenação, subordinação, equações do 1º e 2º grau e sistemas de equações.',
    topicIds: ['lp-ling-04', 'mat-17', 'mat-18', 'mat-19']
  },
  {
    day: 7,
    title: 'Dia 7: Pontuação & Geometria Plana Básica',
    subtitle: 'Uso da vírgula, conceitos de ângulos, retas paralelas e propriedades dos polígonos.',
    topicIds: ['lp-ling-05', 'mat-20', 'mat-21', 'mat-22']
  },
  {
    day: 8,
    title: 'Dia 8: Sintaxe, Triângulos & Relações Métricas',
    subtitle: 'Concordância, regência, elementos do triângulo, semelhança e Teorema de Pitágoras.',
    topicIds: ['lp-ling-06', 'mat-23', 'mat-24', 'mat-25']
  },
  {
    day: 9,
    title: 'Dia 9: Ortografia & Trigonometria Plana',
    subtitle: 'Novo acordo ortográfico, relações trigonométricas e resoluções no triângulo retângulo e triângulos quaisquer.',
    topicIds: ['lp-ling-07', 'mat-26', 'mat-27']
  },
  {
    day: 10,
    title: 'Dia 10: Circunferência, Áreas Planas & Revisão de Véspera',
    subtitle: 'Comprimento e área do círculo, áreas de figuras planas, ângulos na circunferência e dicas estratégicas.',
    topicIds: ['mat-28', 'mat-29', 'mat-30']
  }
];

export default function SyllabusTracker({ topics, onUpdateTopic, onImportData }: SyllabusTrackerProps) {
  const [viewMode, setViewMode] = useState<'subject' | 'chronogram'>('chronogram'); // Default to chronological study order as requested
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'Todos'>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<TopicStatus | 'Todos'>('Todos');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Active YouTube video selections per topic ID
  const [activeVideoIds, setActiveVideoIds] = useState<{ [topicId: string]: string }>({});

  // AI states
  const [aiLoadingTopicId, setAiLoadingTopicId] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<{ [topicId: string]: string }>({});
  const [aiQuiz, setAiQuiz] = useState<{ [topicId: string]: QuizQuestion[] }>({});
  const [aiQuizAnswers, setAiQuizAnswers] = useState<{ [topicId: string]: { [qIndex: number]: number } }>({});
  const [aiQuizSubmitted, setAiQuizSubmitted] = useState<{ [topicId: string]: boolean }>({});
  const [aiError, setAiError] = useState<string | null>(null);
  const [customVideos, setCustomVideos] = useState<{ [topicId: string]: any[] }>({});

  // TecConcursos states
  const [tecConfigured, setTecConfigured] = useState<boolean>(false);
  const [tecLoading, setTecLoading] = useState<string | null>(null);
  const [tecQuiz, setTecQuiz] = useState<{ [topicId: string]: QuizQuestion[] }>({});
  const [tecQuizAnswers, setTecQuizAnswers] = useState<{ [topicId: string]: { [qIndex: number]: number } }>({});
  const [tecQuizSubmitted, setTecQuizSubmitted] = useState<{ [topicId: string]: boolean }>({});
  const [tecSource, setTecSource] = useState<{ [topicId: string]: string }>({});

  // Pomodoro States
  const [pomoActive, setPomoActive] = useState<boolean>(() => {
    return localStorage.getItem('ete_pomo_active') === 'true';
  });
  const [pomoTopicId, setPomoTopicId] = useState<string | null>(() => {
    return localStorage.getItem('ete_pomo_topic_id');
  });
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('ete_pomo_seconds_left');
    return saved ? parseInt(saved, 10) : 25 * 60;
  });
  const [pomoMode, setPomoMode] = useState<'work' | 'shortBreak' | 'longBreak'>(() => {
    return (localStorage.getItem('ete_pomo_mode') as any) || 'work';
  });
  const [pomoSecondsAccumulated, setPomoSecondsAccumulated] = useState<number>(() => {
    const saved = localStorage.getItem('ete_pomo_seconds_accumulated');
    return saved ? parseFloat(saved) : 0;
  });
  const [pomoSoundEnabled, setPomoSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('ete_pomo_sound_enabled') !== 'false';
  });
  const [studyParamsCollapsed, setStudyParamsCollapsed] = useState<boolean>(true);

  const topicsRef = useRef(topics);
  const onUpdateTopicRef = useRef(onUpdateTopic);

  useEffect(() => {
    topicsRef.current = topics;
    onUpdateTopicRef.current = onUpdateTopic;
  }, [topics, onUpdateTopic]);

  // Sync state values to localStorage
  useEffect(() => {
    localStorage.setItem('ete_pomo_active', String(pomoActive));
    if (pomoTopicId) {
      localStorage.setItem('ete_pomo_topic_id', pomoTopicId);
    } else {
      localStorage.removeItem('ete_pomo_topic_id');
    }
    localStorage.setItem('ete_pomo_seconds_left', String(pomoSecondsLeft));
    localStorage.setItem('ete_pomo_mode', pomoMode);
    localStorage.setItem('ete_pomo_seconds_accumulated', String(pomoSecondsAccumulated));
    localStorage.setItem('ete_pomo_sound_enabled', String(pomoSoundEnabled));
  }, [pomoActive, pomoTopicId, pomoSecondsLeft, pomoMode, pomoSecondsAccumulated, pomoSoundEnabled]);

  // Play sound/speech alerts
  const playPomoAlert = (text: string) => {
    if (pomoSoundEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Mount synchronization based on real time
  useEffect(() => {
    const savedActive = localStorage.getItem('ete_pomo_active') === 'true';
    if (savedActive) {
      const endTimeStr = localStorage.getItem('ete_pomo_end_time');
      const topicId = localStorage.getItem('ete_pomo_topic_id');
      const mode = localStorage.getItem('ete_pomo_mode') || 'work';
      const acc = parseFloat(localStorage.getItem('ete_pomo_seconds_accumulated') || '0');
      
      if (endTimeStr && topicId) {
        const endTime = parseInt(endTimeStr, 10);
        const now = Date.now();
        if (endTime > now) {
          const secLeft = Math.ceil((endTime - now) / 1000);
          setPomoSecondsLeft(secLeft);
          setPomoActive(true);
        } else {
          // Timer expired while offline or closed!
          if (mode === 'work') {
            const savedSecLeft = parseInt(localStorage.getItem('ete_pomo_seconds_left') || '0', 10);
            const totalWorkSec = acc + savedSecLeft;
            const minutesToCredit = Math.floor(totalWorkSec / 60);
            if (minutesToCredit > 0) {
              const currentTopic = topicsRef.current.find(t => t.id === topicId);
              if (currentTopic) {
                onUpdateTopicRef.current({
                  ...currentTopic,
                  minutes: currentTopic.minutes + minutesToCredit
                });
              }
            }
          }
          
          // Reset or change to break if work finished
          setPomoActive(false);
          localStorage.removeItem('ete_pomo_active');
          localStorage.removeItem('ete_pomo_end_time');
          
          if (mode === 'work') {
            setPomoMode('shortBreak');
            setPomoSecondsLeft(5 * 60);
            setPomoSecondsAccumulated(0);
          } else {
            setPomoMode('work');
            setPomoSecondsLeft(25 * 60);
            setPomoSecondsAccumulated(0);
          }
        }
      }
    }
  }, []);

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    let timerId: any = null;
    if (pomoActive && pomoTopicId) {
      lastTickRef.current = Date.now();
      timerId = setInterval(() => {
        const now = Date.now();
        const endTimeStr = localStorage.getItem('ete_pomo_end_time');
        let endTime = endTimeStr ? parseInt(endTimeStr, 10) : 0;
        if (!endTime) {
          endTime = now + pomoSecondsLeft * 1000;
          localStorage.setItem('ete_pomo_end_time', String(endTime));
        }

        const msLeft = endTime - now;
        
        // Track work seconds using time elapsed (prevents throttling drift!)
        const elapsedSec = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;

        if (pomoMode === 'work' && elapsedSec > 0) {
          setPomoSecondsAccumulated((acc) => {
            const nextAcc = acc + elapsedSec;
            if (nextAcc >= 60) {
              const mins = Math.floor(nextAcc / 60);
              const currentTopic = topicsRef.current.find(t => t.id === pomoTopicId);
              if (currentTopic) {
                onUpdateTopicRef.current({
                  ...currentTopic,
                  minutes: currentTopic.minutes + mins
                });
              }
              return nextAcc % 60;
            }
            return nextAcc;
          });
        }

        if (msLeft <= 0) {
          clearInterval(timerId);
          setPomoActive(false);
          localStorage.removeItem('ete_pomo_active');
          localStorage.removeItem('ete_pomo_end_time');
          
          if (pomoMode === 'work') {
            playPomoAlert("Foco concluído! Excelente estudo. Hora de descansar um pouco.");
            setPomoMode('shortBreak');
            setPomoSecondsLeft(5 * 60);
            setPomoSecondsAccumulated(0);
            const nextEndTime = Date.now() + 5 * 60 * 1000;
            localStorage.setItem('ete_pomo_end_time', String(nextEndTime));
            setPomoActive(true); // Auto-start break!
          } else {
            playPomoAlert("Pausa concluída! Vamos voltar ao foco?");
            setPomoMode('work');
            setPomoSecondsLeft(25 * 60);
            setPomoSecondsAccumulated(0);
          }
        } else {
          setPomoSecondsLeft(Math.ceil(msLeft / 1000));
        }
      }, 1000);
    } else {
      if (timerId) clearInterval(timerId);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [pomoActive, pomoTopicId, pomoMode, pomoSoundEnabled]);

  // Sync expanded topic redirected from TenDaySprint and load custom videos
  useEffect(() => {
    const selected = localStorage.getItem('ete_syllabus_tracker_expanded_id');
    if (selected) {
      setExpandedTopicId(selected);
      localStorage.removeItem('ete_syllabus_tracker_expanded_id');
      
      const foundDay = DAYS_METADATA.find(d => d.topicIds.includes(selected));
      if (foundDay) {
        setExpandedDay(foundDay.day);
      }
    }

    const saved = localStorage.getItem('ete_custom_videos');
    if (saved) {
      try {
        setCustomVideos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Check TecConcursos availability
    fetch('/api/tec/status')
      .then(r => r.json())
      .then(data => setTecConfigured(data.configured))
      .catch(() => setTecConfigured(false));
  }, []);

  const getCombinedVideos = (topicId: string): any[] => {
    const defaultRes = STUDY_RESOURCES[topicId];
    const customs = customVideos[topicId] || [];
    const defaults = defaultRes ? defaultRes.videos : [];
    return [...customs, ...defaults];
  };

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          topic.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'Todos' || topic.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'Todos' || topic.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusColor = (status: TopicStatus) => {
    switch (status) {
      case 'Não Iniciado': return 'bg-dark-card-lighter text-dark-muted border-dark-border';
      case 'Teoria': return 'bg-gold/10 text-gold border-gold/20';
      case 'Exercícios': return 'bg-gold/5 text-gold border-gold/15 opacity-80';
      case 'Revisado': return 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30';
    }
  };

  const handleQuickAddMinutes = (topic: SyllabusTopic, amount: number) => {
    onUpdateTopic({
      ...topic,
      minutes: topic.minutes + amount
    });
  };

  const handleNotesChange = (topic: SyllabusTopic, notes: string) => {
    onUpdateTopic({
      ...topic,
      notes
    });
  };

  const handleStatusChange = (topic: SyllabusTopic, status: TopicStatus) => {
    onUpdateTopic({
      ...topic,
      status
    });
  };

  const handleConfidenceChange = (topic: SyllabusTopic, confidence: number) => {
    onUpdateTopic({
      ...topic,
      confidence
    });
  };

  // AI Explain Logic
  const handleExplainWithAI = async (topic: SyllabusTopic) => {
    if (aiExplanation[topic.id]) {
      const copy = { ...aiExplanation };
      delete copy[topic.id];
      setAiExplanation(copy);
      return;
    }

    setAiLoadingTopicId(topic.id);
    setAiError(null);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.title, subject: topic.subject }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiExplanation(prev => ({ ...prev, [topic.id]: data.explanation }));
      } else {
        setAiError(data.error || 'Não foi possível carregar a explicação.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Erro ao conectar-se ao assistente de IA.');
    } finally {
      setAiLoadingTopicId(null);
    }
  };

  // AI Quiz Logic
  const handleQuizWithAI = async (topic: SyllabusTopic) => {
    if (aiQuiz[topic.id]) {
      const copy = { ...aiQuiz };
      delete copy[topic.id];
      setAiQuiz(copy);
      return;
    }

    setAiLoadingTopicId(topic.id);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.title, subject: topic.subject }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiQuiz(prev => ({ ...prev, [topic.id]: data.questions }));
        setAiQuizAnswers(prev => ({ ...prev, [topic.id]: {} }));
        setAiQuizSubmitted(prev => ({ ...prev, [topic.id]: false }));
      } else {
        setAiError(data.error || 'Não foi possível gerar as questões.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Erro ao conectar ao gerador de questões.');
    } finally {
      setAiLoadingTopicId(null);
    }
  };

  const handleSelectQuizAnswer = (topicId: string, qIndex: number, optIndex: number) => {
    setAiQuizAnswers(prev => ({
      ...prev,
      [topicId]: {
        ...(prev[topicId] || {}),
        [qIndex]: optIndex
      }
    }));
  };

  const handleSubmitQuiz = (topicId: string) => {
    setAiQuizSubmitted(prev => ({ ...prev, [topicId]: true }));
  };

  // TecConcursos Quiz Logic
  const handleTecQuiz = async (topic: SyllabusTopic) => {
    if (tecQuiz[topic.id]) {
      const copy = { ...tecQuiz };
      delete copy[topic.id];
      setTecQuiz(copy);
      return;
    }

    const resource = STUDY_RESOURCES[topic.id];
    if (!resource) return;

    setTecLoading(topic.id);
    setAiError(null);

    try {
      const response = await fetch('/api/tec/questoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tecQuery: resource.tecQuery,
          subject: topic.subject,
          quantidade: 3
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao buscar questoes do TecConcursos');
      }

      // Formatar questoes do TecConcursos para o formato QuizQuestion
      const questoes = data.questoes || [];
      if (!Array.isArray(questoes) || questoes.length === 0) {
        throw new Error('Nenhuma questao retornada pelo TecConcursos');
      }

      const formatted: QuizQuestion[] = questoes.slice(0, 3).map((q: any) => ({
        question: q.enunciado || q.question || q.texto || String(q),
        options: q.alternativas || q.options || [],
        answerIndex: q.gabaritoIndex ?? q.answerIndex ?? 0,
        explanation: q.explanation || `Gabarito: Alternativa ${['A','B','C','D','E'][q.gabaritoIndex ?? q.answerIndex ?? 0]}. Clique em "Explicar Gabarito" para ver a resolucao detalhada.`
      }));

      setTecQuiz(prev => ({ ...prev, [topic.id]: formatted }));
      setTecQuizAnswers(prev => ({ ...prev, [topic.id]: {} }));
      setTecQuizSubmitted(prev => ({ ...prev, [topic.id]: false }));
      setTecSource(prev => ({ ...prev, [topic.id]: `${data.total || '?'} questoes disponiveis | ${data.assunto || resource.tecQuery}` }));
    } catch (err: any) {
      setAiError(err.message || 'Erro ao buscar questoes do TecConcursos.');
    } finally {
      setTecLoading(null);
    }
  };

  const handleSelectTecAnswer = (topicId: string, qIndex: number, optIndex: number) => {
    setTecQuizAnswers(prev => ({
      ...prev,
      [topicId]: {
        ...(prev[topicId] || {}),
        [qIndex]: optIndex
      }
    }));
  };

  const handleSubmitTecQuiz = (topicId: string) => {
    setTecQuizSubmitted(prev => ({ ...prev, [topicId]: true }));
  };

  // Solicitar explicacao do gabarito via Gemini
  const handleExplicarGabarito = async (topicId: string, qIndex: number) => {
    const quiz = tecQuiz[topicId];
    if (!quiz || !quiz[qIndex]) return;

    const q = quiz[qIndex];
    try {
      const response = await fetch('/api/tec/explicar-gabarito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enunciado: q.question,
          alternativas: q.options,
          gabaritoIndex: q.answerIndex,
          subject: topics.find(t => t.id === topicId)?.subject || ''
        }),
      });

      const data = await response.json();
      if (data.explanation) {
        setTecQuiz(prev => {
          const updated = { ...prev };
          const updatedQuiz = [...updated[topicId]];
          updatedQuiz[qIndex] = { ...updatedQuiz[qIndex], explanation: data.explanation };
          updated[topicId] = updatedQuiz;
          return updated;
        });
      }
    } catch (err) {
      console.warn('Erro ao buscar explicacao:', err);
    }
  };

  // Export Progress Backup as JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(topics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `progresso_estudos_ete_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Progress Backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && 'id' in parsed[0]) {
            onImportData(parsed);
            alert("Progresso importado com sucesso!");
          } else {
            alert("Arquivo JSON inválido. Certifique-se de carregar um backup válido criado por este app.");
          }
        } catch (err) {
          alert("Erro ao ler arquivo. Formato de arquivo corrompido.");
        }
      };
    }
  };

  // Reusable Topic Card Renderer
  const renderTopicCard = (topic: SyllabusTopic) => {
    const isExpanded = expandedTopicId === topic.id;
    const hasExplanation = !!aiExplanation[topic.id];
    const hasQuiz = !!aiQuiz[topic.id];
    const hasTecQuiz = !!tecQuiz[topic.id];
    const resource = STUDY_RESOURCES[topic.id];

    return (
      <div 
        key={topic.id}
        className={`bg-dark-card rounded-2xl border transition-all duration-200 overflow-hidden ${
          isExpanded 
            ? 'border-gold/55 ring-2 ring-gold/5 shadow-lg' 
            : 'border-dark-border hover:border-gold/30 shadow-sm'
        }`}
      >
        {/* Header/Summary Line */}
        <div 
          onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
          className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`p-2 rounded-xl flex-shrink-0 border ${
              topic.subject === 'Língua Portuguesa' 
                ? 'bg-gold/10 text-gold border-gold/15' 
                : 'bg-gold/5 text-gold border-gold/10 opacity-80'
            }`}>
              {topic.subject === 'Língua Portuguesa' ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-gold block mb-0.5">
                {topic.section}
              </span>
              <h3 className="font-serif italic text-dark-text text-sm md:text-base truncate leading-none">
                {topic.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Status pills */}
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(topic.status)}`}>
              {topic.status === 'Teoria' ? 'Teoria' : topic.status}
            </span>

            {/* Study minutes indicator */}
            {topic.minutes > 0 && (
              <span className="text-xs font-mono font-semibold text-dark-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold/60" />
                {topic.minutes}m
              </span>
            )}

            {/* Stars confidence display */}
            {topic.confidence > 0 && (
              <div className="flex items-center gap-0.5 text-gold">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span className="text-xs font-bold font-mono">{topic.confidence}</span>
              </div>
            )}

            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-dark-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-dark-muted" />
            )}
          </div>
        </div>

        {/* Expanded Detail Panel */}
        {isExpanded && (
          <div className="border-t border-dark-border p-5 bg-dark-card-lighter rounded-b-2xl space-y-6">
            {/* Header for collapsible study/pomodoro panel */}
            <div className="flex items-center justify-between pb-1 border-b border-dark-border/40">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] block">
                  Painel de Progresso & Pomodoro
                </span>
                {pomoActive && pomoTopicId === topic.id && (
                  <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-[10px] px-2 py-0.5 rounded-full font-mono animate-pulse border border-gold/20">
                    <Clock className="w-3 h-3" />
                    Ativo: {Math.floor(pomoSecondsLeft / 60).toString().padStart(2, '0')}:${(pomoSecondsLeft % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
              <button
                onClick={() => setStudyParamsCollapsed(!studyParamsCollapsed)}
                className="text-[10px] font-bold text-gold hover:text-gold-hover transition flex items-center gap-1 bg-dark-card border border-dark-border hover:bg-dark-card-lighter px-2.5 py-1 rounded-lg shadow-sm"
              >
                {studyParamsCollapsed ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> Mostrar Painel de Estudos
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" /> Ocultar Painel para Espaço
                  </>
                )}
              </button>
            </div>

            {!studyParamsCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] block">Status do Estudo</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Não Iniciado', 'Teoria', 'Exercícios', 'Revisado'] as TopicStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(topic, st)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold text-center transition duration-200 ${
                          topic.status === st 
                            ? 'bg-gold border-gold text-dark-bg font-bold shadow-md' 
                            : 'bg-dark-card border-dark-border hover:bg-dark-bg text-dark-text'
                        }`}
                      >
                        {st === 'Teoria' ? 'Teoria' : st === 'Não Iniciado' ? 'Início' : st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence stars */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] block">Nível de Confiança</label>
                  <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-2.5 justify-around shadow-inner">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleConfidenceChange(topic, val)}
                        className="p-1 hover:scale-110 transition duration-150"
                      >
                        <Star className={`w-6 h-6 ${
                          topic.confidence >= val 
                            ? 'text-gold fill-gold' 
                            : 'text-dark-border'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Log study minutes / Pomodoro */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] block">
                      Pomodoro & Tempo de Estudo
                    </label>
                    <span className="text-[10px] text-dark-muted font-mono font-bold">
                      Total: <span className="text-gold">{topic.minutes}m</span> ({ (topic.minutes / 60).toFixed(1) }h)
                    </span>
                  </div>

                  {/* Integrated Pomodoro Widget */}
                  <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-3 shadow-inner">
                    {/* Timer Display and Sound Switch */}
                    <div className="flex items-center justify-between bg-dark-bg/40 px-3 py-2 rounded-lg border border-dark-border/40">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 text-gold ${pomoActive && pomoTopicId === topic.id ? 'pomo-pulse animate-pulse' : ''}`} />
                        <span className="text-xs font-mono font-bold text-dark-text">
                          {pomoTopicId === topic.id ? (
                            `${Math.floor(pomoSecondsLeft / 60).toString().padStart(2, '0')}:${(pomoSecondsLeft % 60).toString().padStart(2, '0')}`
                          ) : (
                            "25:00"
                          )}
                        </span>
                        <span className="text-[10px] text-dark-muted capitalize">
                          {pomoTopicId === topic.id ? (
                            pomoMode === 'work' ? '• foco' : '• pausa'
                          ) : (
                            '• pronto'
                          )}
                        </span>
                      </div>

                      {/* Audio control button */}
                      <button
                        onClick={() => setPomoSoundEnabled(!pomoSoundEnabled)}
                        className={`p-1 rounded transition ${pomoSoundEnabled ? 'text-gold' : 'text-dark-muted'}`}
                        title={pomoSoundEnabled ? "Alertas de voz ativados" : "Alertas de voz desativados"}
                      >
                        {pomoSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Mini Mode Selector if timer not running */}
                    {!(pomoActive && pomoTopicId === topic.id) && (
                      <div className="flex gap-1.5 bg-dark-bg p-0.5 rounded-lg border border-dark-border/60">
                        <button
                          onClick={() => {
                            setPomoTopicId(topic.id);
                            setPomoMode('work');
                            setPomoSecondsLeft(25 * 60);
                            setPomoSecondsAccumulated(0);
                            localStorage.removeItem('ete_pomo_end_time');
                          }}
                          className={`flex-1 py-1 rounded text-[9px] font-bold transition ${
                            pomoTopicId === topic.id && pomoMode === 'work'
                              ? 'bg-gold text-dark-bg font-extrabold'
                              : 'text-dark-muted hover:text-dark-text'
                          }`}
                        >
                          Foco (25m)
                        </button>
                        <button
                          onClick={() => {
                            setPomoTopicId(topic.id);
                            setPomoMode('shortBreak');
                            setPomoSecondsLeft(5 * 60);
                            setPomoSecondsAccumulated(0);
                            localStorage.removeItem('ete_pomo_end_time');
                          }}
                          className={`flex-1 py-1 rounded text-[9px] font-bold transition ${
                            pomoTopicId === topic.id && pomoMode === 'shortBreak'
                              ? 'bg-gold text-dark-bg font-extrabold'
                              : 'text-dark-muted hover:text-dark-text'
                          }`}
                        >
                          Pausa (5m)
                        </button>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          if (pomoTopicId !== topic.id) {
                            // Start brand new timer for this topic
                            setPomoTopicId(topic.id);
                            setPomoMode('work');
                            setPomoSecondsLeft(25 * 60);
                            setPomoSecondsAccumulated(0);
                            localStorage.setItem('ete_pomo_end_time', String(Date.now() + 25 * 60 * 1000));
                            setPomoActive(true);
                            playPomoAlert("Iniciando foco de vinte e cinco minutos neste assunto.");
                          } else {
                            // Toggle existing timer
                            if (!pomoActive) {
                              playPomoAlert(pomoMode === 'work' ? "Bom estudo." : "Aproveite a pausa.");
                              localStorage.setItem('ete_pomo_end_time', String(Date.now() + pomoSecondsLeft * 1000));
                            } else {
                              localStorage.removeItem('ete_pomo_end_time');
                            }
                            setPomoActive(!pomoActive);
                          }
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          pomoActive && pomoTopicId === topic.id
                            ? 'bg-[#e06c75] hover:bg-rose-500 text-dark-bg font-bold'
                            : 'bg-gold hover:bg-gold-hover text-dark-bg font-bold'
                        }`}
                      >
                        {pomoActive && pomoTopicId === topic.id ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Pausar
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Iniciar Foco
                          </>
                        )}
                      </button>

                      {(pomoTopicId === topic.id) && (
                        <button
                          onClick={() => {
                            setPomoActive(false);
                            localStorage.removeItem('ete_pomo_end_time');
                            setPomoSecondsLeft(pomoMode === 'work' ? 25 * 60 : 5 * 60);
                            setPomoSecondsAccumulated(0);
                          }}
                          className="p-2 bg-dark-bg border border-dark-border hover:bg-dark-card-lighter text-dark-muted hover:text-gold rounded-lg transition"
                          title="Reiniciar"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Active Studying / Live Adding feedback */}
                    {pomoTopicId === topic.id && pomoMode === 'work' && (
                      <div className="text-[10px] text-center bg-gold/5 border border-gold/15 py-1.5 px-2 rounded-lg text-gold font-mono flex items-center justify-center gap-1.5">
                        <Brain className="w-3 h-3 animate-bounce" />
                        <span>Somando segundos ao vivo: <b>+{pomoSecondsAccumulated}s</b></span>
                      </div>
                    )}
                  </div>

                  {/* Manual adjustments row */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button 
                      onClick={() => handleQuickAddMinutes(topic, 15)}
                      className="flex-1 bg-dark-card border border-dark-border hover:bg-dark-bg text-dark-text text-[10px] font-bold py-1.5 rounded-lg shadow-sm transition"
                    >
                      +15m
                    </button>
                    <button 
                      onClick={() => handleQuickAddMinutes(topic, 30)}
                      className="flex-1 bg-dark-card border border-dark-border hover:bg-dark-bg text-dark-text text-[10px] font-bold py-1.5 rounded-lg shadow-sm transition"
                    >
                      +30m
                    </button>
                    <button 
                      onClick={() => handleQuickAddMinutes(topic, 60)}
                      className="flex-1 bg-dark-card border border-dark-border hover:bg-dark-bg text-dark-text text-[10px] font-bold py-1.5 rounded-lg shadow-sm transition"
                    >
                      +1h
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Assistance Action block */}
            <div className="bg-gold/5 text-dark-text rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold/15 shadow-inner">
              <div className="space-y-1">
                <h4 className="font-serif italic text-gold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                  Tutor Virtual ETE PE
                </h4>
                <p className="text-dark-muted text-xs">
                  Utilize a inteligência artificial para dominar regras gramaticais e fórmulas passo a passo.
                </p>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <button
                  disabled={aiLoadingTopicId !== null}
                  onClick={() => handleExplainWithAI(topic)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg shadow-sm border transition duration-200 ${
                    hasExplanation 
                      ? 'bg-rose-950/25 text-rose-300 border-rose-900/50 hover:bg-rose-950/40' 
                      : 'bg-gold hover:bg-gold-hover text-dark-bg border-gold'
                  }`}
                >
                  {aiLoadingTopicId === topic.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{hasExplanation ? 'Fechar Explicação' : 'Explicar com IA'}</span>
                </button>

                <button
                  disabled={aiLoadingTopicId !== null}
                  onClick={() => handleQuizWithAI(topic)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg shadow-sm border transition duration-200 ${
                    hasQuiz 
                      ? 'bg-dark-bg text-dark-text border-dark-border hover:bg-dark-card' 
                      : 'bg-dark-bg hover:bg-dark-card text-gold border-gold/20'
                  }`}
                >
                  {aiLoadingTopicId === topic.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  <span>{hasQuiz ? 'Fechar Prática' : 'Gerar Questões IA'}</span>
                </button>

                {tecConfigured && (
                  <button
                    disabled={tecLoading !== null || aiLoadingTopicId !== null}
                    onClick={() => handleTecQuiz(topic)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg shadow-sm border transition duration-200 ${
                      hasTecQuiz
                        ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30 hover:bg-emerald-950/30'
                        : 'bg-dark-bg hover:bg-dark-card text-emerald-400 border-emerald-900/20'
                    }`}
                  >
                    {tecLoading === topic.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5" />
                    )}
                    <span>{hasTecQuiz ? 'Fechar TecConcursos' : 'TecConcursos'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* AI Explanation Pane */}
            {hasExplanation && (
              <div className="bg-dark-card rounded-xl border border-dark-border p-5 shadow-inner space-y-4 max-h-[450px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <span className="text-xs font-serif italic text-gold tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Explicação do Professor Virtual
                  </span>
                  <button 
                    onClick={() => handleExplainWithAI(topic)}
                    className="p-1 hover:bg-dark-bg rounded"
                  >
                    <X className="w-4 h-4 text-dark-muted" />
                  </button>
                </div>
                <div className="markdown-body text-dark-text text-sm leading-relaxed space-y-3 prose max-w-none">
                  <ReactMarkdown>{aiExplanation[topic.id]}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* AI Quiz Practicing Panel */}
            {hasQuiz && (
              <div className="bg-dark-card rounded-xl border border-dark-border p-5 shadow-inner space-y-5">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <span className="text-xs font-serif italic text-gold tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Questões de Fixação Personalizadas
                  </span>
                  <button 
                    onClick={() => handleQuizWithAI(topic)}
                    className="p-1 hover:bg-dark-bg rounded"
                  >
                    <X className="w-4 h-4 text-dark-muted" />
                  </button>
                </div>

                {/* Quiz list of 3 questions */}
                <div className="space-y-6">
                  {aiQuiz[topic.id].map((q, qIdx) => {
                    const selectedOpt = aiQuizAnswers[topic.id]?.[qIdx];
                    const isSubmitted = aiQuizSubmitted[topic.id];
                    const isCorrect = selectedOpt === q.answerIndex;

                    return (
                      <div key={qIdx} className="space-y-3 pb-5 border-b border-dark-border last:border-0 last:pb-0">
                        <h5 className="font-semibold text-dark-text text-sm leading-relaxed">
                          {qIdx + 1}. {q.question}
                        </h5>
                        
                        <div className="grid grid-cols-1 gap-2 pl-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            const isOptionCorrect = optIdx === q.answerIndex;

                            let optStyle = "border-dark-border hover:border-dark-muted hover:bg-dark-bg text-dark-text";
                            if (isSelected) {
                              optStyle = "border-gold bg-gold/10 text-gold font-medium";
                            }
                            if (isSubmitted) {
                              if (isOptionCorrect) {
                                optStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-semibold";
                              } else if (isSelected && !isCorrect) {
                                optStyle = "border-rose-500 bg-rose-950/20 text-rose-400";
                              } else {
                                optStyle = "border-dark-border opacity-50 text-dark-muted";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectQuizAnswer(topic.id, qIdx, optIdx)}
                                className={`text-left p-3.5 rounded-lg border text-xs transition duration-150 flex items-center justify-between ${optStyle}`}
                              >
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Correct/Incorrect tag and Explanation */}
                        {isSubmitted && selectedOpt !== undefined && (
                          <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                            isCorrect ? 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-300' : 'bg-rose-950/20 border border-rose-900/30 text-rose-300'
                          }`}>
                            <div className="font-bold mb-1">
                              {isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta!'}
                            </div>
                            <div className="text-dark-text opacity-90 leading-relaxed font-medium">{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit action */}
                {!aiQuizSubmitted[topic.id] ? (
                  <button
                    onClick={() => handleSubmitQuiz(topic.id)}
                    disabled={Object.keys(aiQuizAnswers[topic.id] || {}).length < aiQuiz[topic.id].length}
                    className="w-full bg-gold hover:bg-gold-hover text-dark-bg disabled:bg-dark-bg disabled:text-dark-muted disabled:border-dark-border disabled:cursor-not-allowed border border-transparent text-xs font-bold py-2.5 rounded-lg shadow transition duration-200"
                  >
                    Confirmar Respostas das 3 Questões
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-dark-bg border border-dark-border p-3.5 rounded-xl">
                    <span className="text-xs text-dark-muted font-semibold font-mono">
                      Acertos: {
                        aiQuiz[topic.id].filter((q, idx) => aiQuizAnswers[topic.id]?.[idx] === q.answerIndex).length
                      } de 3
                    </span>
                    <button
                      onClick={() => {
                        const copy = { ...aiQuiz };
                        delete copy[topic.id];
                        setAiQuiz(copy);
                      }}
                      className="text-gold hover:text-gold-hover text-xs font-bold"
                    >
                      Tentar Outro Assunto
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TecConcursos Quiz Panel */}
            {hasTecQuiz && (
              <div className="bg-dark-card rounded-xl border border-emerald-900/30 p-5 shadow-inner space-y-5">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <div>
                    <span className="text-xs font-serif italic text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Questões Reais - TecConcursos
                    </span>
                    {tecSource[topic.id] && (
                      <span className="text-[10px] text-dark-muted font-mono block mt-0.5">{tecSource[topic.id]}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleTecQuiz(topic)}
                    className="p-1 hover:bg-dark-bg rounded"
                  >
                    <X className="w-4 h-4 text-dark-muted" />
                  </button>
                </div>

                <div className="space-y-6">
                  {tecQuiz[topic.id].map((q, qIdx) => {
                    const selectedOpt = tecQuizAnswers[topic.id]?.[qIdx];
                    const isSubmitted = tecQuizSubmitted[topic.id];
                    const isCorrect = selectedOpt === q.answerIndex;

                    return (
                      <div key={qIdx} className="space-y-3 pb-5 border-b border-dark-border last:border-0 last:pb-0">
                        <h5 className="font-semibold text-dark-text text-sm leading-relaxed">
                          {qIdx + 1}. {q.question}
                        </h5>

                        <div className="grid grid-cols-1 gap-2 pl-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            const isOptionCorrect = optIdx === q.answerIndex;

                            let optStyle = "border-dark-border hover:border-dark-muted hover:bg-dark-bg text-dark-text";
                            if (isSelected) {
                              optStyle = "border-emerald-500 bg-emerald-950/10 text-emerald-400 font-medium";
                            }
                            if (isSubmitted) {
                              if (isOptionCorrect) {
                                optStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-semibold";
                              } else if (isSelected && !isCorrect) {
                                optStyle = "border-rose-500 bg-rose-950/20 text-rose-400";
                              } else {
                                optStyle = "border-dark-border opacity-50 text-dark-muted";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectTecAnswer(topic.id, qIdx, optIdx)}
                                className={`text-left p-3.5 rounded-lg border text-xs transition duration-150 flex items-center justify-between ${optStyle}`}
                              >
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {isSubmitted && (
                          <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                            isCorrect ? 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-300' : 'bg-rose-950/20 border border-rose-900/30 text-rose-300'
                          }`}>
                            <div className="font-bold mb-1 flex items-center justify-between">
                              <span>{isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta!'}</span>
                              {q.explanation.includes('Clique em') && (
                                <button
                                  onClick={() => handleExplicarGabarito(topic.id, qIdx)}
                                  className="text-[10px] px-2 py-0.5 bg-dark-bg border border-dark-border rounded text-gold hover:text-gold-hover transition"
                                >
                                  Explicar Gabarito (IA)
                                </button>
                              )}
                            </div>
                            <div className="text-dark-text opacity-90 leading-relaxed font-medium">{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!tecQuizSubmitted[topic.id] ? (
                  <button
                    onClick={() => handleSubmitTecQuiz(topic.id)}
                    disabled={Object.keys(tecQuizAnswers[topic.id] || {}).length < tecQuiz[topic.id].length}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-dark-bg disabled:text-dark-muted disabled:border-dark-border disabled:cursor-not-allowed border border-transparent text-xs font-bold py-2.5 rounded-lg shadow transition duration-200"
                  >
                    Confirmar Respostas
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-dark-bg border border-dark-border p-3.5 rounded-xl">
                    <span className="text-xs text-dark-muted font-semibold font-mono">
                      Acertos: {
                        tecQuiz[topic.id].filter((q, idx) => tecQuizAnswers[topic.id]?.[idx] === q.answerIndex).length
                      } de {tecQuiz[topic.id].length}
                    </span>
                    <button
                      onClick={() => handleTecQuiz(topic)}
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-bold"
                    >
                      Buscar Novas Questões
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Videoaulas & Questões Práticas (TecConcursos) */}
            <div className="space-y-6 pt-5 border-t border-dark-border/70">
              {/* Column 1: Video Lessons Player & Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-rose-500" /> Videoaulas Recomendadas
                  </h4>
                  <span className="text-[10px] text-dark-muted font-mono">Assista para aprender</span>
                </div>

                {(() => {
                  const combinedVideos = getCombinedVideos(topic.id);
                  if (combinedVideos.length === 0) {
                    return (
                      <div className="text-center py-8 bg-dark-bg border border-dark-border rounded-xl">
                        <p className="text-xs text-dark-muted italic">Nenhuma videoaula catalogada para este tópico.</p>
                      </div>
                    );
                  }
                  const firstVideoId = combinedVideos[0].youtubeId;
                  const activeVideoId = activeVideoIds[topic.id] || firstVideoId;
                  const activeVid = combinedVideos.find(v => v.youtubeId === activeVideoId) || combinedVideos[0];
                  
                  return (
                    <div className="space-y-3">
                      {/* Responsive iframe wrapper for 16:9 YouTube video player */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-dark-border bg-black shadow-lg">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0`}
                          title={activeVid.title || "Videoaula"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          className="absolute inset-0 w-full h-full"
                        ></iframe>
                      </div>


                      {/* YouTube embed fallback and direct link buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gold/5 border border-gold/15 rounded-xl p-3 text-xs">
                        <div className="flex items-center gap-2 text-gold">
                          <Youtube className="w-4 h-4 text-gold flex-shrink-0" />
                          <span className="leading-tight">Vídeo recomendado: <b>{activeVid.channel || "Professor"}</b></span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              (topic.subject === "Língua Portuguesa" ? "Professor Noslen " : "Gis com Giz ") + topic.title
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-initial text-center px-3 py-1.5 bg-dark-bg border border-dark-border hover:border-gold/40 text-dark-text font-bold rounded-lg text-[10px] transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Search className="w-3.5 h-3.5 text-gold" />
                            <span>Buscar no YT</span>
                          </a>
                          <a
                            href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-initial text-center px-4 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 hover:border-gold/30 font-bold rounded-lg text-[10px] transition duration-150 flex items-center justify-center gap-1 shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir Original</span>
                          </a>
                        </div>
                      </div>

                      {/* Selector tabs for multiple recommended videos */}
                      {combinedVideos.length > 1 && (
                        <div className="flex flex-col gap-1.5">
                          {combinedVideos.map((vid, index) => {
                            const isCurrentActive = vid.youtubeId === activeVideoId;

                            return (
                              <button
                                key={index}
                                onClick={() => setActiveVideoIds(prev => ({ ...prev, [topic.id]: vid.youtubeId }))}
                                className={`flex items-center justify-between text-left p-2.5 rounded-xl border text-xs transition-all duration-200 ${
                                  isCurrentActive
                                    ? 'bg-gold/10 border-gold/40 text-gold font-medium ring-1 ring-gold/10'
                                    : 'bg-dark-card border-dark-border hover:border-gold/30 hover:bg-dark-card-lighter text-dark-text'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`p-1 rounded-lg ${isCurrentActive ? 'bg-gold/20 text-gold' : 'bg-dark-bg text-dark-muted'}`}>
                                    <Play className="w-3 h-3 fill-current" />
                                  </div>
                                  <div className="truncate">
                                    <p className="font-semibold truncate leading-normal mb-0.5">{vid.title}</p>
                                    <p className="text-[10px] text-dark-muted leading-none font-mono">Canal: {vid.channel}</p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                                  isCurrentActive 
                                    ? 'bg-gold/20 border-gold/25 text-gold' 
                                    : 'bg-dark-bg border-dark-border text-dark-muted'
                                }`}>
                                  {isCurrentActive ? 'Rodando' : 'Assistir'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Column 2: TecConcursos Practice */}
              <div className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-gold" /> Prática de Questões (TecConcursos)
                    </h4>
                    <span className="text-[10px] text-dark-muted font-mono">Foco e Produtividade</span>
                  </div>

                  <div className="bg-dark-card border border-dark-border rounded-xl p-4 space-y-4 shadow-sm">
                    <div>
                      <p className="text-xs text-dark-text leading-relaxed">
                        Aprovados estudam resolvendo dezenas de questões todos os dias. Criamos um atalho de redirecionamento inteligente para filtrar questões exatas sobre:
                      </p>
                      <span className="inline-block mt-2 px-3 py-1.5 bg-gold/5 border border-gold/15 text-gold font-serif italic text-xs rounded-lg">
                        "{resource?.tecQuery || topic.title}"
                      </span>
                    </div>

                    <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-dark-muted block font-bold">Roteiro de Treino Sugerido</span>
                      <ul className="text-xs text-dark-muted space-y-1.5 list-disc pl-4 leading-normal">
                        <li>Filtre por questões de nível <strong className="text-gold font-semibold">Médio / Técnico</strong> no site.</li>
                        <li>Selecione bancas como <strong className="text-gold font-semibold">IAUPE</strong> se disponíveis, ou use bancas de renome (Vunesp, FCC).</li>
                        <li>Estipule uma meta mínima de <strong className="text-gold font-semibold">10 a 15 questões</strong> para este assunto hoje.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://www.tecconcursos.com.br/questoes?q=${encodeURIComponent(resource?.tecQuery || topic.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gold hover:bg-gold-hover text-dark-bg text-xs font-extrabold py-3.5 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-lg active:scale-95 border border-transparent"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span>Praticar Questões no TecConcursos</span>
                </a>
              </div>
            </div>

            {/* Personal notes section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] flex items-center gap-1">
                  <Save className="w-3.5 h-3.5 text-gold/60" /> Meus Apontamentos e Resumos
                </label>
                <span className="text-[10px] text-dark-muted font-mono font-medium">Salva automaticamente ao digitar</span>
              </div>
              <textarea
                placeholder="Escreva aqui suas fórmulas, resumos de regras gramaticais, atalhos de resolução ou as pegadinhas que você descobriu resolvendo exercícios..."
                value={topic.notes}
                onChange={(e) => handleNotesChange(topic, e.target.value)}
                className="w-full h-32 border border-dark-border rounded-xl p-3 text-xs bg-dark-bg text-dark-text focus:outline-none focus:ring-2 focus:ring-gold transition shadow-inner placeholder:italic placeholder:text-dark-muted"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-dark-card border border-dark-border p-4 rounded-2xl shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-base font-serif italic text-gold">Planejamento & Edital</h2>
          <p className="text-xs text-dark-muted">Organize sua rotina de estudos de forma eficiente e estruturada.</p>
        </div>
        <div className="flex rounded-lg bg-dark-bg p-0.5 border border-dark-border self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode('chronogram')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md font-semibold transition text-xs flex items-center justify-center gap-1.5 ${
              viewMode === 'chronogram'
                ? 'bg-gold text-dark-bg font-extrabold shadow-sm'
                : 'text-dark-muted hover:text-gold'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Cronograma Recomendado
          </button>
          <button
            onClick={() => setViewMode('subject')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md font-semibold transition text-xs flex items-center justify-center gap-1.5 ${
              viewMode === 'subject'
                ? 'bg-gold text-dark-bg font-extrabold shadow-sm'
                : 'text-dark-muted hover:text-gold'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Estrutura do Edital
          </button>
        </div>
      </div>

      {/* Search and filter toolbar */}
      <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-dark-muted" />
            <input 
              type="text" 
              placeholder="Pesquisar por assunto do edital (ex: frações, sintaxe)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-dark-text placeholder:text-dark-muted focus:bg-dark-card-lighter focus:outline-none focus:ring-2 focus:ring-gold transition"
            />
          </div>

          {/* Backup controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button 
              onClick={handleExportData}
              title="Exportar Progresso (Backup JSON)"
              className="flex items-center gap-1.5 px-3 py-2 border border-dark-border hover:bg-dark-card-lighter text-dark-text rounded-lg text-xs font-semibold transition"
            >
              <FileDown className="w-3.5 h-3.5 text-gold" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <label 
              title="Importar Progresso (Backup JSON)"
              className="flex items-center gap-1.5 px-3 py-2 border border-dark-border hover:bg-dark-card-lighter text-dark-text rounded-lg text-xs font-semibold cursor-pointer transition"
            >
              <FileUp className="w-3.5 h-3.5 text-gold" />
              <span className="hidden sm:inline">Importar</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportData}
                className="hidden" 
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between text-xs pt-3 border-t border-dark-border">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Subject filter buttons */}
            <div className="flex items-center gap-2">
              <span className="text-dark-muted font-medium uppercase tracking-wider text-[10px]">Matéria:</span>
              <div className="flex rounded-lg bg-dark-bg p-0.5 border border-dark-border">
                {(['Todos', 'Língua Portuguesa', 'Matemática'] as const).map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition text-xs ${
                      selectedSubject === sub 
                        ? 'bg-gold/15 text-gold font-bold shadow-inner' 
                        : 'text-dark-muted hover:text-gold'
                    }`}
                  >
                    {sub === 'Língua Portuguesa' ? 'Português' : sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-dark-muted font-medium uppercase tracking-wider text-[10px]">Status:</span>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-dark-bg border border-dark-border rounded px-2.5 py-1 text-dark-text text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Não Iniciado">Não Iniciado</option>
                <option value="Teoria">Em Teoria</option>
                <option value="Exercícios">Exercícios</option>
                <option value="Revisado">Revisado</option>
              </select>
            </div>
          </div>

          <div className="text-dark-muted font-medium text-xs">
            Exibindo <span className="font-bold text-gold">{filteredTopics.length}</span> de {topics.length} assuntos
          </div>
        </div>
      </div>

      {/* Global AI feedback line if any */}
      {aiError && (
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 text-rose-300 text-xs flex items-center justify-between">
          <span className="font-medium">Aviso da IA: {aiError}</span>
          <button onClick={() => setAiError(null)}>
            <X className="w-4 h-4 hover:text-white" />
          </button>
        </div>
      )}

      {/* Topic lists wrapper */}
      <div className="space-y-6">
        {viewMode === 'chronogram' ? (
          // Grouped by Chronogram Days
          <div className="space-y-4">
            {DAYS_METADATA.map((dayData) => {
              // Find topics assigned to this day
              const dayTopics = filteredTopics.filter(t => dayData.topicIds.includes(t.id));
              
              // Sort day topics in the exact order specified in dayData.topicIds
              dayTopics.sort((a, b) => dayData.topicIds.indexOf(a.id) - dayData.topicIds.indexOf(b.id));

              // All topics assigned to this day (unfiltered, for proper progress calculation)
              const allDayTopics = topics.filter(t => dayData.topicIds.includes(t.id));
              const completedInDay = allDayTopics.filter(t => t.status === 'Revisado').length;
              const hasTopics = allDayTopics.length > 0;
              const dayProgressPercent = hasTopics ? Math.round((completedInDay / allDayTopics.length) * 100) : 100;

              // If a search filter is active AND the day has topics AND none of the topics match the search filter, hide the day
              const searchIsActive = searchTerm.trim() !== '' || selectedSubject !== 'Todos' || selectedStatus !== 'Todos';
              if (searchIsActive && hasTopics && dayTopics.length === 0) {
                return null;
              }

              const isExpanded = expandedDay === dayData.day;

              return (
                <div key={dayData.day} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                  {/* Day Header Trigger */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : dayData.day)}
                    className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-dark-card to-dark-card-lighter hover:from-dark-card-lighter hover:to-dark-card-lighter/80 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl border flex-shrink-0 flex items-center justify-center transition-all ${
                        isExpanded 
                          ? 'bg-gold/15 text-gold border-gold/30' 
                          : dayProgressPercent === 100 && hasTopics
                          ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                          : 'bg-dark-bg text-dark-muted border-dark-border'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            dayProgressPercent === 100 && hasTopics
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                              : 'bg-gold/10 text-gold border-gold/15'
                          }`}>
                            Dia {dayData.day.toString().padStart(2, '0')}
                          </span>
                          {dayProgressPercent === 100 && hasTopics && (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              Concluido
                            </span>
                          )}
                          {!hasTopics && (
                            <span className="bg-purple-950/20 text-purple-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-purple-900/30 uppercase tracking-wider">
                              Revisão & Prática
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif italic text-dark-text text-sm md:text-base font-semibold truncate">
                          {dayData.title}
                        </h4>
                      </div>
                    </div>

                    {/* Progress indicator or collapsible icon */}
                    <div className="flex items-center gap-4 self-end sm:self-auto flex-shrink-0">
                      {hasTopics && (
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] font-semibold text-dark-muted">Progresso</div>
                          <div className="text-xs font-bold text-gold">{completedInDay}/{allDayTopics.length} Tópicos</div>
                        </div>
                      )}
                      <div className="p-1 rounded-lg bg-dark-bg/50 text-dark-muted hover:text-dark-text transition">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Day Content Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-dark-card-lighter/10 border-t border-dark-border/40 space-y-4">
                      <p className="text-xs text-dark-muted leading-relaxed font-medium">
                        {dayData.subtitle}
                      </p>

                      {hasTopics ? (
                        /* List of topics belonging to this day */
                        <div className="space-y-4 pl-1 sm:pl-3 border-l border-gold/10">
                          {dayTopics.length > 0 ? (
                            dayTopics.map((topic) => renderTopicCard(topic))
                          ) : (
                            <div className="p-4 bg-dark-bg/40 rounded-xl border border-dashed border-dark-border text-center text-xs text-dark-muted">
                              Nenhum tópico deste dia atende aos filtros ativos de matéria/status.
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Custom rich text instructions for review/simulado days */
                        <div className="bg-dark-bg/60 border border-dark-border p-5 rounded-2xl space-y-4 shadow-inner">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">Roteiro de Consolidação de Estudos</span>
                            <h5 className="font-serif italic text-dark-text text-sm font-semibold">Como aproveitar este dia de revisão e simulados:</h5>
                          </div>
                          
                          <ul className="text-xs text-dark-muted space-y-2 list-disc pl-5 leading-normal">
                            <li><strong>Revisão Ativa de Erros:</strong> Acesse a aba de tópicos do edital, filtre os assuntos com confiança baixa e revise as anotações e resumos salvos anteriormente.</li>
                            <li><strong>Simulado de Questões:</strong> Dedique 60 minutos para responder a um bloco de questões ou realizar um simulado completo para testar sua velocidade de prova.</li>
                            <li><strong>Tutor IA de Reforço:</strong> Utilize a aba <strong>Tutor IA</strong> para tirar dúvidas imediatas sobre o que você errou ou pedir para criar novos exercícios práticos baseados nas matérias estudadas até aqui.</li>
                          </ul>

                          <div className="pt-2 flex flex-wrap gap-2.5">
                            <a
                              href="https://www.tecconcursos.com.br/questoes"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold font-bold border border-gold/20 hover:border-gold/30 rounded-xl text-xs transition animate-pulse"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Abrir Banco do TecConcursos</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredTopics.length === 0 && (
              <div className="text-center py-12 bg-dark-card border border-dark-border rounded-2xl">
                <GraduationCap className="w-12 h-12 text-dark-muted mx-auto mb-2" />
                <h4 className="font-serif italic text-gold text-sm">Nenhum assunto encontrado</h4>
                <p className="text-dark-muted text-xs max-w-sm mx-auto mt-1">Tente alterar os termos de pesquisa ou remover os filtros de matéria e status.</p>
              </div>
            )}
          </div>
        ) : (
          // Default Subject Listing
          <div className="space-y-3">
            {filteredTopics.map((topic) => renderTopicCard(topic))}

            {filteredTopics.length === 0 && (
              <div className="text-center py-12 bg-dark-card border border-dark-border rounded-2xl">
                <GraduationCap className="w-12 h-12 text-dark-muted mx-auto mb-2" />
                <h4 className="font-serif italic text-gold text-sm">Nenhum assunto encontrado</h4>
                <p className="text-dark-muted text-xs max-w-sm mx-auto mt-1">Tente alterar os termos de pesquisa ou remover os filtros de matéria e status.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
