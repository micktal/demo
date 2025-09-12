<script lang="ts">
  import { fireConfetti } from '$lib/utils/confetti';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  type Item = { label: string; epi: boolean };
  const source: Item[] = [
    {label:'Gants anti‑coupure', epi:true},
    {label:'Écharpe', epi:false},
    {label:'Casquette', epi:false},
    {label:'Gilet HV', epi:true},
    {label:'Chaussures sécu', epi:true}
  ];
  const total = source.length;
  let left: Item[] = [...source];
  let epiBox: Item[] = [];
  let nonBox: Item[] = [];

  const drag = (e: DragEvent, it: Item) => {
    if (!e.dataTransfer) return;
    e.dataTransfer.setData('text/plain', it.label);
    e.dataTransfer.setData('text', it.label);
    e.dataTransfer.effectAllowed = 'move';
  };
  function drop(to: 'epi'|'non', e: DragEvent){
    e.preventDefault(); e.stopPropagation();
    const label = (e.dataTransfer?.getData('text/plain') || e.dataTransfer?.getData('text') || '').trim();
    if (!label) return;
    const idx = left.findIndex((i)=>i.label===label);
    if(idx>-1){ const [it]=left.splice(idx,1); (to==='epi'?epiBox:nonBox).push(it); check(); }
  }
  const allow = (e: DragEvent)=> { e.preventDefault(); e.dataTransfer && (e.dataTransfer.dropEffect = 'move'); };
  function clickItem(it: Item){
    const idx = left.findIndex(i=>i.label===it.label);
    if(idx>-1){ const [x]=left.splice(idx,1); (x.epi?epiBox:nonBox).push(x); check(); }
  }
  function check(){
    const ok = epiBox.every(i=>i.epi) && nonBox.every(i=>!i.epi) && (epiBox.length+nonBox.length===total);
    if(ok){ fireConfetti(container, 120); dispatch('sort:done'); }
  }
  let container: HTMLDivElement;
</script>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4" bind:this={container}>
  <div>
    <div class="font-medium mb-2">À trier</div>
    <div class="flex flex-wrap gap-2">
      {#each left as it}
        <div class="badge cursor-move" role="option" aria-selected="false" tabindex="0" draggable={true} ondragstart={(e)=>drag(e,it)} onclick={()=>clickItem(it)}>{it.label}</div>
      {/each}
    </div>
  </div>
  <div>
    <div class="font-medium mb-2">EPI obligatoires</div>
    <div class="min-h-24 rounded-lg border border-dashed border-gray-400/40 p-3" role="listbox" tabindex="0" ondragover={allow} ondrop={(e)=>drop('epi',e)}>
      {#if epiBox.length===0}<p class="text-sm text-gray-700">Déposez ici</p>{/if}
      <div class="flex flex-wrap gap-2">{#each epiBox as e}<div class="badge bg-brand-green/20 text-brand-green">{e.label}</div>{/each}</div>
    </div>
  </div>
  <div>
    <div class="font-medium mb-2">Non EPI</div>
    <div class="min-h-24 rounded-lg border border-dashed border-gray-400/40 p-3" role="listbox" tabindex="0" ondragover={allow} ondrop={(e)=>drop('non',e)}>
      {#if nonBox.length===0}<p class="text-sm text-gray-700">Déposez ici</p>{/if}
      <div class="flex flex-wrap gap-2">{#each nonBox as e}<div class="badge">{e.label}</div>{/each}</div>
    </div>
  </div>
</div>
