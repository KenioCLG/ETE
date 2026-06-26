/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  GraduationCap, 
  BookOpen, 
  Flame, 
  ChevronRight,
  Loader2,
  Trash2
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Olá! Eu sou o **Tutor Virtual ETE PE**. Estou aqui para ajudar você a dominar qualquer assunto do edital de Língua Portuguesa e Matemática do processo seletivo subsequente 2026.2. \n\nPosso te explicar regras de crase, equações de 2º grau, concordância verbal, porcentagem, ou simular questões do edital. Como gostaria de começar nossos estudos hoje?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) {
      setInputText('');
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newMessages }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages([...newMessages, { role: 'model', content: data.reply }]);
      } else {
        setError(data.error || 'Erro ao processar sua pergunta.');
      }
    } catch (err: any) {
      setError(err.message || 'Falha de comunicação com o servidor de inteligência artificial.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Deseja realmente limpar seu histórico de conversa com o Tutor IA?")) {
      setMessages([
        {
          role: 'model',
          content: "Olá! Histórico de conversa limpo. Qual assunto do edital você deseja revisar ou tirar dúvidas agora?"
        }
      ]);
      setError(null);
    }
  };

  // Pre-configured helper templates for prompt engineering
  const presetPrompts = [
    {
      label: "Me explique 'Crase' e dê exemplos de prova",
      icon: GraduationCap,
      prompt: "Explique o uso da Crase com regras práticas e exemplos típicos que costumam ser cobrados em provas de concursos técnicos (como a ETE PE)."
    },
    {
      label: "Regra de Três Composta: macete rápido",
      icon: Flame,
      prompt: "Quais os melhores atalhos ou macetes para resolver questões de Regra de Três Composta de forma rápida na prova?"
    },
    {
      label: "Simule uma questão de Português sobre Coesão",
      icon: BookOpen,
      prompt: "Crie uma questão inédita de Língua Portuguesa sobre Coesão Textual no estilo da prova ETE PE (múltipla escolha de A a E), aguarde minha resposta e depois comente o gabarito."
    },
    {
      label: "Fórmulas de Geometria Plana mais cobradas",
      icon: Sparkles,
      prompt: "Apresente um resumo compacto das fórmulas de Geometria Plana (área e perímetro) que são mais recorrentes no edital subsequente."
    }
  ];

  return (
    <div className="bg-dark-card rounded-2xl border border-dark-border shadow-md overflow-hidden flex flex-col h-[600px]">
      {/* Top Header of Chat */}
      <div className="p-4 border-b border-dark-border bg-dark-card-lighter flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 text-gold rounded-xl border border-gold/15">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif italic text-dark-text text-sm md:text-base leading-none">Tutor Inteligente ETE</h3>
            <span className="text-[10px] text-gold/60 font-mono tracking-wider block mt-1.5 uppercase">Gemini AI Ativa</span>
          </div>
        </div>

        <button 
          onClick={handleClearChat}
          className="p-2 hover:bg-dark-bg text-dark-muted hover:text-rose-400 rounded-lg transition duration-200"
          title="Limpar Histórico"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container Splitter */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Preset Prompt shortcuts */}
        <div className="w-full md:w-64 bg-dark-card border-b md:border-b-0 md:border-r border-dark-border p-4 overflow-y-auto space-y-3 shrink-0">
          <span className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.15em] block mb-1">
            Sugestões de Revisão
          </span>
          <div className="grid grid-cols-1 gap-2">
            {presetPrompts.map((preset, index) => {
              const Icon = preset.icon;
              return (
                <button
                  key={index}
                  disabled={loading}
                  onClick={() => handleSend(preset.prompt)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left text-xs bg-dark-bg hover:bg-dark-card-lighter border border-dark-border text-dark-text hover:border-gold/30 transition duration-200 group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="truncate pr-1 font-medium">{preset.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-dark-muted group-hover:text-gold flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Scrollable messages block */}
        <div className="flex-1 flex flex-col overflow-hidden bg-dark-bg">
          {/* Chat message bubbles scroll container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md ${
                      isUser 
                        ? 'bg-gold/10 text-gold border border-gold/20 rounded-tr-none' 
                        : 'bg-dark-card border border-dark-border text-dark-text rounded-tl-none'
                    }`}
                  >
                    {!isUser && (
                      <div className="text-[9px] uppercase tracking-wider text-gold font-mono font-bold mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Tutor Virtual
                      </div>
                    )}
                    <div className="markdown-body prose max-w-none text-dark-text leading-relaxed text-xs md:text-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated loading state bubble */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-card border border-dark-border rounded-2xl rounded-tl-none p-4 shadow-md text-dark-muted flex items-center gap-2 text-xs md:text-sm font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span>Pensando na melhor explicação para você...</span>
                </div>
              </div>
            )}

            {/* Error alerts pane */}
            {error && (
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-300 text-xs text-center font-semibold font-mono">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input control bottom row */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-dark-border p-4 bg-dark-card-lighter flex gap-2"
          >
            <input 
              type="text" 
              placeholder="Digite sua dúvida de Português ou Matemática do edital..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-xs md:text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-gold focus:bg-dark-card-lighter transition duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 bg-gold hover:bg-gold-hover disabled:bg-dark-bg disabled:text-dark-muted border border-transparent hover:border-gold/30 disabled:border-dark-border disabled:cursor-not-allowed text-dark-bg font-extrabold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
