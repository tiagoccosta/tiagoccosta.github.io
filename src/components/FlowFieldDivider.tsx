import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';

interface FlowFieldDividerProps {
  theme: Theme;
  enabled: boolean;
}

interface FlowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  tone: 'neutral' | 'cobalt' | 'teal';
}

export function FlowFieldDivider({ theme, enabled }: FlowFieldDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<Theme>(theme);
  const drawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    drawRef.current?.();
  }, [theme]);

  useEffect(() => {
    if (!enabled) return;
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
    let particles: FlowParticle[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let isVisible = true;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const seed = (w: number, h: number) => {
      const count = w < 640 ? 68 : 115;
      const list: FlowParticle[] = [];
      for (let i = 0; i < count; i++) {
        list.push({
          x: (((i * 97.3) % 100) / 100) * w,
          y: (((i * 53.7 + 11) % 100) / 100) * h,
          vx: 35,
          vy: 0,
          speed: 34 + (i % 5) * 9,
          tone: i % 5 === 0 ? 'cobalt' : i % 5 === 2 ? 'teal' : 'neutral',
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

      if (particles.length === 0 || Math.abs(nextW - width) > 80) {
        seed(nextW, nextH);
      }
      width = nextW;
      height = nextH;
      draw();
    };

    const step = (dt: number) => {
      elapsed += dt;
      for (const p of particles) {
        let angle =
          Math.sin(p.x * 0.007 + elapsed * 0.55) *
            Math.cos(p.y * 0.032 - elapsed * 0.4) *
            1.15;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 110 * 110 && distSq > 4) {
            const influence = 1 - Math.sqrt(distSq) / 110;
            angle += Math.atan2(dy, dx) * 0.65 * influence;
          }
        }

        const targetVx = Math.cos(angle) * p.speed;
        const targetVy = Math.sin(angle) * p.speed * 0.65;
        p.vx += (targetVx - p.vx) * 0.14;
        p.vy += (targetVy - p.vy) * 0.14;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x > width + 8) p.x = -8;
        if (p.x < -8) p.x = width + 8;
        if (p.y > height - 4) p.y = 4;
        if (p.y < 4) p.y = height - 4;
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;
      const isDark = themeRef.current === 'dark';

      const neutralColor = isDark ? 'rgba(243, 245, 247, 0.24)' : 'rgba(17, 21, 27, 0.20)';
      const cobaltColor = isDark ? 'rgba(59, 130, 246, 0.65)' : 'rgba(37, 99, 235, 0.65)';
      const tealColor = isDark ? 'rgba(20, 184, 166, 0.65)' : 'rgba(13, 148, 136, 0.65)';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.lineCap = 'round';
      for (const p of particles) {
        const len = Math.min(8, Math.max(2.5, Math.hypot(p.vx, p.vy) * 0.13));
        const ang = Math.atan2(p.vy, p.vx);
        ctx.lineWidth = p.tone === 'neutral' ? 1.1 : 1.5;
        ctx.strokeStyle =
          p.tone === 'cobalt' ? cobaltColor : p.tone === 'teal' ? tealColor : neutralColor;
        ctx.beginPath();
        ctx.moveTo(p.x - Math.cos(ang) * len, p.y - Math.sin(ang) * len);
        ctx.lineTo(p.x + Math.cos(ang) * len, p.y + Math.sin(ang) * len);
        ctx.stroke();
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

    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !prefersReducedMotion && rafId === 0) {
          lastTime = performance.now();
          rafId = window.requestAnimationFrame(tick);
        }
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(canvas);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    resize();

    if (prefersReducedMotion) {
      return () => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('mouseleave', handlePointerLeave);
      };
    }

    function tick(now: number) {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;
      step(dt);
      draw();
      rafId = window.requestAnimationFrame(tick);
    }

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [enabled]);

  if (!enabled) {
    return (
      <div className="border-t border-slate-200/80 dark:border-white/8" />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative h-16 w-full overflow-hidden border-t border-slate-200/70 bg-[#F7F8FA] sm:h-20 dark:border-white/6 dark:bg-[#101214]"
    >
      <canvas ref={canvasRef} className="pointer-events-none block h-full w-full" />
    </div>
  );
}
