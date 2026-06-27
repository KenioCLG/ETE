/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { SyllabusTopic } from './types';
import { INITIAL_SYLLABUS } from './data/syllabus';
import Dashboard from './components/Dashboard';
import SyllabusTracker from './components/SyllabusTracker';
import MockExam from './components/MockExam';
import AIAssistant from './components/AIAssistant';
import PullToRefresh from './components/PullToRefresh';
import {
  LayoutDashboard,
  BookMarked,
  FileText,
  Sparkles,
  Download,
  Wifi,
  WifiOff,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── PWA Install Prompt ──────────────────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// ─── Nav Config ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Painel',   shortLabel: 'Painel',   icon: LayoutDashboard },
  { id: 'edital',    label: 'Edital',   shortLabel: 'Edital',   icon: BookMarked      },
  { id: 'simulado',  label: 'Simulado', shortLabel: 'Prova',    icon: FileText        },
  { id: 'tutor',     label: 'Tutor IA', shortLabel: 'IA',       icon: Sparkles        },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [prevTab, setPrevTab] = useState<string>('dashboard');
  const [topics, setTopics] = useState<SyllabusTopic[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('ete_sidebar_collapsed');
    return saved === 'true';
  });
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: '4px', width: '0px' });

  // ── Active tab index ──
  const activeIndex = NAV_ITEMS.findIndex(n => n.id === activeTab);

  // ── Compute pill position from DOM ──
  const updatePill = useCallback(() => {
    if (!navRef.current) return;
    const buttons = navRef.current.querySelectorAll<HTMLButtonElement>('button[data-nav]');
    const activeBtn = buttons[activeIndex];
    if (!activeBtn) return;
    const navLeft = navRef.current.getBoundingClientRect().left;
    const btnRect = activeBtn.getBoundingClientRect();
    setPillStyle({
      left: `${btnRect.left - navLeft - 2}px`,
      width: `${btnRect.width + 4}px`,
    });
  }, [activeIndex]);

  useEffect(() => {
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

  // ── Online/Offline tracking ──
  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── PWA install prompt capture ──
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ── Load study progress from localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem('ete_syllabus_progress');
    if (saved) {
      try {
        setTopics(JSON.parse(saved));
      } catch {
        setTopics(INITIAL_SYLLABUS);
      }
    } else {
      setTopics(INITIAL_SYLLABUS);
    }
  }, []);

  // ── Handle tab change with transition ──
  const handleTabChange = (id: string) => {
    if (id === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(id);
    setPageKey(k => k + 1);
  };

  // ── Save progress ──
  const saveProgress = (updatedTopics: SyllabusTopic[]) => {
    setTopics(updatedTopics);
    localStorage.setItem('ete_syllabus_progress', JSON.stringify(updatedTopics));
    const todayStr = new Date().toDateString();
    if (localStorage.getItem('ete_last_study_date') !== todayStr) {
      localStorage.setItem('ete_last_study_date', todayStr);
      const streak = parseInt(localStorage.getItem('ete_study_streak') || '0', 10);
      localStorage.setItem('ete_study_streak', (streak + 1).toString());
    }
  };

  const handleUpdateTopic = (t: SyllabusTopic) =>
    saveProgress(topics.map(x => x.id === t.id ? t : x));

  const handleAddMinutesToTopic = (topicId: string, minutes: number) =>
    saveProgress(topics.map(t => t.id === topicId ? { ...t, minutes: t.minutes + minutes } : t));

  const handleImportSyllabusData = (importedTopics: SyllabusTopic[]) => {
    const merged = INITIAL_SYLLABUS.map(initial => {
      const match = importedTopics.find(imp => imp.id === initial.id);
      return match ? { ...initial, status: match.status, confidence: match.confidence, minutes: match.minutes, notes: match.notes || '' } : initial;
    });
    saveProgress(merged);
  };

  // ── PWA Install ──
  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };



  return (
    <div className="min-h-screen bg-dark-bg flex flex-col font-sans text-dark-text antialiased">

      {/* Pull-to-refresh com spinner próprio (mobile) */}
      <PullToRefresh />

      {/* ── Glass Header ─────────────────────────────────────────────────── */}
      <header className="glass-header sticky top-0 z-50 relative">
        {/* Safe area for notch devices */}
        <div className="safe-top" />
        <div className="px-4 md:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/25 shadow-lg">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-dark-bg" />
            </div>
            <div>
              <h1 className="gold-gradient-text font-serif italic text-base md:text-lg leading-none font-semibold tracking-wide">
                Foco no Edital
              </h1>
              <span className="text-[9px] text-dark-muted font-mono uppercase tracking-[0.12em] block mt-0.5">
                ETE PE 2026.2
              </span>
            </div>
          </div>

          {/* Right side: status + install */}
          <div className="flex items-center gap-2.5">

            {/* Online/Offline indicator — only on md+ */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-card border border-dark-border">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-semibold text-amber-400">Offline</span>
                </>
              )}
            </div>

            {/* Auto-save badge — md+ */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-card border border-dark-border">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-dark-muted">Salvo</span>
            </div>

            {/* Install PWA button */}
            {installPrompt && !isInstalled && (
              <button
                onClick={handleInstall}
                className="install-pulse flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold text-[11px] font-bold hover:from-gold/30 hover:to-gold/20 transition-all duration-200"
                title="Instalar como aplicativo"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instalar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex flex-col bg-dark-bg border-r border-dark-border fixed left-0 top-14 bottom-0 z-40 shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        }`}>

          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          {/* Collapse button on right border */}
          <button
            onClick={() => {
              const next = !isSidebarCollapsed;
              setIsSidebarCollapsed(next);
              localStorage.setItem('ete_sidebar_collapsed', String(next));
            }}
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-dark-border bg-dark-card hover:bg-dark-card-lighter text-gold hover:text-gold-light shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer"
            title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Nav section */}
          <div className="flex-1 p-3 pt-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
            {/* Section label */}
            <div className="flex items-center gap-2 px-3 pb-2 h-6 overflow-hidden">
              {!isSidebarCollapsed ? (
                <>
                  <span className="text-[9px] font-black text-dark-muted uppercase tracking-[0.18em]">Menu</span>
                  <div className="flex-1 h-px bg-dark-border" />
                </>
              ) : (
                <div className="w-full h-px bg-dark-border" />
              )}
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`relative w-full flex items-center rounded-xl text-xs font-semibold text-left transition-all duration-200 group ${
                      isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                    } ${
                      active
                        ? 'bg-gradient-to-r from-gold/12 to-gold/4 text-gold border border-gold/20 shadow-sm'
                        : 'text-dark-muted hover:text-dark-text hover:bg-dark-card/60 border border-transparent'
                    }`}
                  >
                    {/* Left accent bar */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-300 ${
                        active ? 'h-5 bg-gold shadow-[0_0_8px_rgba(197,163,104,0.6)]' : 'h-0 bg-transparent group-hover:h-3 group-hover:bg-dark-border'
                      }`}
                    />
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                        active ? 'text-gold drop-shadow-[0_0_6px_rgba(197,163,104,0.5)]' : 'text-dark-muted group-hover:text-dark-text'
                      } ${isSidebarCollapsed ? 'scale-110' : ''}`}
                    />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    {/* Active dot */}
                    {active && !isSidebarCollapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold/70 shadow-[0_0_6px_rgba(197,163,104,0.5)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {!isSidebarCollapsed && (
            <>
              {/* Divider */}
              <div className="mx-3 h-px bg-dark-border/60" />

              {/* Motto card */}
              <div className="p-3">
                <div className="relative p-3.5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1710] to-dark-card border border-gold/15">
                  {/* Subtle glow bg */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gold/5 blur-xl pointer-events-none" />
                  <p className="font-serif italic text-[11px] text-gold font-semibold mb-1 relative">
                    🎯 Reta Final!
                  </p>
                  <p className="text-[10px] leading-relaxed text-dark-muted relative">
                    Mantenha o foco. Cada tópico te aproxima das <span className="text-gold/80 font-semibold">54 ETEs de PE</span>.
                  </p>
                  {/* Bottom progress bar decoration */}
                  <div className="mt-2.5 h-0.5 rounded-full bg-dark-border overflow-hidden">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-gold/60 to-gold/30" />
                  </div>
                  <p className="text-[9px] text-dark-muted/60 mt-1 font-mono">65% concluído</p>
                </div>
              </div>
            </>
          )}

          {/* Bottom safe padding */}
          <div className="pb-2" />
        </aside>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto pb-24 md:pb-6 bg-dark-bg transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}>
          <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-4 md:py-6">
            <div className={activeTab === 'dashboard' ? 'page-enter' : 'hidden'}>
              <Dashboard topics={topics} onTabChange={handleTabChange} />
            </div>
            <div className={activeTab === 'edital' ? 'page-enter' : 'hidden'}>
              <SyllabusTracker topics={topics} onUpdateTopic={handleUpdateTopic} onImportData={handleImportSyllabusData} />
            </div>
            <div className={activeTab === 'simulado' ? 'page-enter' : 'hidden'}>
              <MockExam />
            </div>
            <div className={activeTab === 'tutor' ? 'page-enter' : 'hidden'}>
              <AIAssistant />
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ─────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-bottom-nav">
        <div className="safe-bottom">
          <div
            ref={navRef}
            className="relative flex items-center px-2 py-2"
          >
            {/* Sliding Pill */}
            <div
              className="nav-pill"
              style={pillStyle}
              aria-hidden="true"
            />

            {/* Nav Buttons */}
            {NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  data-nav="true"
                  onClick={() => handleTabChange(item.id)}
                  className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 min-h-[48px] rounded-xl transition-all duration-200 ${
                    active ? 'text-gold' : 'text-dark-muted'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] transition-transform duration-200 ${
                      active ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-bold tracking-tight transition-all duration-200 ${
                      active ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    {item.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

    </div>
  );
}
