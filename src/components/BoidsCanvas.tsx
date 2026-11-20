import { useEffect, useRef } from 'react';
import { Theme } from '../data/portfolio';

export interface BoidsStats {
  fps: number;
  prey: number;
  eggs: number;
  food: number;
}

interface BoidsCanvasProps {
  theme: Theme;
  paused: boolean;
  showGizmos: boolean;
  interactionMode: 'attract' | 'repel';
  enableTrailsAndObstacles: boolean;
  onStatsUpdate?: (stats: BoidsStats) => void;
}

interface TrailPoint {
  x: number;
  y: number;
}

type EvolutionStage = 0 | 1 | 2;

interface PreyBoid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  stage: EvolutionStage;
  energy: number;
  trail: TrailPoint[];
}

interface Predator {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mode: 'hunt' | 'rest';
  restTimer: number;
  targetId: number | null;
  trail: TrailPoint[];
}

interface FoodSpeck {
  x: number;
  y: number;
  phase: number;
}

interface Egg {
  x: number;
  y: number;
  age: number;
  hatchTime: number;
}

interface ObstacleRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ImpulseRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  tone: 'brand' | 'capture' | 'hatch';
}

interface LocalSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const PERCEPTION_RADIUS = 68;
const SEPARATION_RADIUS = 28;
const LINK_RADIUS = 50;
const POINTER_RADIUS = 165;
const IMPULSE_RADIUS = 180;
const FLEE_RADIUS = 135;
const FOOD_SEEK_RADIUS = 140;
const OBSTACLE_PAD = 24;
const PREY_TRAIL_LENGTH = 7;
const PREDATOR_TRAIL_LENGTH = 11;
const MAX_EGGS = 10;

interface EcosystemLimits {
  initialPrey: number;
  maxPrey: number;
  foodStopThreshold: number;
  minPreyFloor: number;
  maxFood: number;
}

function getLimitsForWidth(w: number): EcosystemLimits {
  if (w < 640) {
    return {
      initialPrey: 22,
      maxPrey: 36,
      foodStopThreshold: 30,
      minPreyFloor: 10,
      maxFood: 8,
    };
  }
  if (w < 1024) {
    return {
      initialPrey: 32,
      maxPrey: 52,
      foodStopThreshold: 44,
      minPreyFloor: 14,
      maxFood: 10,
    };
  }
  return {
    initialPrey: 40,
    maxPrey: 68,
    foodStopThreshold: 58,
    minPreyFloor: 18,
    maxFood: 12,
  };
}

export function BoidsCanvas({
  theme,
  paused,
  showGizmos,
  interactionMode,
  enableTrailsAndObstacles,
  onStatsUpdate,
}: BoidsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    theme,
    paused,
    showGizmos,
    interactionMode,
    enableTrailsAndObstacles,
  });
  const onStatsRef = useRef(onStatsUpdate);
  const drawFrameRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current = {
      theme,
      paused,
      showGizmos,
      interactionMode,
      enableTrailsAndObstacles,
    };
    drawFrameRef.current?.();
  }, [theme, paused, showGizmos, interactionMode, enableTrailsAndObstacles]);

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
    let nextBoidId = 1;
    let limits = getLimitsForWidth(1024);

    let boids: PreyBoid[] = [];
    let predator: Predator = {
      x: 120,
      y: 120,
      vx: 75,
      vy: 40,
      mode: 'hunt',
      restTimer: 0,
      targetId: null,
      trail: [{ x: 120, y: 120 }],
    };
    let foods: FoodSpeck[] = [];
    let eggs: Egg[] = [];
    let obstacles: ObstacleRect[] = [];
    let ripples: ImpulseRipple[] = [];
    let sparks: LocalSpark[] = [];

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let statsTimer = 0;
    let obstacleTimer = 0;
    let foodSpawnTimer = 0;
    let frameCounter = 0;
    let isVisible = true;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const isInsideObstacle = (x: number, y: number, pad = 16) => {
      for (const obs of obstacles) {
        if (
          x >= obs.x - pad &&
          x <= obs.x + obs.w + pad &&
          y >= obs.y - pad &&
          y <= obs.y + obs.h + pad
        ) {
          return true;
        }
      }
      return false;
    };

    const findSafePoint = (w: number, h: number) => {
      const margin = 36;
      const safeW = Math.max(20, w - margin * 2);
      const safeH = Math.max(20, h - margin * 2);
      for (let attempt = 0; attempt < 8; attempt++) {
        const px = margin + Math.random() * safeW;
        const py = margin + Math.random() * safeH;
        if (!isInsideObstacle(px, py, 20)) {
          return { x: px, y: py };
        }
      }
      return { x: margin + Math.random() * safeW, y: margin + Math.random() * safeH };
    };

    const spawnFood = (w: number, h: number) => {
      const pt = findSafePoint(w, h);
      foods.push({
        x: pt.x,
        y: pt.y,
        phase: Math.random() * Math.PI * 2,
      });
    };

    const spawnLocalSparks = (x: number, y: number, color: string, count = 6) => {
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const spd = 45 + Math.random() * 65;
        sparks.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0,
          maxLife: 0.35 + Math.random() * 0.18,
          color,
        });
      }
    };

    const measureObstacles = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        obstacles = [];
        return;
      }
      const parentRect = parent.getBoundingClientRect();
      const els = parent.querySelectorAll<HTMLElement>('[data-boid-obstacle="true"]');
      const next: ObstacleRect[] = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        next.push({
          x: r.left - parentRect.left,
          y: r.top - parentRect.top,
          w: r.width,
          h: r.height,
        });
      }
      obstacles = next;
    };

    const seedEcosystem = (w: number, h: number) => {
      limits = getLimitsForWidth(w);
      const seeded: PreyBoid[] = [];
      for (let i = 0; i < limits.initialPrey; i++) {
        const angle = (i * 2.39996) % (Math.PI * 2);
        const speed = 56 + ((i * 17) % 44);
        const x = (((i * 137.5) % 100) / 100) * Math.max(w, 1);
        const y = (((i * 89.3 + 23) % 100) / 100) * Math.max(h, 1);
        const stage: EvolutionStage = i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0;
        seeded.push({
          id: nextBoidId++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          stage,
          energy: 0,
          trail: [{ x, y }],
        });
      }
      boids = seeded;

      const predX = w * 0.78;
      const predY = h * 0.32;
      predator = {
        x: predX,
        y: predY,
        vx: -85,
        vy: 55,
        mode: 'hunt',
        restTimer: 0,
        targetId: null,
        trail: [{ x: predX, y: predY }],
      };

      foods = [];
      eggs = [];
      const initialFoodCount = Math.min(6, limits.maxFood);
      for (let i = 0; i < initialFoodCount; i++) {
        spawnFood(w, h);
      }

      onStatsRef.current?.({
        fps: prefersReducedMotion ? 0 : 60,
        prey: boids.length,
        eggs: eggs.length,
        food: foods.length,
      });
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

      measureObstacles();
      limits = getLimitsForWidth(nextW);

      if (boids.length === 0) {
        seedEcosystem(nextW, nextH);
      } else {
        for (const b of boids) {
          b.x = Math.min(Math.max(b.x, 12), nextW - 12);
          b.y = Math.min(Math.max(b.y, 12), nextH - 12);
        }
        predator.x = Math.min(Math.max(predator.x, 16), nextW - 16);
        predator.y = Math.min(Math.max(predator.y, 16), nextH - 16);
      }
      width = nextW;
      height = nextH;
      draw();
    };

    const applyObstacleAvoidance = (x: number, y: number) => {
      let ox = 0;
      let oy = 0;
      for (const obs of obstacles) {
        const clampedX = Math.max(obs.x, Math.min(x, obs.x + obs.w));
        const clampedY = Math.max(obs.y, Math.min(y, obs.y + obs.h));
        const dx = x - clampedX;
        const dy = y - clampedY;
        const distSq = dx * dx + dy * dy;
        if (distSq < OBSTACLE_PAD * OBSTACLE_PAD) {
          if (distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const strength = ((OBSTACLE_PAD - dist) / OBSTACLE_PAD) * 330;
            ox += (dx / dist) * strength;
            oy += (dy / dist) * strength;
          } else {
            const cx = obs.x + obs.w * 0.5;
            const cy = obs.y + obs.h * 0.5;
            const pdx = x - cx;
            const pdy = y - cy;
            const plen = Math.hypot(pdx, pdy) || 1;
            ox += (pdx / plen) * 350;
            oy += (pdy / plen) * 350;
          }
        }
      }
      return { ox, oy };
    };

    const step = (dt: number) => {
      const {
        interactionMode: mode,
        enableTrailsAndObstacles: useFx,
        theme: currentTheme,
      } = stateRef.current;
      const isDark = currentTheme === 'dark';

      elapsed += dt;
      const margin = 44;
      const turnForce = 190;
      const totalPop = boids.length + eggs.length;

      // Update ripples & local sparks
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 250 * dt;
        r.alpha = Math.max(0, 0.58 * (1 - r.radius / r.maxRadius));
        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= Math.pow(0.25, dt);
        s.vy *= Math.pow(0.25, dt);
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }

      // Population-regulated food spawning: STOP spawning when population is high!
      foodSpawnTimer += dt;
      const lowPop = boids.length <= limits.minPreyFloor + 3;
      const spawnInterval = lowPop ? 0.55 : 1.05;
      if (
        foodSpawnTimer >= spawnInterval &&
        totalPop < limits.foodStopThreshold &&
        foods.length < limits.maxFood
      ) {
        foodSpawnTimer = 0;
        spawnFood(width, height);
      }

      // Egg incubation & hatching
      for (let i = eggs.length - 1; i >= 0; i--) {
        const egg = eggs[i];
        egg.age += dt;
        if (egg.age >= egg.hatchTime) {
          eggs.splice(i, 1);
          if (boids.length < limits.maxPrey) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 62;
            boids.push({
              id: nextBoidId++,
              x: egg.x,
              y: egg.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              stage: 0,
              energy: 0,
              trail: [{ x: egg.x, y: egg.y }],
            });
            ripples.push({
              x: egg.x,
              y: egg.y,
              radius: 2,
              maxRadius: 28,
              alpha: 0.48,
              tone: 'hatch',
            });
          }
        }
      }

      // Update Prey Boids
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const perception = b.stage === 2 ? PERCEPTION_RADIUS + 14 : b.stage === 1 ? PERCEPTION_RADIUS + 7 : PERCEPTION_RADIUS;
        const maxSpeed = b.stage === 2 ? 142 : b.stage === 1 ? 132 : 122;
        const minSpeed = b.stage === 2 ? 60 : 52;

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

          if (distSq > 0 && distSq < perception * perception) {
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
          ax += (alignX / neighbors - b.vx) * 1.25;
          ay += (alignY / neighbors - b.vy) * 1.25;
          ax += (cohX / neighbors - b.x) * 0.85;
          ay += (cohY / neighbors - b.y) * 0.85;
        }

        // Flee from predator
        const fdx = b.x - predator.x;
        const fdy = b.y - predator.y;
        const fDistSq = fdx * fdx + fdy * fdy;
        if (fDistSq > 1 && fDistSq < FLEE_RADIUS * FLEE_RADIUS) {
          const fDist = Math.sqrt(fDistSq);
          const panic = (1 - fDist / FLEE_RADIUS) * (predator.mode === 'hunt' ? 420 : 210);
          ax += (fdx / fDist) * panic;
          ay += (fdy / fDist) * panic;
        }

        // Seek nearest glowing food speck (and collect!)
        if (foods.length > 0) {
          let bestFoodIdx = -1;
          let bestFoodDistSq = FOOD_SEEK_RADIUS * FOOD_SEEK_RADIUS;
          for (let f = 0; f < foods.length; f++) {
            const food = foods[f];
            const dx = food.x - b.x;
            const dy = food.y - b.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < bestFoodDistSq) {
              bestFoodDistSq = dSq;
              bestFoodIdx = f;
            }
          }
          if (bestFoodIdx !== -1) {
            const food = foods[bestFoodIdx];
            const dist = Math.sqrt(bestFoodDistSq);
            if (dist < 11) {
              // Collected!
              foods.splice(bestFoodIdx, 1);
              b.energy += 1;

              if (b.stage === 0 && b.energy >= 1) {
                b.stage = 1;
                b.energy = 0;
                spawnLocalSparks(
                  b.x,
                  b.y,
                  isDark ? '#14B8A6' : '#0D9488',
                  5
                );
              } else if (b.stage === 1 && b.energy >= 2) {
                b.stage = 2;
                b.energy = 0;
                spawnLocalSparks(
                  b.x,
                  b.y,
                  isDark ? '#3B82F6' : '#2563EB',
                  6
                );
              } else if (b.stage === 2 && b.energy >= 2) {
                b.energy = 0;
                if (
                  boids.length + eggs.length < limits.maxPrey &&
                  eggs.length < MAX_EGGS
                ) {
                  eggs.push({
                    x: b.x,
                    y: b.y,
                    age: 0,
                    hatchTime: lowPop ? 2.6 : 4.0 + Math.random() * 1.1,
                  });
                }
              }
            } else {
              const seekStrength = 195 * (1 - dist / FOOD_SEEK_RADIUS) + 65;
              ax += ((food.x - b.x) / dist) * seekStrength;
              ay += ((food.y - b.y) / dist) * seekStrength;
            }
          }
        }

        // Soft boundaries
        if (b.x < margin) ax += turnForce * ((margin - b.x) / margin);
        else if (b.x > width - margin) ax -= turnForce * ((b.x - (width - margin)) / margin);

        if (b.y < margin) ay += turnForce * ((margin - b.y) / margin);
        else if (b.y > height - margin) ay -= turnForce * ((b.y - (height - margin)) / margin);

        // DOM obstacle avoidance
        if (useFx && obstacles.length > 0) {
          const { ox, oy } = applyObstacleAvoidance(b.x, b.y);
          ax += ox;
          ay += oy;
        }

        // Pointer steering
        if (pointer.active) {
          const pdx = pointer.x - b.x;
          const pdy = pointer.y - b.y;
          const pDistSq = pdx * pdx + pdy * pdy;
          if (pDistSq > 4 && pDistSq < POINTER_RADIUS * POINTER_RADIUS) {
            const pDist = Math.sqrt(pDistSq);
            const falloff = 1 - pDist / POINTER_RADIUS;
            const sign = mode === 'attract' ? 1 : -1;
            const force = sign * 245 * falloff;
            ax += (pdx / pDist) * force;
            ay += (pdy / pDist) * force;
          }
        }

        const maxAccel = 300;
        const accelMag = Math.hypot(ax, ay);
        if (accelMag > maxAccel) {
          ax = (ax / accelMag) * maxAccel;
          ay = (ay / accelMag) * maxAccel;
        }

        b.vx += ax * dt;
        b.vy += ay * dt;

        const speed = Math.hypot(b.vx, b.vy);
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
          const safeSpeed = speed || 1;
          b.vx = (b.vx / safeSpeed) * minSpeed;
          b.vy = (b.vy / safeSpeed) * minSpeed;
        }

        b.x = Math.min(width, Math.max(0, b.x + b.vx * dt));
        b.y = Math.min(height, Math.max(0, b.y + b.vy * dt));

        if (useFx) {
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > PREY_TRAIL_LENGTH) {
            b.trail.shift();
          }
        } else if (b.trail.length > 1) {
          b.trail = [{ x: b.x, y: b.y }];
        }
      }

      // Update Predator
      if (predator.mode === 'rest') {
        predator.restTimer -= dt;
        if (predator.restTimer <= 0) {
          predator.mode = 'hunt';
        }
      }

      let pax = 0;
      let pay = 0;
      predator.targetId = null;

      if (predator.mode === 'hunt' && boids.length > 0) {
        let nearestIdx = -1;
        let nearestDistSq = Infinity;
        for (let i = 0; i < boids.length; i++) {
          const dx = boids[i].x - predator.x;
          const dy = boids[i].y - predator.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < nearestDistSq) {
            nearestDistSq = dSq;
            nearestIdx = i;
          }
        }

        if (nearestIdx !== -1) {
          const target = boids[nearestIdx];
          predator.targetId = target.id;
          const dist = Math.sqrt(nearestDistSq);

          if (dist < 13 && boids.length > limits.minPreyFloor) {
            // Capture prey & enter rest cooldown
            const capX = target.x;
            const capY = target.y;
            boids.splice(nearestIdx, 1);
            predator.mode = 'rest';
            predator.restTimer = boids.length <= limits.minPreyFloor + 2 ? 4.2 : 2.5;
            predator.targetId = null;

            spawnLocalSparks(capX, capY, isDark ? '#E11D48' : '#BE123C', 7);
            ripples.push({
              x: capX,
              y: capY,
              radius: 3,
              maxRadius: 34,
              alpha: 0.55,
              tone: 'capture',
            });
          } else {
            // Lead prediction pursuit
            const leadX = target.x + target.vx * 0.18;
            const leadY = target.y + target.vy * 0.18;
            const dx = leadX - predator.x;
            const dy = leadY - predator.y;
            const dLen = Math.hypot(dx, dy) || 1;
            pax += (dx / dLen) * 265;
            pay += (dy / dLen) * 265;
          }
        }
      } else {
        // Gentle patrol wander during rest
        const wanderAng = Math.atan2(predator.vy, predator.vx) + Math.sin(elapsed * 1.4) * 0.45;
        pax += Math.cos(wanderAng) * 65;
        pay += Math.sin(wanderAng) * 65;
      }

      // Repel predator when pointer is in repel mode
      if (pointer.active && mode === 'repel') {
        const pdx = predator.x - pointer.x;
        const pdy = predator.y - pointer.y;
        const pDistSq = pdx * pdx + pdy * pdy;
        if (pDistSq > 4 && pDistSq < POINTER_RADIUS * POINTER_RADIUS) {
          const pDist = Math.sqrt(pDistSq);
          const push = (1 - pDist / POINTER_RADIUS) * 340;
          pax += (pdx / pDist) * push;
          pay += (pdy / pDist) * push;
        }
      }

      if (predator.x < margin) pax += turnForce * ((margin - predator.x) / margin);
      else if (predator.x > width - margin) pax -= turnForce * ((predator.x - (width - margin)) / margin);

      if (predator.y < margin) pay += turnForce * ((margin - predator.y) / margin);
      else if (predator.y > height - margin) pay -= turnForce * ((predator.y - (height - margin)) / margin);

      if (useFx && obstacles.length > 0) {
        const { ox, oy } = applyObstacleAvoidance(predator.x, predator.y);
        pax += ox;
        pay += oy;
      }

      predator.vx += pax * dt;
      predator.vy += pay * dt;

      const predMax = predator.mode === 'hunt' ? 154 : 78;
      const predMin = predator.mode === 'hunt' ? 88 : 48;
      const predSpeed = Math.hypot(predator.vx, predator.vy);
      if (predSpeed > predMax) {
        predator.vx = (predator.vx / predSpeed) * predMax;
        predator.vy = (predator.vy / predSpeed) * predMax;
      } else if (predSpeed < predMin) {
        const s = predSpeed || 1;
        predator.vx = (predator.vx / s) * predMin;
        predator.vy = (predator.vy / s) * predMin;
      }

      predator.x = Math.min(width, Math.max(0, predator.x + predator.vx * dt));
      predator.y = Math.min(height, Math.max(0, predator.y + predator.vy * dt));

      if (useFx) {
        predator.trail.push({ x: predator.x, y: predator.y });
        if (predator.trail.length > PREDATOR_TRAIL_LENGTH) {
          predator.trail.shift();
        }
      } else if (predator.trail.length > 1) {
        predator.trail = [{ x: predator.x, y: predator.y }];
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;
      const {
        theme: currentTheme,
        showGizmos: gizmos,
        enableTrailsAndObstacles: useFx,
      } = stateRef.current;
      const isDark = currentTheme === 'dark';

      const stage0Fill = isDark ? 'rgba(243, 245, 247, 0.34)' : 'rgba(17, 21, 27, 0.28)';
      const stage1Fill = isDark ? 'rgba(20, 184, 166, 0.85)' : 'rgba(13, 148, 136, 0.85)';
      const stage2Fill = isDark ? 'rgba(59, 130, 246, 0.90)' : 'rgba(37, 99, 235, 0.90)';
      const predatorFill = isDark
        ? predator.mode === 'hunt'
          ? 'rgba(225, 29, 72, 0.92)'
          : 'rgba(225, 29, 72, 0.56)'
        : predator.mode === 'hunt'
        ? 'rgba(190, 18, 60, 0.90)'
        : 'rgba(190, 18, 60, 0.55)';

      const tetherStroke = isDark
        ? 'rgba(148, 163, 184, 0.075)'
        : 'rgba(17, 21, 27, 0.065)';
      const gizmoStroke = isDark ? 'rgba(20, 184, 166, 0.28)' : 'rgba(13, 148, 136, 0.28)';
      const vectorStroke = isDark ? 'rgba(59, 130, 246, 0.55)' : 'rgba(37, 99, 235, 0.55)';
      const huntLineStroke = isDark ? 'rgba(225, 29, 72, 0.42)' : 'rgba(190, 18, 60, 0.38)';

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

      // Glowing food specks
      for (const food of foods) {
        const pulse = 0.65 + 0.35 * Math.sin(elapsed * 4.2 + food.phase);
        ctx.save();
        ctx.fillStyle = isDark
          ? `rgba(110, 231, 183, ${(0.18 * pulse).toFixed(3)})`
          : `rgba(16, 185, 129, ${(0.18 * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(food.x, food.y, 6.2 + pulse * 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark
          ? `rgba(167, 243, 208, ${(0.68 + 0.28 * pulse).toFixed(3)})`
          : `rgba(5, 150, 105, ${(0.72 + 0.22 * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(food.x, food.y, 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Eggs with circular hatch progress
      for (const egg of eggs) {
        const progress = Math.min(1, egg.age / egg.hatchTime);
        ctx.save();
        ctx.fillStyle = isDark ? 'rgba(147, 197, 253, 0.85)' : 'rgba(37, 99, 235, 0.85)';
        ctx.beginPath();
        ctx.ellipse(egg.x, egg.y, 3.2, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1.3;
        ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.65)' : 'rgba(37, 99, 235, 0.65)';
        ctx.beginPath();
        ctx.arc(
          egg.x,
          egg.y,
          6,
          -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * progress
        );
        ctx.stroke();
        ctx.restore();
      }

      // Ribbon trails (prey + predator)
      if (useFx) {
        for (const b of boids) {
          if (b.trail.length < 2) continue;
          for (let t = 1; t < b.trail.length; t++) {
            const p0 = b.trail[t - 1];
            const p1 = b.trail[t];
            const baseAlpha = b.stage === 2 ? 0.38 : b.stage === 1 ? 0.32 : 0.14;
            const alpha = (t / b.trail.length) * baseAlpha;
            ctx.lineWidth = b.stage === 0 ? 1 : 1.35;
            ctx.strokeStyle =
              b.stage === 2
                ? isDark
                  ? `rgba(59, 130, 246, ${alpha.toFixed(3)})`
                  : `rgba(37, 99, 235, ${alpha.toFixed(3)})`
                : b.stage === 1
                ? isDark
                  ? `rgba(20, 184, 166, ${alpha.toFixed(3)})`
                  : `rgba(13, 148, 136, ${alpha.toFixed(3)})`
                : isDark
                ? `rgba(243, 245, 247, ${alpha.toFixed(3)})`
                : `rgba(17, 21, 27, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }

        if (predator.trail.length >= 2) {
          for (let t = 1; t < predator.trail.length; t++) {
            const p0 = predator.trail[t - 1];
            const p1 = predator.trail[t];
            const alpha = (t / predator.trail.length) * (predator.mode === 'hunt' ? 0.44 : 0.22);
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = isDark
              ? `rgba(225, 29, 72, ${alpha.toFixed(3)})`
              : `rgba(190, 18, 60, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
      }

      // Ripples & local capture/evolution sparks
      for (const r of ripples) {
        ctx.save();
        ctx.lineWidth = 1.4;
        ctx.strokeStyle =
          r.tone === 'capture'
            ? isDark
              ? `rgba(225, 29, 72, ${r.alpha.toFixed(3)})`
              : `rgba(190, 18, 60, ${r.alpha.toFixed(3)})`
            : r.tone === 'hatch'
            ? isDark
              ? `rgba(59, 130, 246, ${r.alpha.toFixed(3)})`
              : `rgba(37, 99, 235, ${r.alpha.toFixed(3)})`
            : isDark
            ? `rgba(20, 184, 166, ${r.alpha.toFixed(3)})`
            : `rgba(37, 99, 235, ${r.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (const s of sparks) {
        const alpha = 1 - s.life / s.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x - 1.3, s.y - 1.3, 2.6, 2.6);
        ctx.restore();
      }

      // Optional Debug Vectors & Gizmos
      if (gizmos) {
        ctx.save();
        ctx.lineWidth = 1;

        if (useFx && obstacles.length > 0) {
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = gizmoStroke;
          for (const obs of obstacles) {
            ctx.strokeRect(
              obs.x - OBSTACLE_PAD * 0.4,
              obs.y - OBSTACLE_PAD * 0.4,
              obs.w + OBSTACLE_PAD * 0.8,
              obs.h + OBSTACLE_PAD * 0.8
            );
          }
        }

        // Predator flee radius & target lock
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = huntLineStroke;
        ctx.beginPath();
        ctx.arc(predator.x, predator.y, FLEE_RADIUS, 0, Math.PI * 2);
        ctx.stroke();

        if (predator.targetId !== null) {
          const target = boids.find((b) => b.id === predator.targetId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(predator.x, predator.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        }

        ctx.setLineDash([]);
        ctx.font = "10px 'Inter', system-ui, sans-serif";
        ctx.fillStyle = huntLineStroke;
        ctx.fillText(
          predator.mode === 'hunt' ? 'HUNT' : 'REST',
          predator.x + 12,
          predator.y - 8
        );

        for (const b of boids) {
          if (b.stage !== 2) continue;
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

      // Prey Boids (Neutral -> Green/Teal -> Blue/Cobalt)
      for (const b of boids) {
        const angle = Math.atan2(b.vy, b.vx);
        const size = b.stage === 2 ? 6.6 : b.stage === 1 ? 5.9 : 5.1;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.85, size * 0.56);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.85, -size * 0.56);
        ctx.closePath();
        ctx.fillStyle =
          b.stage === 2 ? stage2Fill : b.stage === 1 ? stage1Fill : stage0Fill;
        ctx.fill();
        ctx.restore();
      }

      // Predator Silhouette
      {
        const angle = Math.atan2(predator.vy, predator.vx);
        const size = 9.5;
        ctx.save();
        ctx.translate(predator.x, predator.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size * 1.15, 0);
        ctx.lineTo(-size * 0.85, size * 0.62);
        ctx.lineTo(-size * 0.35, 0);
        ctx.lineTo(-size * 0.85, -size * 0.62);
        ctx.closePath();
        ctx.fillStyle = predatorFill;
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
        alpha: 0.56,
        tone: 'brand',
      });

      if (
        foods.length < limits.maxFood + 4 &&
        boids.length + eggs.length < limits.maxPrey
      ) {
        foods.push({ x, y, phase: Math.random() * Math.PI * 2 });
      }

      for (const b of boids) {
        const dx = b.x - x;
        const dy = b.y - y;
        const distSq = dx * dx + dy * dy;
        if (distSq > 1 && distSq < IMPULSE_RADIUS * IMPULSE_RADIUS) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / IMPULSE_RADIUS;
          const kick = 110 * falloff;
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
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    resize();

    if (prefersReducedMotion) {
      return () => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('mouseleave', handlePointerLeave);
      };
    }

    function tick(now: number) {
      if (!isVisible) {
        rafId = 0;
        return;
      }

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      obstacleTimer += rawDt;
      if (obstacleTimer >= 1.0) {
        measureObstacles();
        obstacleTimer = 0;
      }

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
        onStatsRef.current?.({
          fps,
          prey: boids.length,
          eggs: eggs.length,
          food: foods.length,
        });
        frameCounter = 0;
        statsTimer = 0;
      }

      rafId = window.requestAnimationFrame(tick);
    }

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
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
