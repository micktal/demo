<script lang="ts">
  import Button from './Button.svelte';
  import Badge from './Badge.svelte';
</script>

<section class="container-1200 pt-10 md:pt-16 pb-10 md:pb-14">
  <div class="grid-12 items-center">
    <div class="col-span-12 md:col-span-7">
      <Badge>Démo e‑learning • FPSG</Badge>
      <h1 class="mt-4">Accélérez la montée en compétence avec un e‑learning premium</h1>
      <p class="mt-4 md:mt-6 max-w-2xl">Concevez des parcours interactifs, suivez l'impact avec un tableau de bord clair et obtenez un ROI mesurable. Accessibilité et multilingue intégrés.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" href="/contact">Demander une démo projet</Button>
        <Button variant="ghost" href="/comparatif">Voir le comparatif</Button>
      </div>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="relative mt-10 md:mt-0">
        <div class="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-brand-green/15 via-white to-brand-green/10 shadow-soft"></div>
        <div class="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-brand-green/20 blur-2xl"></div>
        <div class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-brand-green/30 blur-xl"></div>
      </div>
    </div>
  </div>
</section>
