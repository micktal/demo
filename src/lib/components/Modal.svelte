<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  export let open = false;
  export let title = '';
  export let onClose: () => void = () => {};
  let dialogEl: HTMLDivElement;
  let prevFocus: Element | null = null;

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  onMount(() => {
    if (open) {
      prevFocus = document.activeElement;
      dialogEl?.focus();
      document.addEventListener('keydown', handleKey);
    }
  });
  onDestroy(() => document.removeEventListener('keydown', handleKey));
  $effect(() => { if (open) dialogEl?.focus(); });
</script>

{#if open}
  <div class="fixed inset-0 z-[60] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" on:click={onClose} aria-hidden="true"></div>
    <div bind:this={dialogEl} tabindex="-1" role="dialog" aria-modal="true" aria-label={title}
      class="relative z-[61] w-[min(92vw,900px)] max-h-[85vh] overflow-auto rounded-xl bg-white p-6 shadow-soft">
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-xl font-semibold">{title}</h3>
        <button class="header-link" on:click={onClose} aria-label="Fermer">✕</button>
      </div>
      <div class="mt-4 relative">
        <slot />
      </div>
    </div>
  </div>
{/if}
