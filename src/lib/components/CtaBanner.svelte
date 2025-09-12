<script lang="ts">
  import Button from './Button.svelte';
</script>
<section class="container-1200 pt-12 md:pt-16 pb-16">
  <div class="rounded-xl border border-black/10 bg-gradient-to-r from-brand-green/10 via-white to-brand-green/10 p-8 md:p-10 flex flex-col items-center justify-center text-center gap-3 shadow-soft">
    <div>
      <h3>En 10 jours, transformez un PDF en module interactif.</h3>
      <p class="mt-2 text-gray-700">Accompagnement de bout en bout et modèles prêts à l’emploi.</p>
      <div class="mt-4 flex gap-2 justify-center flex-wrap">
        <Button href="/processus" variant="primary" target="_blank" rel="noopener">Voir le processus</Button>
        <Button href="/typologies" variant="ghost" target="_blank" rel="noopener">Typologies de plateformes</Button>
      </div>
    </div>
  </div>
</section>
