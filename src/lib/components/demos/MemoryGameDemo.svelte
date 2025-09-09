<script lang="ts">
  import { demo } from '$lib/stores/demo';
  let opened: number[] = $state([]);
  let matched: boolean[] = $state(Array(6).fill(false));
  const icons = ['🦺','🧤','🥽','🪖','👷','⛑️'];
  let deck = $state<number[]>([]);
  function shuffle(){
    const base = [...icons, ...icons].map((_,i)=>i%icons.length);
    for(let i=base.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [base[i],base[j]]=[base[j],base[i]]; }
    deck = base; opened = []; matched = Array(6).fill(false);
  }
  shuffle();
  function clickCard(i: number){ if(opened.length===2 || matched[deck[i]]) return; opened=[...opened,i]; if(opened.length===2){ const [a,b]=opened; if(deck[a]===deck[b]){ matched[deck[a]]=true; opened=[]; if(matched.every(Boolean)){ demo.addScore(2); demo.award('As de la mémoire'); dispatchEvent(new CustomEvent('memory:done',{detail:true})); } } else { setTimeout(()=> opened=[], 700); } } }
</script>

<div class="grid grid-cols-4 gap-2">
  {#each deck as v, i}
    <button class="aspect-square rounded-lg border border-black/10 bg-white text-2xl" onclick={() => clickCard(i)} aria-label="Carte">
      {#if opened.includes(i) || matched[v]}{icons[v]}{:else}?{/if}
    </button>
  {/each}
</div>
