/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SyllabusTopic } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Flame, 
  Award, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  BookMarked
} from 'lucide-react';

interface DashboardProps {
  topics: SyllabusTopic[];
  onTabChange: (tab: string) => void;
}

export default function Dashboard({ topics, onTabChange }: DashboardProps) {
  const [countdownReg, setCountdownReg] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownExam, setCountdownExam] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [streak, setStreak] = useState(1);

  // Load streak
  useEffect(() => {
    const savedStreak = localStorage.getItem('ete_study_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    } else {
      localStorage.setItem('ete_study_streak', '1');
    }
  }, []);

  // Countdown calculations
  useEffect(() => {
    const calculateCountdowns = () => {
      const now = new Date().getTime();
      
      // Registration end: July 2nd, 2026
      const regEnd = new Date('2026-07-02T23:59:59-03:00').getTime();
      const examStart = new Date('2026-07-06T08:00:00-03:00').getTime();

      const diffReg = regEnd - now;
      const diffExam = examStart - now;

      if (diffReg > 0) {
        setCountdownReg({
          days: Math.floor(diffReg / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffReg % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diffReg % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diffReg % (1000 * 60)) / 1000),
        });
      } else {
        setCountdownReg({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      if (diffExam > 0) {
        setCountdownExam({
          days: Math.floor(diffExam / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffExam % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diffExam % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diffExam % (1000 * 60)) / 1000),
        });
      } else {
        setCountdownExam({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.status === 'Revisado').length;
  const inProgressTopics = topics.filter(t => t.status === 'Teoria' || t.status === 'Exercícios').length;
  const completionPercentage = Math.round((completedTopics / totalTopics) * 100) || 0;
  
  const totalMinutes = topics.reduce((acc, t) => acc + t.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const portTopics = topics.filter(t => t.subject === 'Língua Portuguesa');
  const portCompleted = portTopics.filter(t => t.status === 'Revisado').length;
  const portPercentage = Math.round((portCompleted / portTopics.length) * 100) || 0;

  const matTopics = topics.filter(t => t.subject === 'Matemática');
  const matCompleted = matTopics.filter(t => t.status === 'Revisado').length;
  const matPercentage = Math.round((matCompleted / matTopics.length) * 100) || 0;

  // Group minutes by section for the chart
  const sectionsDataMap: { [key: string]: { name: string, minutos: number, subject: string } } = {};
  topics.forEach(topic => {
    if (topic.minutes > 0) {
      if (!sectionsDataMap[topic.section]) {
        sectionsDataMap[topic.section] = {
          name: topic.section,
          minutos: 0,
          subject: topic.subject
        };
      }
      sectionsDataMap[topic.section].minutos += topic.minutes;
    }
  });

  const chartData = Object.values(sectionsDataMap);

  // If no study time has been logged yet, show some placeholder categories to guide
  const defaultChartData = [
    { name: 'Compreensão', minutos: 0, subject: 'Língua Portuguesa' },
    { name: 'Gramática', minutos: 0, subject: 'Língua Portuguesa' },
    { name: 'Aritmética', minutos: 0, subject: 'Matemática' },
    { name: 'Álgebra', minutos: 0, subject: 'Matemática' },
    { name: 'Geometria', minutos: 0, subject: 'Matemática' },
  ];

  const activeChartData = chartData.length > 0 ? chartData : defaultChartData;

  const getDicaDeHoje = () => {
    const dicas = [
      "Foco na Regra de Três: é assunto garantido todo ano na prova de Matemática!",
      "Língua Portuguesa cobra muito interpretação e sinônimos. Leia as alternativas com atenção ao contexto.",
      "As classes gramaticais são a base da sintaxe. Certifique-se de dominar Conjunções e Pronomes.",
      "A prova dura apenas 60 minutos para 20 questões. Isso dá exatamente 3 minutos por questão!",
      "Não deixe nenhuma questão em branco! Na prova da ETE PE, cada acerto conta e não há penalidade por erro.",
      "As questões de Geometria Plana sempre cobram áreas de triângulos e retângulos. Decore as fórmulas!",
      "Acentuação e Novo Acordo Ortográfico: revise as regras de dupla vogal (como em 'veem') e ditongos abertos."
    ];
    // Pick based on today's day of week or day number
    const day = new Date().getDate();
    return dicas[day % dicas.length];
  };

  return (
    <div className="space-y-6">
      {/* Header card with Welcome & Streak */}
      <div className="bg-gradient-to-r from-dark-card to-dark-card-lighter rounded-2xl p-6 text-dark-text border border-dark-border shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none translate-x-10 -translate-y-10">
          <Award className="w-64 h-64 text-gold" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="bg-gold/15 text-gold text-xs font-mono px-3 py-1 rounded-full border border-gold/20 tracking-wider">
              ETE Subsequente 2026.2
            </span>
            <h1 className="text-2xl md:text-3xl font-serif italic text-gold tracking-wide">
              Olá! Pronto para conquistar sua vaga?
            </h1>
            <p className="text-dark-muted text-sm max-w-2xl leading-relaxed">
              Faltam poucos dias para as provas. Acompanhe seu progresso por tópicos, treine com simulados e utilize nossa inteligência artificial para dominar o edital.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gold/5 px-4 py-3 rounded-xl border border-gold/15 backdrop-blur-sm self-start md:self-auto">
            <Flame className="w-8 h-8 text-gold animate-pulse fill-gold/25" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-dark-muted">Ofensiva de Estudos</div>
              <div className="text-base font-bold text-gold">{streak} {streak === 1 ? 'Dia' : 'Dias'} Seguidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown and Deadlines widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Countdown Registration */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-dark-muted text-xs font-medium">
              <Calendar className="w-4 h-4 text-gold" />
              <span className="uppercase tracking-wider text-[10px]">Inscrições Encerram em</span>
            </div>
            <div className="text-base font-serif text-dark-text">02 de Julho de 2026</div>
            <p className="text-xs text-dark-muted">Gratuito via educacao.pe.gov.br</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gold/10 text-gold px-3 py-2 rounded-lg font-mono text-xs font-semibold border border-gold/15">
            {countdownReg.days > 0 || countdownReg.hours > 0 || countdownReg.minutes > 0 || countdownReg.seconds > 0 ? (
              <>
                <span className="text-sm font-bold">{String(countdownReg.days).padStart(2, '0')}</span><span>d</span>
                <span className="text-sm font-bold ml-1">{String(countdownReg.hours).padStart(2, '0')}</span><span>h</span>
                <span className="text-sm font-bold ml-1">{String(countdownReg.minutes).padStart(2, '0')}</span><span>m</span>
                <span className="text-sm font-bold ml-1">{String(countdownReg.seconds).padStart(2, '0')}</span><span>s</span>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wider">Encerradas</span>
            )}
          </div>
        </div>

        {/* Countdown Provas */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-dark-muted text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-[#e06c75]" />
              <span className="uppercase tracking-wider text-[10px]">Início das Provas Objetivas</span>
            </div>
            <div className="text-base font-serif text-dark-text">06 de Julho de 2026</div>
            <p className="text-xs text-dark-muted">Formato eletrônico presencial</p>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-950/20 text-rose-400 px-3 py-2 rounded-lg font-mono text-xs font-semibold border border-rose-900/30">
            {countdownExam.days > 0 || countdownExam.hours > 0 || countdownExam.minutes > 0 || countdownExam.seconds > 0 ? (
              <>
                <span className="text-sm font-bold">{String(countdownExam.days).padStart(2, '0')}</span><span>d</span>
                <span className="text-sm font-bold ml-1">{String(countdownExam.hours).padStart(2, '0')}</span><span>h</span>
                <span className="text-sm font-bold ml-1">{String(countdownExam.minutes).padStart(2, '0')}</span><span>m</span>
                <span className="text-sm font-bold ml-1">{String(countdownExam.seconds).padStart(2, '0')}</span><span>s</span>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wider">Em Andamento</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Study Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total hours studied */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-dark-muted font-bold">Tempo de Estudo</span>
            <div className="p-2 bg-gold/10 text-gold rounded-lg border border-gold/15">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-serif text-dark-text font-semibold">{totalHours} <span className="text-xs font-sans text-dark-muted">horas</span></div>
            <p className="text-[11px] text-dark-muted">Acumulado em revisões e pomodoros</p>
          </div>
        </div>

        {/* Syllabus completion % */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-dark-muted font-bold">Progresso Geral</span>
            <div className="p-2 bg-gold/10 text-gold rounded-lg border border-gold/15">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-serif text-dark-text font-semibold">{completionPercentage}%</div>
            <div className="w-full bg-dark-border rounded-full h-1">
              <div 
                className="bg-gold h-1 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-dark-muted">{completedTopics} de {totalTopics} tópicos concluídos</p>
          </div>
        </div>

        {/* Portuguese Progress */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-dark-muted font-bold">Língua Portuguesa</span>
            <div className="p-2 bg-gold/10 text-gold rounded-lg border border-gold/15">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-serif text-dark-text font-semibold">{portPercentage}%</div>
            <div className="w-full bg-dark-border rounded-full h-1">
              <div 
                className="bg-gold/70 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${portPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-dark-muted">{portCompleted} de {portTopics.length} revisados</p>
          </div>
        </div>

        {/* Mathematics Progress */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-dark-muted font-bold">Matemática</span>
            <div className="p-2 bg-gold/10 text-gold rounded-lg border border-gold/15">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-serif text-dark-text font-semibold">{matPercentage}%</div>
            <div className="w-full bg-dark-border rounded-full h-1">
              <div 
                className="bg-gold/40 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${matPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-dark-muted">{matCompleted} de {matTopics.length} revisados</p>
          </div>
        </div>
      </div>

      {/* Main Section: Chart + Study Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts chart showing study minutes per area */}
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <h3 className="font-serif italic text-dark-text text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              Tempo Dedicado por Seção do Edital
            </h3>
            <p className="text-xs text-dark-muted">Distribuição do seu tempo de estudos em minutos por assunto.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#8e8e93' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#8e8e93' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(197, 163, 104, 0.05)' }}
                  contentStyle={{ background: '#151518', border: '1px solid #2a2a2e', borderRadius: '12px', color: '#e2e2e4', fontSize: '12px' }}
                />
                <Bar dataKey="minutos" radius={[4, 4, 0, 0]}>
                  {activeChartData.map((entry, index) => {
                    // Sophisticated monochromatic gold scheme
                    const color = entry.subject === 'Língua Portuguesa' ? '#c5a368' : '#a38148';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {chartData.length === 0 && (
            <div className="text-center py-2 text-[10px] uppercase tracking-wider text-dark-muted bg-dark-bg border border-dark-border rounded-xl mt-4 italic">
              Gráfico ilustrativo. Comece a registrar horas de estudo para ver seu progresso real!
            </div>
          )}
        </div>

        {/* Tip of the day & Quick Actions */}
        <div className="space-y-4">
          {/* Tip of the day */}
          <div className="bg-gold/5 border border-gold/15 rounded-2xl p-5 space-y-3">
            <h4 className="font-serif italic text-gold text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold" />
              Dica de Ouro de Hoje
            </h4>
            <p className="text-dark-text opacity-90 text-xs leading-relaxed italic">
              "{getDicaDeHoje()}"
            </p>
          </div>

          {/* Quick links to actions */}
          <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-md space-y-3">
            <h4 className="font-serif italic text-dark-text text-sm">Ações Rápidas de Estudo</h4>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => onTabChange('edital')}
                className="flex items-center justify-between p-3.5 bg-dark-bg hover:bg-gold/10 text-dark-text border border-dark-border hover:border-gold/20 rounded-xl text-xs font-semibold text-left transition duration-200"
              >
                <span>Explorar Edital & Syllabus</span>
                <span className="text-gold">&rarr;</span>
              </button>
              <button 
                onClick={() => onTabChange('edital')}
                className="flex items-center justify-between p-3.5 bg-dark-bg hover:bg-gold/10 text-dark-text border border-dark-border hover:border-gold/20 rounded-xl text-xs font-semibold text-left transition duration-200"
              >
                <span>Usar Cronômetro Pomodoro nos Assuntos</span>
                <span className="text-gold">&rarr;</span>
              </button>
              <button 
                onClick={() => onTabChange('simulado')}
                className="flex items-center justify-between p-3.5 bg-dark-bg hover:bg-gold/10 text-dark-text border border-dark-border hover:border-gold/20 rounded-xl text-xs font-semibold text-left transition duration-200"
              >
                <span>Responder Simulado ETE</span>
                <span className="text-gold">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
