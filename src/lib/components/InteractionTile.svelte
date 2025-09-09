<script lang="ts">
  export let title: string;
  export let description: string;
  export let icon: string = 'sparkles';
</script>

<div class="card hover:shadow-lg transition-shadow group">
  <div class="flex items-start gap-3">
    <div class="h-10 w-10 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center">
      {#if icon === 'quiz'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm.75 14.75h-1.5v-1.5h1.5v1.5Zm1.7-6.65c-.27.38-.69.7-1.22 1.03-.42.26-.67.47-.77.66-.1.19-.13.42-.13.79h-1.5c0-.56.07-1.02.27-1.39.19-.37.54-.7 1.06-1.02.43-.27.72-.5.88-.69.16-.19.24-.41.24-.69 0-.42-.14-.74-.41-.98-.27-.24-.64-.36-1.09-.36-.49 0-.9.15-1.2.45-.31.3-.49.72-.52 1.26H8.5c.04-.9.36-1.62.95-2.15.6-.53 1.37-.79 2.3-.79.92 0 1.66.23 2.21.69.55.46.83 1.08.83 1.87 0 .5-.14.95-.34 1.27Z"/></svg>
      {:else if icon === 'simulate'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 7l9 5-9 5-9-5 9-5Zm0 3.236L7.618 12 12 14.764 16.382 12 12 10.236Z"/></svg>
      {:else}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      {/if}
    </div>
    <div>
      <div class="font-semibold text-gray-900">{title}</div>
      <p class="mt-1 text-gray-700">{description}</p>
    </div>
  </div>
</div>
