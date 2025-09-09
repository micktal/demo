<script lang="ts">
  import { demo } from '$lib/stores/demo';
  let state = $state<'idle'|'wait'|'go'|'done'>('idle');
  let msg = $state('Cliquez pour démarrer');
  let start = 0; let timeout: any;
  function begin(){ if(state!=='idle') return; state='wait'; msg='Patientez...'; timeout=setTimeout(()=>{ state='go'; msg='CLIQUEZ !'; start=performance.now(); }, 800+Math.random()*1200); }
  function press(){ if(state==='wait'){ msg='Trop tôt !'; clearTimeout(timeout); state='idle'; }
    else if(state==='go'){ const t = Math.round(performance.now()-start); msg = `Réaction: ${t} ms`; state='done'; demo.addScore(1); demo.award('Ninja du réflexe'); dispatchEvent(new CustomEvent('reaction:done',{detail:t})); setTimeout(()=> state='idle', 1500); } }
</script>

<div class="card text-center">
  <div class="text-sm text-gray-700">Test de réflexe</div>
  <button class="mt-3 btn-primary" onclick={begin} aria-label="Démarrer">Démarrer</button>
  <div class="mt-3 text-lg font-medium">{msg}</div>
  <div class={`mt-4 h-24 rounded-lg ${state==='go' ? 'bg-brand-green/40' : 'bg-black/5'}`} onclick={press} role="button" aria-label="Zone de clic"></div>
</div>
