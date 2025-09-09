<script lang="ts">
  export let title: string;
  export let description: string = '';
</script>

<button class="card text-left group w-full hover:shadow-lg transition-shadow">
  <div class="flex items-start gap-3">
    <div class="h-10 w-10 flex-shrink-0 rounded-lg bg-brand-green/10 text-brand-green grid place-items-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 6 6 .5-4.5 4 1 6-5.5-3-5.5 3 1-6L3 8.5 9 8l3-6Z"/></svg>
    </div>
    <div>
      <div class="font-semibold text-gray-900">{title}</div>
      {#if description}<p class="mt-1 text-gray-700 text-sm">{description}</p>{/if}
    </div>
  </div>
</button>
