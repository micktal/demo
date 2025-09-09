<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  let step = 0; let container: HTMLDivElement;
  function choose(path: 'A'|'B') { step = path === 'A' ? 1 : 2; if (path==='A') fireConfetti(container, 80); }
</script>
<div class="space-y-3" bind:this={container}>
  {#if step === 0}
    <div class="font-medium">Que feriez‑vous ? Un client signale un incident de sécurité.</div>
    <div class="flex gap-2 flex-wrap">
      <button class="btn-primary" on:click={() => choose('A')}>Alerter le référent sécurité</button>
      <button class="btn-ghost" on:click={() => choose('B')}>Ignorer pour l’instant</button>
    </div>
  {:else if step === 1}
    <div class="card">Bonne décision. Vous déclenchez la procédure et sécurisez les accès.</div>
  {:else}
    <div class="card">Conséquence : fuite de données. Recommencez avec la bonne pratique.</div>
  {/if}
</div>
