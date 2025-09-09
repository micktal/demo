<script lang="ts">
  let active = '';
</script>
<div class="relative">
  <div class="aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-brand-green/10 via-white to-brand-green/20"></div>
  <button class="absolute left-[20%] top-[35%] h-6 w-6 rounded-full bg-brand-green text-white text-xs" on:click={() => active='Serveur'} aria-label="Serveur">?</button>
  <button class="absolute left-[65%] top-[55%] h-6 w-6 rounded-full bg-brand-green text-white text-xs" on:click={() => active='Pare-feu'} aria-label="Pare-feu">?</button>
  {#if active}
    <div class="absolute left-4 bottom-4 card">{active}: Détail et bonnes pratiques.</div>
  {/if}
</div>
