<script lang="ts">
  export let expression: 'neutral' | 'happy' | 'sad' = 'neutral';
  export let message: string = '';
  export let size: number = 200; // px
  const w = size; const h = size;
</script>

<div class="flex items-center gap-4">
  <svg {w} {h} viewBox="0 0 200 200" role="img" aria-label={`Avatar ${expression}`} class="shrink-0">
    <defs>
      <radialGradient id="skin" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#fff7ed"/>
        <stop offset="100%" stop-color="#fde68a"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.15" />
      </filter>
    </defs>
    <g filter="url(#shadow)">
      <circle cx="100" cy="100" r="86" fill="url(#skin)" stroke="#eab308" stroke-width="4"/>
      <circle cx="70" cy="90" r="8" fill="#111827"/>
      <circle cx="130" cy="90" r="8" fill="#111827"/>
      {#if expression === 'happy'}
        <path d="M60 120 Q100 150 140 120" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round"/>
        <path d="M58 78 Q70 70 82 76" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
        <path d="M118 76 Q130 70 142 78" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
      {:else if expression === 'sad'}
        <path d="M60 140 Q100 112 140 140" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round"/>
        <path d="M58 78 Q70 86 82 80" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
        <path d="M118 80 Q130 86 142 78" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
      {:else}
        <line x1="70" y1="124" x2="130" y2="124" stroke="#111827" stroke-width="6" stroke-linecap="round"/>
      {/if}
    </g>
  </svg>
  {#if message}
    <div class="relative">
      <div class="rounded-2xl border border-black/10 bg-white px-4 py-3 max-w-xs">
        <div class="text-sm">{message}</div>
      </div>
      <svg width="24" height="12" viewBox="0 0 24 12" class="absolute -left-2 top-4" aria-hidden="true">
        <path d="M24 0 L0 6 L24 12 Z" fill="#ffffff" stroke="#e5e7eb"/>
      </svg>
    </div>
  {/if}
</div>

<style>
  :global(svg[role='img']){display:block}
</style>
