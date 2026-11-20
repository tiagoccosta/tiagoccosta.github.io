export interface FxSettings {
  boidsTrailsObstacles: boolean;
  flowField: boolean;
  springMesh: boolean;
  signalNetwork: boolean;
  microBursts: boolean;
  contactParticles: boolean;
}

export const DEFAULT_FX_SETTINGS: FxSettings = {
  boidsTrailsObstacles: true,
  flowField: true,
  springMesh: true,
  signalNetwork: true,
  microBursts: true,
  contactParticles: true,
};

export interface BurstPayload {
  x: number;
  y: number;
  palette?: 'brand' | 'gold';
  count?: number;
}

type BurstListener = (payload: BurstPayload) => void;

const listeners = new Set<BurstListener>();

export function subscribeParticleBurst(listener: BurstListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function triggerParticleBurst(payload: BurstPayload): void {
  for (const listener of listeners) {
    listener(payload);
  }
}

export function triggerBurstFromElement(
  el: HTMLElement | null,
  palette: 'brand' | 'gold' = 'brand',
  count = 18
): void {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  triggerParticleBurst({
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
    palette,
    count,
  });
}
