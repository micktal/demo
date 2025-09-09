<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  let steps = [
    'Lire la procédure',
    'Regarder la vidéo',
    'Valider la compréhension'
  ];
  let done: Record<number, boolean> = {}; let host: HTMLDivElement;
  $effect(() => {
    const all = steps.every((_, i) => done[i]);
    if (all && host) fireConfetti(host, 80);
  });
</script>
<div class="card" bind:this={host}>
  <div class="font-medium">Checklist engageante</div>
  <ul class="mt-2 space-y-2">
    {#each steps as s, i}
      <li class="flex items-center gap-2">
        <input type="checkbox" class="h-4 w-4" bind:checked={done[i]} id={`step-${i}`}/>
        <label for={`step-${i}`}>{s}</label>
      </li>
    {/each}
  </ul>
  {#if steps.every((_,i)=>done[i])}
    <div class="mt-3 badge bg-brand-green/20 text-brand-green">Accusé de lecture enregistré</div>
  {/if}
</div>
