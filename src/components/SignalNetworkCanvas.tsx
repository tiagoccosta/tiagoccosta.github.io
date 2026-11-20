import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';

interface SignalNetworkCanvasProps {
  theme: Theme;
}

interface NetNode {
  x: number;
  y: number;
  neighbors: number[];
  glow: number;
}

interface SignalPulse {
  from: number;
  to: number;
  progress: number;
  speed: number;
  tone: 'cobalt' | 'teal';
  hopsLeft: number;
}

export function SignalNetworkCanvas({ theme }: SignalNetworkCanvasProps) {
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
    let nodes: NetNode[] = [];
    let edges: Array<[number, number]> = [];
    let pulses: SignalPulse[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let spawnTimer = 0;
    let lastHoverIdx = -1;
    let isVisible = true;

    const buildGraph = (w: number, h: number) => {
      const count = w < 640 ? 18 : 30;
      const cols = Math.max(3, Math.round(Math.sqrt((count * w) / Math.max(h, 1))));
      const rows = Math.max(3, Math.ceil(count / cols));
      const list: NetNode[] = [];

      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const jx = (((i * 43) % 100) / 100 - 0.5) * (w / cols) * 0.58;
        const jy = (((i * 71) % 100) / 100 - 0.5) * (h / rows) * 0.58;
        list.push({
          x: Math.min(w - 20, Math.max(20, ((col + 0.5) / cols) * w + jx)),
          y: Math.min(h - 20, Math.max(20, ((row + 0.5) / rows) * h + jy)),
          neighbors: [],
          glow: 0,
        });
      }

      const maxDist = w < 640 ? 150 : 195;
      const edgeList: Array<[number, number]> = [];
      for (let i = 0; i < list.length; i++) {
        const candidates: Array<{ idx: number; dist: number }> = [];
        for (let j = 0; j < list.length; j++) {
          if (i === j) continue;
          const d = Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y);
          if (d <= maxDist) {
            candidates.push({ idx: j, dist: d });
          }
        }
        candidates.sort((a, b) => a.dist - b.dist);
        for (const c of candidates.slice(0, 3)) {
          if (!list[i].neighbors.includes(c.idx)) {
            list[i].neighbors.push(c.idx);
          }
          if (!list[c.idx].neighbors.includes(i)) {
            list[c.idx].neighbors.push(i);
          }
          if (i < c.idx) {
            edgeList.push([i, c.idx]);
          }
        }
      }

      nodes = list;
      edges = edgeList;
      pulses = [];
    };

    const spawnPulseFrom = (nodeIdx: number, hopsLeft: number, tone?: 'cobalt' | 'teal') => {
      const node = nodes[nodeIdx];
      if (!node || node.neighbors.length === 0 || pulses.length > 26) return;
      const nextIdx =
        node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
      pulses.push({
        from: nodeIdx,
        to: nextIdx,
        progress: 0,
        speed: 1.35 + Math.random() * 0.75,
        tone: tone ?? (Math.random() > 0.5 ? 'cobalt' : 'teal'),
        hopsLeft,
      });
      node.glow = Math.max(node.glow, 0.85);
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

      if (nodes.length === 0 || Math.abs(nextW - width) > 40 || Math.abs(nextH - height) > 40) {
        buildGraph(nextW, nextH);
      }
      width = nextW;
      height = nextH;
      draw();
    };

    const step = (dt: number) => {
      spawnTimer += dt;
      if (spawnTimer >= 0.7 && nodes.length > 0) {
        spawnTimer = 0;
        const startIdx = Math.floor(Math.random() * nodes.length);
        spawnPulseFrom(startIdx, 2);
      }

      for (const n of nodes) {
        if (n.glow > 0) {
          n.glow = Math.max(0, n.glow - dt * 1.6);
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed * dt;
        if (p.progress >= 1) {
          const arrived = p.to;
          const arrivedNode = nodes[arrived];
          if (arrivedNode) {
            arrivedNode.glow = 1;
            if (p.hopsLeft > 0 && arrivedNode.neighbors.length > 0) {
              const options = arrivedNode.neighbors.filter((n) => n !== p.from);
              const pickPool = options.length > 0 ? options : arrivedNode.neighbors;
              const next = pickPool[Math.floor(Math.random() * pickPool.length)];
              pulses.push({
                from: arrived,
                to: next,
                progress: 0,
                speed: p.speed,
                tone: p.tone,
                hopsLeft: p.hopsLeft - 1,
              });
            }
          }
          pulses.splice(i, 1);
        }
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;
      const isDark = themeRef.current === 'dark';

      const edgeStroke = isDark ? 'rgba(243, 245, 247, 0.065)' : 'rgba(17, 21, 27, 0.06)';
      const nodeBase = isDark ? 'rgba(243, 245, 247, 0.16)' : 'rgba(17, 21, 27, 0.14)';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Edges
      ctx.lineWidth = 1;
      ctx.strokeStyle = edgeStroke;
      ctx.beginPath();
      for (const [aIdx, bIdx] of edges) {
        const a = nodes[aIdx];
        const b = nodes[bIdx];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      // Traveling pulses with trailing tail
      for (const p of pulses) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b) continue;
        const headT = p.progress;
        const tailT = Math.max(0, headT - 0.24);
        const hx = a.x + (b.x - a.x) * headT;
        const hy = a.y + (b.y - a.y) * headT;
        const tx = a.x + (b.x - a.x) * tailT;
        const ty = a.y + (b.y - a.y) * tailT;

        const strokeCol =
          p.tone === 'cobalt'
            ? isDark
              ? 'rgba(59, 130, 246, 0.72)'
              : 'rgba(37, 99, 235, 0.65)'
            : isDark
            ? 'rgba(20, 184, 166, 0.75)'
            : 'rgba(13, 148, 136, 0.68)';

        ctx.lineWidth = 1.6;
        ctx.strokeStyle = strokeCol;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = strokeCol;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      for (const n of nodes) {
        ctx.fillStyle =
          n.glow > 0.05
            ? isDark
              ? `rgba(20, 184, 166, ${(0.22 + n.glow * 0.68).toFixed(3)})`
              : `rgba(37, 99, 235, ${(0.20 + n.glow * 0.65).toFixed(3)})`
            : nodeBase;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.glow > 0.1 ? 2.4 + n.glow * 1.3 : 1.8, 0, Math.PI * 2);
        ctx.fill();
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
      if (!inside) {
        lastHoverIdx = -1;
        return;
      }
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      let nearestIdx = -1;
      let nearestDistSq = 90 * 90;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - px;
        const dy = nodes[i].y - py;
        const dSq = dx * dx + dy * dy;
        if (dSq < nearestDistSq) {
          nearestDistSq = dSq;
          nearestIdx = i;
        }
      }
      if (nearestIdx !== -1 && nearestIdx !== lastHoverIdx) {
        lastHoverIdx = nearestIdx;
        spawnPulseFrom(nearestIdx, 2, 'teal');
        spawnPulseFrom(nearestIdx, 1, 'cobalt');
      }
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
    resize();

    if (prefersReducedMotion) {
      return () => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
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
