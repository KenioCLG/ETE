/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { SyllabusTopic } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Clock, 
  Volume2,
  VolumeX,
  FastForward
} from 'lucide-react';

interface PomodoroTimerProps {
  topics: SyllabusTopic[];
  onAddMinutes: (topicId: string, minutes: number) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export default function PomodoroTimer({ topics, onAddMinutes }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const incrementInterval = useRef<any>(null);

  // Initialize selected topic to first in list if available
  useEffect(() => {
    if (topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  // Mode intervals
  const getModeDuration = (m: TimerMode) => {
    switch (m) {
      case 'work': return 25 * 60;
      case 'shortBreak': return 5 * 60;
      case 'longBreak': return 15 * 60;
    }
  };

  // Switch modes
  const handleSwitchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(getModeDuration(newMode));
  };

  // Play audio alerts using Browser Speech Synthesis (zero dependency, highly stable)
  const playAlert = (text: string) => {
    if (soundEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (isActive) {
      incrementInterval.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(incrementInterval.current);
            setIsActive(false);

            // Timer finished actions
            if (mode === 'work') {
              playAlert("Foco concluído! Hora de uma pausa de cinco minutos.");
              // Auto log 25 minutes to selected topic!
              if (selectedTopicId) {
                onAddMinutes(selectedTopicId, 25);
                const topicObj = topics.find(t => t.id === selectedTopicId);
                alert(`Parabéns! Você completou um ciclo de estudos! Adicionamos 25 minutos de estudo ao assunto "${topicObj?.title || ''}".`);
              } else {
                alert("Parabéns! Você completou um ciclo de estudos. Selecione um assunto para registrar seus minutos!");
              }
              setMode('shortBreak');
              return 5 * 60;
            } else {
              playAlert("Pausa concluída! Vamos voltar aos estudos?");
              setMode('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (incrementInterval.current) clearInterval(incrementInterval.current);
    }

    return () => {
      if (incrementInterval.current) clearInterval(incrementInterval.current);
    };
  }, [isActive, mode, selectedTopicId, onAddMinutes]);

  const handleToggle = () => {
    if (!isActive) {
      playAlert(mode === 'work' ? "Bom estudo." : "Aproveite a pausa.");
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(getModeDuration(mode));
  };

  const handleSkip = () => {
    setIsActive(false);
    if (mode === 'work') {
      handleSwitchMode('shortBreak');
    } else {
      handleSwitchMode('work');
    }
  };

  // Time format
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const totalDuration = getModeDuration(mode);
  const percentageCompleted = ((totalDuration - secondsLeft) / totalDuration) * 100;

  const activeTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div className="max-w-md mx-auto bg-dark-card rounded-2xl border border-dark-border shadow-md p-6 space-y-6">
      {/* Header and sound controller */}
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold animate-pulse" />
          <h3 className="font-serif italic text-dark-text text-sm md:text-base">Pomodoro Integrado</h3>
        </div>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg transition border duration-200 ${
            soundEnabled 
              ? 'bg-gold/15 text-gold border-gold/20' 
              : 'bg-dark-bg text-dark-muted border-dark-border'
          }`}
          title={soundEnabled ? "Desativar alertas de voz" : "Ativar alertas de voz"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Mode Switches */}
      <div className="flex rounded-xl bg-dark-bg p-1 justify-between border border-dark-border">
        <button
          onClick={() => handleSwitchMode('work')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition duration-200 flex items-center justify-center gap-1.5 ${
            mode === 'work' ? 'bg-gold text-dark-bg font-extrabold shadow-sm' : 'text-dark-muted hover:text-gold'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Estudar (25m)
        </button>
        <button
          onClick={() => handleSwitchMode('shortBreak')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition duration-200 flex items-center justify-center gap-1.5 ${
            mode === 'shortBreak' ? 'bg-gold text-dark-bg font-extrabold shadow-sm' : 'text-dark-muted hover:text-gold'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Pausa Curta (5m)
        </button>
        <button
          onClick={() => handleSwitchMode('longBreak')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition duration-200 flex items-center justify-center gap-1.5 ${
            mode === 'longBreak' ? 'bg-gold text-dark-bg font-extrabold shadow-sm' : 'text-dark-muted hover:text-gold'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Pausa Longa (15m)
        </button>
      </div>

      {/* Radial Timer Visual */}
      <div className="relative flex items-center justify-center py-6">
        <div className="w-48 h-48 rounded-full border-4 border-dark-border flex flex-col items-center justify-center relative bg-dark-bg shadow-inner">
          {/* Circular SVG Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="90"
              className="stroke-gold fill-none transition-all duration-300"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentageCompleted / 100)}`}
              strokeLinecap="round"
            />
          </svg>

          {/* Time display */}
          <div className="relative z-10 text-center space-y-1">
            <span className="text-4xl font-black font-mono text-dark-text tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <div className="text-[9px] font-bold uppercase tracking-wider text-gold/60">
              {mode === 'work' ? 'Tempo de Foco' : 'Descanso'}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleReset}
          className="p-3 bg-dark-bg border border-dark-border hover:bg-dark-card-lighter text-dark-text rounded-xl transition duration-200"
          title="Reiniciar Cronômetro"
        >
          <RotateCcw className="w-5 h-5 text-dark-muted hover:text-gold" />
        </button>

        <button
          onClick={handleToggle}
          className={`px-8 py-3 rounded-xl text-xs font-bold transition duration-250 flex items-center gap-2 ${
            isActive 
              ? 'bg-[#e06c75] hover:bg-red-500 text-dark-bg shadow-lg shadow-rose-950/20' 
              : 'bg-gold hover:bg-gold-hover text-dark-bg shadow-lg shadow-gold/10'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-dark-bg" /> Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-dark-bg" /> Iniciar
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          className="p-3 bg-dark-bg border border-dark-border hover:bg-dark-card-lighter text-dark-text rounded-xl transition duration-200"
          title="Pular Ciclo"
        >
          <FastForward className="w-5 h-5 text-dark-muted hover:text-gold" />
        </button>
      </div>

      {/* Subject Link Selector */}
      {mode === 'work' && (
        <div className="space-y-2 pt-4 border-t border-dark-border">
          <label className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] block">Assunto em Estudo Atualmente</label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-xl p-2.5 text-xs text-dark-text font-semibold focus:outline-none focus:ring-1 focus:ring-gold shadow-inner"
          >
            {topics.map(t => (
              <option key={t.id} value={t.id} className="bg-dark-card text-dark-text">
                [{t.subject === 'Língua Portuguesa' ? 'Português' : 'Matemática'}] {t.title}
              </option>
            ))}
          </select>
          {activeTopic && (
            <p className="text-[10px] text-dark-muted font-mono text-center">
              Ao concluir os 25m, adicionaremos o tempo ao seu progresso de estudos!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
