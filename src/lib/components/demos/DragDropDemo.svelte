<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  let items = ['Phishing', 'Mot de passe', 'VPN'];
  let dropped: string[] = [];
  let container: HTMLDivElement;
  const allowDrop = (e: DragEvent) => { e.preventDefault(); };
  const drag = (e: DragEvent, item: string) => { e.dataTransfer?.setData('text/plain', item); };
  const drop = (e: DragEvent) => { e.preventDefault(); const d = e.dataTransfer?.getData('text/plain'); if (d && !dropped.includes(d)) dropped = [...dropped, d]; if (dropped.length === items.length) fireConfetti(container); };
</script>
<div class="grid grid-cols-2 gap-4" bind:this={container}>
  <div role="list" aria-label="Éléments à déplacer">
    <div class="font-medium mb-2">Éléments</div>
    <div class="flex flex-wrap gap-2">
      {#each items as it}
        {#if !dropped.includes(it)}
          <div class="badge cursor-move" draggable on:dragstart={(e) => drag(e,it)}>{it}</div>
        {/if}
      {/each}
    </div>
  </div>
  <div>
    <div class="font-medium mb-2">Déposez ici</div>
    <div class="min-h-24 rounded-lg border border-dashed border-gray-400/40 p-3" role="listbox" tabindex="0" on:dragover={allowDrop} on:drop={drop}>
      {#if dropped.length === 0}
        <p class="text-sm text-gray-700">Faites glisser les éléments.</p>
      {:else}
        <div class="flex flex-wrap gap-2">
          {#each dropped as d}<div class="badge bg-brand-green/20 text-brand-green">{d}</div>{/each}
        </div>
      {/if}
    </div>
  </div>
</div>
