export type DemoData = {
  completion: number; // 0-100
  success: number; // 0-100
  avgTimeMin: number; // minutes
  incidentsPrevented: number; // mock count
  period?: string;
  site?: string;
  population?: 'agents' | 'manager';
  updatedAt: number;
};

const KEY = 'fpsgDemo';

export function readDemo(): DemoData {
  if (typeof localStorage === 'undefined') {
    return { completion: 0, success: 0, avgTimeMin: 0, incidentsPrevented: 0, updatedAt: Date.now() };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { completion: 0, success: 0, avgTimeMin: 0, incidentsPrevented: 0, updatedAt: Date.now() };
    const data = JSON.parse(raw) as DemoData;
    return { completion: 0, success: 0, avgTimeMin: 0, incidentsPrevented: 0, updatedAt: Date.now(), ...data };
  } catch {
    return { completion: 0, success: 0, avgTimeMin: 0, incidentsPrevented: 0, updatedAt: Date.now() };
  }
}

export function writeDemo(partial: Partial<DemoData>) {
  if (typeof localStorage === 'undefined') return;
  const next = { ...readDemo(), ...partial, updatedAt: Date.now() } satisfies DemoData;
  localStorage.setItem(KEY, JSON.stringify(next));
}
