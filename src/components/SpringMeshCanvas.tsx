import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';

interface SpringMeshCanvasProps {
  theme: Theme;
}

interface MeshVertex {
  restX: number;
  restY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function SpringMeshCanvas({ theme }: SpringMeshCanvasProps) {
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
    let cols = 0;
    let rows = 0;
    let vertices: MeshVertex[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let scrollImpulse = 0;
    let isVisible = true;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const buildMesh = (w: number, h: number) => {
      const spacing = w < 640 ? 64 : 74;
      cols = Math.max(4, Math.ceil(w / spacing) + 1);
      rows = Math.max(3, Math.ceil(h / spacing) + 1);
      const stepX = w / (cols - 1);
      const stepY = h / (rows - 1);

      const list: MeshVertex[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rx = c * stepX;
          const ry = r * stepY;
          list.push({
            restX: rx,
            restY: ry,
            x: rx,
            y: ry,
            vx: 0,
            vy: 0,
          });
        }
      }
      vertices = list;
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

      if (vertices.length === 0 || Math.abs(nextW - width) > 30 || Math.abs(nextH - height) > 30) {
        buildMesh(nextW, nextH);
      }
      width = nextW;
      height = nextH;
      draw();
    };

    const step = (dt: number) => {
      const springK = 36;
      const neighborK = 14;
      const damping = Math.pow(0.06, dt);
      const stepX = cols > 1 ? width / (cols - 1) : width;
      const stepY = rows > 1 ? height / (rows - 1) : height;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const v = vertices[idx];

          let ax = (v.restX - v.x) * springK;
          let ay = (v.restY - v.y) * springK;

          // Neighbor spring coupling
          if (c > 0) {
            const left = vertices[idx - 1];
            ax += (left.x + stepX - v.x) * neighborK;
            ay += (left.y - v.y) * neighborK;
          }
          if (c < cols - 1) {
            const right = vertices[idx + 1];
            ax += (right.x - stepX - v.x) * neighborK;
            ay += (right.y - v.y) * neighborK;
          }
          if (r > 0) {
            const top = vertices[idx - cols];
            ax += (top.x - v.x) * neighborK;
            ay += (top.y + stepY - v.y) * neighborK;
          }
          if (r < rows - 1) {
            const bottom = vertices[idx + cols];
            ax += (bottom.x - v.x) * neighborK;
            ay += (bottom.y - stepY - v.y) * neighborK;
          }

          // Scroll inertia wave
          if (Math.abs(scrollImpulse) > 0.2) {
            const wavePhase = Math.sin((c / Math.max(cols - 1, 1)) * Math.PI);
            ay += scrollImpulse * (0.45 + 0.55 * wavePhase);
          }

          // Pointer indentation
          if (pointer.active) {
            const dx = v.x - pointer.x;
            const dy = v.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 125 * 125 && distSq > 4) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / 125) * 440;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
          }

          v.vx = (v.vx + ax * dt) * damping;
          v.vy = (v.vy + ay * dt) * damping;
          v.x += v.vx * dt;
          v.y += v.vy * dt;
        }
      }

      scrollImpulse *= Math.pow(0.02, dt);
    };

    const draw = () => {
      if (width === 0 || height === 0 || vertices.length === 0) return;
      const isDark = themeRef.current === 'dark';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const v = vertices[idx];
          const disp = Math.hypot(v.x - v.restX, v.y - v.restY);
          const energy = Math.min(1, disp / 18);

          const lineColor =
            energy > 0.14
              ? isDark
                ? `rgba(20, 184, 166, ${(0.08 + energy * 0.22).toFixed(3)})`
                : `rgba(37, 99, 235, ${(0.07 + energy * 0.20).toFixed(3)})`
              : isDark
              ? 'rgba(243, 245, 247, 0.055)'
              : 'rgba(17, 21, 27, 0.05)';

          ctx.strokeStyle = lineColor;
          ctx.beginPath();
          if (c < cols - 1) {
            const right = vertices[idx + 1];
            ctx.moveTo(v.x, v.y);
            ctx.lineTo(right.x, right.y);
          }
          if (r < rows - 1) {
            const bottom = vertices[idx + cols];
            ctx.moveTo(v.x, v.y);
            ctx.lineTo(bottom.x, bottom.y);
          }
          ctx.stroke();
        }
      }
    };

    drawRef.current = draw;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;
      scrollImpulse = Math.max(-220, Math.min(220, scrollImpulse - delta * 2.2));
    };

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    resize();

    if (prefersReducedMotion) {
      return () => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        window.removeEventListener('scroll', handleScroll);
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
      window.removeEventListener('scroll', handleScroll);
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
