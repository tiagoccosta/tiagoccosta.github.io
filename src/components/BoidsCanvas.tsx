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
}

const PERCEPTION_RADIUS = 68;
const SEPARATION_RADIUS = 28;
const LINK_RADIUS = 52;
const POINTER_RADIUS = 165;
const MIN_SPEED = 54;
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
    let rafId = 0;
    let lastTime = performance.now();
    let statsTimer = 0;
    let frameCounter = 0;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const targetCountForWidth = (w: number) => (w < 640 ? 34 : w < 1024 ? 48 : 64);

    const seedBoids = (w: number, h: number) => {
      const count = targetCountForWidth(w);
      const seeded: Boid[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i * 2.39996) % (Math.PI * 2);
        const speed = MIN_SPEED + ((i * 19) % 45);
        seeded.push({
          x: (((i * 137.5) % 100) / 100) * Math.max(w, 1),
          y: (((i * 89.3 + 23) % 100) / 100) * Math.max(h, 1),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          isScout: i % 6 === 0,
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
      const maxAccel = 220;

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
            const force = sign * 260 * falloff;
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
      const { theme: currentTheme, showGizmos: gizmos, interactionMode: mode } =
        stateRef.current;
      const isDark = currentTheme === 'dark';

      const accentColor = isDark ? '#FF5A1F' : '#D94612';
      const regularFill = isDark
        ? 'rgba(236, 238, 233, 0.34)'
        : 'rgba(20, 21, 24, 0.30)';
      const scoutFill = isDark
        ? 'rgba(255, 90, 31, 0.85)'
        : 'rgba(217, 70, 18, 0.85)';
      const tetherStroke = isDark
        ? 'rgba(236, 238, 233, 0.085)'
        : 'rgba(20, 21, 24, 0.08)';
      const gizmoStroke = isDark
        ? 'rgba(255, 90, 31, 0.28)'
        : 'rgba(217, 70, 18, 0.28)';
      const vectorStroke = isDark
        ? 'rgba(255, 90, 31, 0.55)'
        : 'rgba(217, 70, 18, 0.55)';

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

      // Debug spatial gizmos
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

          ctx.setLineDash([]);
          ctx.strokeStyle = accentColor;
          ctx.beginPath();
          ctx.moveTo(pointer.x - 6, pointer.y);
          ctx.lineTo(pointer.x + 6, pointer.y);
          ctx.moveTo(pointer.x, pointer.y - 6);
          ctx.lineTo(pointer.x, pointer.y + 6);
          ctx.stroke();

          ctx.font = "10px 'IBM Plex Mono', monospace";
          ctx.fillStyle = vectorStroke;
          ctx.fillText(
            mode === 'attract' ? 'FORCE:ATTRACT' : 'FORCE:REPEL',
            pointer.x + 10,
            pointer.y - 8
          );
        }
        ctx.restore();
      }

      // Draw directional boid chevrons
      for (const b of boids) {
        const angle = Math.atan2(b.vy, b.vx);
        const size = b.isScout ? 6.5 : 5.2;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.85, size * 0.58);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.85, -size * 0.58);
        ctx.closePath();
        ctx.fillStyle = b.isScout ? scoutFill : regularFill;
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
