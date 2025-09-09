<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  let asked = false; let correct = false; let container: HTMLDivElement;
  function startQuiz() { asked = true; }
  function answer(ok: boolean) { correct = ok; if (ok && container) fireConfetti(container); }
</script>
<div class="relative" bind:this={container}>
  <div class="aspect-video w-full rounded-xl bg-black/5 grid place-items-center text-gray-700">Vidéo (placeholder)</div>
  <div class="mt-3">
    {#if !asked}
      <button class="btn-primary" on:click={startQuiz}>Lancer et poser une question</button>
    {:else}
      <div class="card">
        <div class="font-medium">Question : Où cliqueriez‑vous pour ouvrir le menu ?</div>
        <div class="mt-3 flex gap-2 flex-wrap">
          <button class="btn-ghost" on:click={() => answer(false)}>Bas de page</button>
          <button class="btn-ghost" on:click={() => answer(true)}>En haut à droite</button>
          <button class="btn-ghost" on:click={() => answer(false)}>Au centre</button>
        </div>
        {#if correct}<p class="mt-2 text-brand-green font-medium">Correct ✓</p>{/if}
      </div>
    {/if}
  </div>
</div>
