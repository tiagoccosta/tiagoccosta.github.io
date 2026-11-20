import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';

interface ParticleFieldCanvasProps {
  theme: Theme;
}

interface FieldParticle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  isCrosshair: boolean;
}

const POINTER_RADIUS = 135;
const LINK_RADIUS = 88;

export function ParticleFieldCanvas({ theme }: ParticleFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<Theme>(theme);
  const drawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    drawRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: FieldParticle[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const seedParticles = (w: number, h: number) => {
      const count = w < 640 ? 34 : 56;
      const list: FieldParticle[] = [];
      const cols = Math.max(4, Math.round(Math.sqrt((count * w) / Math.max(h, 1))));
      const rows = Math.max(3, Math.ceil(count / cols));

      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const jitterX = (((i * 37) % 100) / 100 - 0.5) * (w / cols) * 0.55;
        const jitterY = (((i * 73) % 100) / 100 - 0.5) * (h / rows) * 0.55;
        const hx = ((col + 0.5) / cols) * w + jitterX;
        const hy = ((row + 0.5) / rows) * h + jitterY;
        list.push({
          homeX: hx,
          homeY: hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          phase: i * 0.55,
          isCrosshair: i % 4 === 0,
        });
      }
      particles = list;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const nextW = Math.max(1, Math.floor(rect.width));
      const nextH = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(nextW * dpr);
      canvas.height = Math.floor(nextH * dpr);
      canvas.style.width = `${nextW}px`;
      canvas.style.height = `${nextH}px`;

      if (Math.abs(nextW - width) > 40 || Math.abs(nextH - height) > 40 || particles.length === 0) {
        seedParticles(nextW, nextH);
      }
      width = nextW;
      height = nextH;
      draw();
    };

    const step = (dt: number) => {
      elapsed += dt;
      for (const p of particles) {
        const targetX = p.homeX + Math.sin(elapsed * 0.8 + p.phase) * 10;
        const targetY = p.homeY + Math.cos(elapsed * 0.65 + p.phase * 1.2) * 8;

        let ax = (targetX - p.x) * 7.5;
        let ay = (targetY - p.y) * 7.5;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 4 && distSq < POINTER_RADIUS * POINTER_RADIUS) {
            const dist = Math.sqrt(distSq);
            const push = (1 - dist / POINTER_RADIUS) * 420;
            ax += (dx / dist) * push;
            ay += (dy / dist) * push;
          }
        }

        p.vx = (p.vx + ax * dt) * 0.88;
        p.vy = (p.vy + ay * dt) * 0.88;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;
      const isDark = themeRef.current === 'dark';

      const baseDot = isDark ? 'rgba(236, 238, 233, 0.24)' : 'rgba(20, 21, 24, 0.22)';
      const activeAccent = isDark ? 'rgba(255, 90, 31, 0.78)' : 'rgba(217, 70, 18, 0.78)';
      const baseLine = isDark ? 'rgba(236, 238, 233, 0.06)' : 'rgba(20, 21, 24, 0.06)';
      const activeLine = isDark ? 'rgba(255, 90, 31, 0.24)' : 'rgba(217, 70, 18, 0.24)';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const aNear =
          pointer.active &&
          (a.x - pointer.x) ** 2 + (a.y - pointer.y) ** 2 < POINTER_RADIUS ** 2;

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < LINK_RADIUS * LINK_RADIUS) {
            ctx.strokeStyle = aNear ? activeLine : baseLine;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const near =
          pointer.active &&
          (p.x - pointer.x) ** 2 + (p.y - pointer.y) ** 2 < POINTER_RADIUS ** 2;
        const color = near ? activeAccent : baseDot;

        if (p.isCrosshair) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - 3, p.y);
          ctx.lineTo(p.x + 3, p.y);
          ctx.moveTo(p.x, p.y - 3);
          ctx.lineTo(p.x, p.y + 3);
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(p.x - 1, p.y - 1, 2.2, 2.2);
        }
      }
    };

    drawRef.current = draw;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside) {
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const observer = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    resize();

    if (prefersReducedMotion) {
      return () => {
        observer.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('mouseleave', handlePointerLeave);
      };
    }

    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;
      step(dt);
      draw();
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
