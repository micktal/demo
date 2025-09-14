<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  import { createEventDispatcher, onDestroy } from 'svelte';
  const dispatch = createEventDispatcher();

  const TOTAL = 20;
  let time = TOTAL; let interval: any; let done = false; let chosen = '';
  let started = false; let host: HTMLDivElement;

  function start(){
    if (started) return;
    started = true;
    if (interval) clearInterval(interval);
    interval = setInterval(()=>{ time--; if(time<=0){ clearInterval(interval); interval = null; }},1000);
  }
  function reset(){ if(interval) clearInterval(interval); interval=null; time = TOTAL; started = false; done = false; chosen = ''; }
  function choose(ans: string){ if(!started) start(); chosen = ans; done = ans === 'A'; if(done && host) { fireConfetti(host, 60); dispatch('timed:done'); } }
  onDestroy(()=>{ if(interval) clearInterval(interval); });
</script>
<div class="card" bind:this={host}>
  <div class="flex items-center justify-between">
    <div class="font-medium">Étude de cas chronométrée</div>
    <div class="badge" aria-live="polite">{time}s</div>
  </div>
  <p class="mt-2">Vous êtes manager. Un conflit éclate. Quelle première action ?</p>
  <div class="mt-3">
    <div class="h-2 rounded-full bg-black/10 overflow-hidden" aria-hidden="true">
      <div class="h-full bg-brand-green transition-[width] duration-1000" style={`width:${Math.max(0, (time/TOTAL)*100)}%`}></div>
    </div>
    <div class="mt-2 text-sm text-gray-700">{started ? 'Répondez avant la fin du chrono.' : 'Le chrono démarre quand vous cliquez sur “Démarrer”. Vous avez 20 s.'}</div>
  </div>
  <div class="mt-3 flex gap-2 flex-wrap">
    <button class="btn-primary" on:click={start} aria-pressed={started} disabled={started}>Démarrer</button>
    <button class="btn-ghost" on:click={() => choose('A')} disabled={!started}>Organiser un entretien individuel</button>
    <button class="btn-ghost" on:click={() => choose('B')} disabled={!started}>Blâmer publiquement</button>
    <button class="btn-ghost" on:click={reset}>Réinitialiser</button>
  </div>
  {#if chosen}<p class="mt-2 text-sm {done ? 'text-brand-green' : 'text-red-600'}">{done ? 'Bonne approche.' : 'À éviter.'}</p>{/if}
  <div class="sr-only" aria-live="polite">Temps restant {time} secondes</div>
</div>
