<script lang="ts">
  let cards = [
    { q: 'RGPD', a: 'Règlement Général sur la Protection des Données' },
    { q: 'LMS', a: 'Learning Management System' },
    { q: 'xAPI', a: 'Experience API pour suivi fin' }
  ];
  let flipped: Record<number, boolean> = {};
</script>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {#each cards as c, i}
    <button class="card h-32 relative perspective" on:click={() => flipped[i]=!flipped[i]}>
      <div class={`absolute inset-0 transition-transform duration-300 [transform-style:preserve-3d] ${flipped[i] ? '[transform:rotateY(180deg)]' : ''}`}>
        <div class="absolute inset-0 grid place-items-center backface-hidden">{c.q}</div>
        <div class="absolute inset-0 grid place-items-center [transform:rotateY(180deg)] backface-hidden">
          <div class="text-center px-4">{c.a}</div>
        </div>
      </div>
    </button>
  {/each}
</div>
<style>
  .backface-hidden{backface-visibility:hidden}
  .perspective{perspective:1000px}
</style>
