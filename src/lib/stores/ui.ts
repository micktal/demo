import { writable } from 'svelte/store';

export type Lang = 'fr' | 'en';

function persist<T>(key: string, initial: T) {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  const start = stored ? (JSON.parse(stored) as T) : initial;
  const store = writable<T>(start);
  store.subscribe((v) => {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(v)); } catch {}
  });
  return store;
}

export const lang = persist<Lang>('ui.lang', 'fr');
export const highContrast = persist<boolean>('ui.contrast', false);
export const fontScale = persist<'100' | '112' | '125'>('ui.fontScale', '100');

export function applyAccessibilityToDom() {
  if (typeof document === 'undefined') return;
  const $contrast = getStoreValue(highContrast);
  const $font = getStoreValue(fontScale);
  document.documentElement.setAttribute('data-contrast', $contrast ? 'high' : 'normal');
  document.documentElement.setAttribute('data-fontscale', $font);
}

function getStoreValue<T>(store: { subscribe: (run: (value: T) => void) => () => void }): T {
  let value!: T;
  store.subscribe((v) => (value = v))();
  return value;
}
