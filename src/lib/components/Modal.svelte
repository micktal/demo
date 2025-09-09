<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import trapFocus from '$lib/actions/trapFocus';
  let { openKey = null, title = '', onClose = () => {}, children } = $props();
  let dialogEl = $state<HTMLDivElement | null>(null);
  let prevFocus: Element | null = null;

  function close() {
    try { (prevFocus as HTMLElement)?.focus?.(); } catch {}
    onClose();
  }
  function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }

  onMount(() => {
    if (openKey) {
      prevFocus = typeof document !== 'undefined' ? document.activeElement : null;
      dialogEl?.focus();
      if (typeof document !== 'undefined') document.addEventListener('keydown', handleKey);
    }
  });
  onDestroy(() => { if (typeof document !== 'undefined') document.removeEventListener('keydown', handleKey); });
  $effect(() => { if (openKey) dialogEl?.focus(); });
</script>

{#if openKey}
  <div class="fixed inset-0 z-[60] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" onclick={close} aria-hidden="true"></div>
    <div bind:this={dialogEl} tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="modal-title"
      class="relative z-[61] w-[min(92vw,900px)] max-h-[85vh] overflow-auto rounded-xl bg-white p-6 shadow-soft" use:trapFocus>
      <div class="flex items-center justify-between gap-4">
        <h3 id="modal-title" class="text-xl font-semibold">{title}</h3>
        <button class="header-link" onclick={close} aria-label="Fermer">✕</button>
      </div>
      <div class="mt-4 relative">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
