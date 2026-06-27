/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

// Distância (px) que o usuário precisa puxar para disparar o refresh.
const THRESHOLD = 70;
// Distância máxima do indicador (resistência elástica).
const MAX_PULL = 110;
// Fator de resistência: o dedo anda 1px, o indicador anda 0.5px.
const RESISTANCE = 0.5;

/**
 * Pull-to-refresh com spinner dourado próprio (mobile).
 * Substitui o pull-to-refresh nativo do navegador por uma animação com a
 * identidade do app. Só atua quando a página está no topo (scrollY <= 0).
 */
export default function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Refs para ler valores atuais dentro dos listeners sem re-registrar.
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const animating = useRef(false);

  const setPullVal = (v: number) => {
    pullRef.current = v;
    setPull(v);
  };

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      // Só inicia o gesto se já estivermos no topo da página.
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
        animating.current = false;
      } else {
        pulling.current = false;
      }
    };

    const onMove = (e: TouchEvent) => {
      if (!pulling.current || refreshingRef.current) return;
      const delta = e.touches[0].clientY - startY.current;

      // Se rolou pra cima ou não está mais no topo, cancela o gesto.
      if (delta <= 0 || window.scrollY > 0) {
        if (pullRef.current !== 0) setPullVal(0);
        pulling.current = false;
        return;
      }

      const dist = Math.min(MAX_PULL, delta * RESISTANCE);
      setPullVal(dist);
      // Impede o scroll/bounce nativo enquanto puxamos.
      if (e.cancelable) e.preventDefault();
    };

    const onEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      animating.current = true;

      if (pullRef.current >= THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullVal(THRESHOLD);
        // Pequeno atraso para o usuário ver o spinner antes de recarregar.
        setTimeout(() => window.location.reload(), 650);
      } else {
        setPullVal(0);
      }
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  const progress = Math.min(1, pull / THRESHOLD);
  const visible = pull > 0 || refreshing;
  const armed = pull >= THRESHOLD; // passou do limite: vai recarregar ao soltar

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] flex justify-center pointer-events-none md:hidden safe-top"
      style={{
        transform: `translateY(${pull}px)`,
        opacity: visible ? 1 : 0,
        transition: animating.current && !refreshing ? 'transform 0.3s ease, opacity 0.3s ease' : 'opacity 0.2s ease',
      }}
    >
      <div
        className={`mt-2 flex items-center justify-center w-10 h-10 rounded-full bg-dark-card border shadow-lg transition-colors duration-200 ${
          armed || refreshing ? 'border-gold/60' : 'border-gold/25'
        }`}
        style={{ transform: `scale(${visible ? 0.6 + progress * 0.4 : 0.6})` }}
      >
        <RefreshCw
          className={`w-5 h-5 text-gold ${refreshing ? 'animate-spin' : ''}`}
          style={
            refreshing
              ? undefined
              : { transform: `rotate(${progress * 270}deg)`, opacity: 0.35 + progress * 0.65 }
          }
        />
      </div>
    </div>
  );
}
