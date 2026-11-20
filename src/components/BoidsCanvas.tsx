import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';

interface BoidsCanvasProps {
  theme: Theme;
  paused: boolean;
  showGizmos: boolean;
  interactionMode: 'attract' | 'repel';
  onStatsUpdate?: (stats: { fps: number; count: number }) => void;
}

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isScout: boolean;
  scoutTone: 'cobalt' | 'teal';
}

interface ImpulseRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const PERCEPTION_RADIUS = 68;
const SEPARATION_RADIUS = 28;
const LINK_RADIUS = 52;
const POINTER_RADIUS = 165;
const IMPULSE_RADIUS = 180;
const MIN_SPEED = 52;
const MAX_SPEED = 128;

export function BoidsCanvas({
  theme,
  paused,
  showGizmos,
  interactionMode,
  onStatsUpdate,
}: BoidsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    theme,
    paused,
    showGizmos,
    interactionMode,
  });
  const onStatsRef = useRef(onStatsUpdate);
  const drawFrameRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current = { theme, paused, showGizmos, interactionMode };
    drawFrameRef.current?.();
  }, [theme, paused, showGizmos, interactionMode]);

  useEffect(() => {
    onStatsRef.current = onStatsUpdate;
  }, [onStatsUpdate]);

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
    let boids: Boid[] = [];
    let ripples: ImpulseRipple[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let statsTimer = 0;
    let frameCounter = 0;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const targetCountForWidth = (w: number) => (w < 640 ? 26 : w < 1024 ? 42 : 58);

    const seedBoids = (w: number, h: number) => {
      const count = targetCountForWidth(w);
      const seeded: Boid[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i * 2.39996) % (Math.PI * 2);
        const speed = MIN_SPEED + ((i * 19) % 45);
        const isScout = i % 5 === 0;
        seeded.push({
          x: (((i * 137.5) % 100) / 100) * Math.max(w, 1),
          y: (((i * 89.3 + 23) % 100) / 100) * Math.max(h, 1),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          isScout,
          scoutTone: (i / 5) % 2 === 0 ? 'cobalt' : 'teal',
        });
      }
      boids = seeded;
      onStatsRef.current?.({ fps: prefersReducedMotion ? 0 : 60, count: boids.length });
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

      const desiredCount = targetCountForWidth(nextW);
      if (boids.length === 0 || Math.abs(boids.length - desiredCount) > 6) {
        seedBoids(nextW, nextH);
      } else {
        for (const b of boids) {
          b.x = Math.min(Math.max(b.x, 12), nextW - 12);
          b.y = Math.min(Math.max(b.y, 12), nextH - 12);
        }
      }
      width = nextW;
      height = nextH;
      draw();
    };

    const step = (dt: number) => {
      const { interactionMode: mode } = stateRef.current;
      const margin = 44;
      const turnForce = 185;
      const maxAccel = 230;

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 260 * dt;
        r.alpha = Math.max(0, 0.65 * (1 - r.radius / r.maxRadius));
        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
        }
      }

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let sepX = 0;
        let sepY = 0;
        let alignX = 0;
        let alignY = 0;
        let cohX = 0;
        let cohY = 0;
        let neighbors = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > 0 && distSq < PERCEPTION_RADIUS * PERCEPTION_RADIUS) {
            const dist = Math.sqrt(distSq);
            alignX += other.vx;
            alignY += other.vy;
            cohX += other.x;
            cohY += other.y;
            neighbors++;

            if (dist < SEPARATION_RADIUS) {
              const weight = (SEPARATION_RADIUS - dist) / SEPARATION_RADIUS;
              sepX -= (dx / dist) * weight;
              sepY -= (dy / dist) * weight;
            }
          }
        }

        let ax = sepX * 195;
        let ay = sepY * 195;

        if (neighbors > 0) {
          const avgVx = alignX / neighbors;
          const avgVy = alignY / neighbors;
          ax += (avgVx - b.vx) * 1.35;
          ay += (avgVy - b.vy) * 1.35;

          const centerX = cohX / neighbors;
          const centerY = cohY / neighbors;
          ax += (centerX - b.x) * 0.95;
          ay += (centerY - b.y) * 0.95;
        }

        if (b.x < margin) ax += turnForce * ((margin - b.x) / margin);
        else if (b.x > width - margin) ax -= turnForce * ((b.x - (width - margin)) / margin);

        if (b.y < margin) ay += turnForce * ((margin - b.y) / margin);
        else if (b.y > height - margin) ay -= turnForce * ((b.y - (height - margin)) / margin);

        if (pointer.active) {
          const pdx = pointer.x - b.x;
          const pdy = pointer.y - b.y;
          const pDistSq = pdx * pdx + pdy * pdy;
          if (pDistSq > 4 && pDistSq < POINTER_RADIUS * POINTER_RADIUS) {
            const pDist = Math.sqrt(pDistSq);
            const falloff = 1 - pDist / POINTER_RADIUS;
            const sign = mode === 'attract' ? 1 : -1;
            const force = sign * 255 * falloff;
            ax += (pdx / pDist) * force;
            ay += (pdy / pDist) * force;
          }
        }

        const accelMag = Math.hypot(ax, ay);
        if (accelMag > maxAccel) {
          ax = (ax / accelMag) * maxAccel;
          ay = (ay / accelMag) * maxAccel;
        }

        b.vx += ax * dt;
        b.vy += ay * dt;

        const speed = Math.hypot(b.vx, b.vy);
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED;
          b.vy = (b.vy / speed) * MAX_SPEED;
        } else if (speed < MIN_SPEED) {
          const safeSpeed = speed || 1;
          b.vx = (b.vx / safeSpeed) * MIN_SPEED;
          b.vy = (b.vy / safeSpeed) * MIN_SPEED;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x < 0) b.x = 0;
        if (b.x > width) b.x = width;
        if (b.y < 0) b.y = 0;
        if (b.y > height) b.y = height;
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;
      const { theme: currentTheme, showGizmos: gizmos } = stateRef.current;
      const isDark = currentTheme === 'dark';

      const regularFill = isDark
        ? 'rgba(243, 245, 247, 0.30)'
        : 'rgba(17, 21, 27, 0.24)';
      const cobaltFill = isDark
        ? 'rgba(59, 130, 246, 0.78)'
        : 'rgba(37, 99, 235, 0.78)';
      const tealFill = isDark
        ? 'rgba(20, 184, 166, 0.78)'
        : 'rgba(13, 148, 136, 0.78)';
      const tetherStroke = isDark
        ? 'rgba(148, 163, 184, 0.08)'
        : 'rgba(17, 21, 27, 0.07)';
      const gizmoStroke = isDark
        ? 'rgba(20, 184, 166, 0.28)'
        : 'rgba(13, 148, 136, 0.28)';
      const vectorStroke = isDark
        ? 'rgba(59, 130, 246, 0.55)'
        : 'rgba(37, 99, 235, 0.55)';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Subtle neighbor tethers
      ctx.lineWidth = 1;
      ctx.strokeStyle = tetherStroke;
      ctx.beginPath();
      for (let i = 0; i < boids.length; i++) {
        const a = boids[i];
        for (let j = i + 1; j < boids.length; j++) {
          const b = boids[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < LINK_RADIUS * LINK_RADIUS) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      // Click / Tap impulse ripples
      for (const r of ripples) {
        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isDark
          ? `rgba(20, 184, 166, ${r.alpha.toFixed(3)})`
          : `rgba(37, 99, 235, ${r.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Optional velocity & perception gizmos
      if (gizmos) {
        ctx.save();
        ctx.lineWidth = 1;
        for (const b of boids) {
          if (!b.isScout) continue;
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = gizmoStroke;
          ctx.beginPath();
          ctx.arc(b.x, b.y, PERCEPTION_RADIUS, 0, Math.PI * 2);
          ctx.stroke();

          ctx.setLineDash([]);
          ctx.strokeStyle = vectorStroke;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + b.vx * 0.24, b.y + b.vy * 0.24);
          ctx.stroke();
        }

        if (pointer.active) {
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = gizmoStroke;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, POINTER_RADIUS, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Directional boid chevrons
      for (const b of boids) {
        const angle = Math.atan2(b.vy, b.vx);
        const size = b.isScout ? 6.4 : 5.1;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.85, size * 0.56);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.85, -size * 0.56);
        ctx.closePath();
        ctx.fillStyle = !b.isScout
          ? regularFill
          : b.scoutTone === 'cobalt'
          ? cobaltFill
          : tealFill;
        ctx.fill();
        ctx.restore();
      }
    };

    drawFrameRef.current = draw;

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

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('a, button, input, select, textarea, [role="button"]')) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      ripples.push({
        x,
        y,
        radius: 6,
        maxRadius: 195,
        alpha: 0.6,
      });

      for (const b of boids) {
        const dx = b.x - x;
        const dy = b.y - y;
        const distSq = dx * dx + dy * dy;
        if (distSq > 1 && distSq < IMPULSE_RADIUS * IMPULSE_RADIUS) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / IMPULSE_RADIUS;
          const kick = 115 * falloff;
          b.vx += (dx / dist) * kick;
          b.vy += (dy / dist) * kick;
        }
      }

      if (stateRef.current.paused || prefersReducedMotion) {
        draw();
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
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    resize();

    if (prefersReducedMotion) {
      return () => {
        observer.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('mouseleave', handlePointerLeave);
      };
    }

    const tick = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      if (!stateRef.current.paused) {
        step(dt);
        draw();
        frameCounter++;
      }

      statsTimer += rawDt;
      if (statsTimer >= 0.5) {
        const fps = stateRef.current.paused
          ? 0
          : Math.min(60, Math.round(frameCounter / statsTimer));
        onStatsRef.current?.({ fps, count: boids.length });
        frameCounter = 0;
        statsTimer = 0;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
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
