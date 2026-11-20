import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';
import { BurstPayload, subscribeParticleBurst } from '../utils/fxBus';

interface ParticleBurstOverlayProps {
  theme: Theme;
  enabled: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const BRAND_COLORS_DARK = ['#3B82F6', '#14B8A6', '#60A5FA', '#2DD4BF'];
const BRAND_COLORS_LIGHT = ['#2563EB', '#0D9488', '#1D4ED8', '#0F766E'];
const GOLD_COLORS = ['#C9A24D', '#E2C275', '#FDE68A'];

export function ParticleBurstOverlay({ theme, enabled }: ParticleBurstOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ theme, enabled });

  useEffect(() => {
    stateRef.current = { theme, enabled };
  }, [theme, enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sparks: Spark[] = [];
    let rafId = 0;
    let lastTime = performance.now();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const spawnBurst = (payload: BurstPayload) => {
      if (!stateRef.current.enabled || prefersReducedMotion) return;

      const palette =
        payload.palette === 'gold'
          ? GOLD_COLORS
          : stateRef.current.theme === 'dark'
          ? BRAND_COLORS_DARK
          : BRAND_COLORS_LIGHT;

      const count = payload.count ?? 18;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        const speed = 75 + Math.random() * 145;
        sparks.push({
          x: payload.x,
          y: payload.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 35,
          life: 0,
          maxLife: 0.48 + Math.random() * 0.24,
          size: 2.2 + Math.random() * 2,
          color: palette[i % palette.length],
        });
      }

      if (rafId === 0) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    function tick(now: number) {
      if (!ctx) return;
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 260 * dt;
        s.vx *= Math.pow(0.18, dt);
        s.vy *= Math.pow(0.32, dt);
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const alpha = 1 - s.life / s.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.translate(s.x, s.y);
        ctx.rotate(Math.PI / 4);
        const half = (s.size * (0.45 + 0.55 * alpha)) / 2;
        ctx.fillRect(-half, -half, half * 2, half * 2);
        ctx.restore();
      }

      if (sparks.length > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
        ctx.clearRect(0, 0, width, height);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    const unsubscribe = subscribeParticleBurst(spawnBurst);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      unsubscribe();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
