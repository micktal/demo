<script lang="ts">
  export let title: string;
  export let text: string;
  export let icon: 'flex' | 'interactive' | 'track' | 'engage' = 'flex';
</script>

<div class="card text-left hover:shadow-lg transition-shadow">
  <div class="flex items-start gap-3">
    <div class="h-10 w-10 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center">
      {#if icon === 'flex'}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7h16v2H4V7Zm0 4h10v2H4v-2Zm0 4h16v2H4v-2Z"/></svg>
      {:else if icon === 'interactive'}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .5-4.5 4 1 6-5.5-3-5.5 3 1-6L3 8.5 9 8l3-6Z"/></svg>
      {:else if icon === 'track'}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v4H3V3Zm2 6h14v12H5V9Zm4 3v6h2v-6H9Zm4 0v6h2v-6h-2Z"/></svg>
      {:else}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21c4.4-3.9 8-7.2 8-11.2C20 6 18 4 15.8 4c-1.7 0-3 .9-3.8 2.3C11.2 4.9 9.9 4 8.2 4 6 4 4 6 4 9.8 4 13.8 7.6 17.1 12 21Z"/></svg>
      {/if}
    </div>
    <div>
      <div class="font-semibold text-gray-900">{title}</div>
      <p class="mt-1 text-gray-700 text-sm">{text}</p>
    </div>
  </div>
</div>
