import { writable, derived, type Writable } from 'svelte/store';

export type DemoState = {
	progress: number;
	score: number;
	badges: string[];
};

const KEY = 'fpsgDemo';

const initial: DemoState = { progress: 0, score: 0, badges: [] };

function load(): DemoState {
	try {
		return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
	} catch {
		return initial;
	}
}

function createDemo() {
	const store: Writable<DemoState> = writable(load());

	store.subscribe((v) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(v));
		} catch {}
	});

	return Object.assign(store, {
		reset() {
			store.set(initial);
		},
		addProgress(p: number) {
			store.update((s) => ({ ...s, progress: Math.min(100, s.progress + Math.max(0, p)) }));
		},
		addScore(n: number) {
			store.update((s) => ({ ...s, score: Math.max(0, s.score + n) }));
		},
		award(badge: string) {
			store.update((s) => (s.badges.includes(badge) ? s : { ...s, badges: [...s.badges, badge] }));
		}
	});
}

export const demo = createDemo();

export const level = derived(demo, ($d) =>
	$d.progress >= 100 ? 'Master' : $d.progress >= 60 ? 'Advanced' : 'Starter'
);
