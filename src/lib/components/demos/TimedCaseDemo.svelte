<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  let time = 20; let interval: any; let done = false; let chosen = '';
  function start(){ if(interval) return; interval = setInterval(()=>{ time--; if(time<=0){ clearInterval(interval); }},1000); }
  function choose(ans: string){ chosen = ans; done = ans === 'A'; if(done) fireConfetti(document.body, 60); }
</script>
<div class="card">
  <div class="flex items-center justify-between"><div class="font-medium">Étude de cas chronométrée</div><div class="badge">{time}s</div></div>
  <p class="mt-2">Vous êtes manager. Un conflit éclate. Quelle première action ?</p>
  <div class="mt-3 flex gap-2 flex-wrap">
    <button class="btn-ghost" on:click={() => {start(); choose('A');}}>Organiser un entretien individuel</button>
    <button class="btn-ghost" on:click={() => {start(); choose('B');}}>Blâmer publiquement</button>
  </div>
  {#if chosen}<p class="mt-2 text-sm {done ? 'text-brand-green' : 'text-red-600'}">{done ? 'Bonne approche.' : 'À éviter.'}</p>{/if}
</div>
