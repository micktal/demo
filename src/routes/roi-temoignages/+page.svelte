<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
  <title>ROI & Témoignages – Fiducial FPSG</title>
  <meta name="description" content="Mesurez le ROI de vos parcours et découvrez des témoignages concrets de déploiements réussis." />
</svelte:head>

<section class="container-1200 pt-12 md:pt-16">
  <h1>ROI & témoignages clients</h1>
  <p class="mt-3 max-w-2xl">Impact mesuré, retours concrets et cas sectoriels.</p>
</section>

<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="card text-center"><div class="text-3xl font-semibold text-brand-green">-32%</div><div class="text-xs text-gray-600">Coûts de formation</div></div>
    <div class="card text-center"><div class="text-3xl font-semibold text-brand-green">+41%</div><div class="text-xs text-gray-600">Engagement apprenants</div></div>
    <div class="card text-center"><div class="text-3xl font-semibold text-brand-green">2x</div><div class="text-xs text-gray-600">Vitesse de déploiement</div></div>
  </div>
</section>

<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card><div class="p-4"><div class="font-semibold">Industrie</div><p class="mt-2 text-gray-700">« Passage du PDF à des modules interactifs. 78% → 93% de complétion. »</p></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Services</div><p class="mt-2 text-gray-700">« AFEST tracée et certifs générés automatiquement. »</p></div></Card>
  </div>
</section>

<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <div class="text-xl font-semibold">Envie d’en savoir plus ?</div>
    </div>
    <div class="flex gap-3">
      <Button href="/processus" variant="ghost">Voir notre processus</Button>
      <Button href="/contact" variant="primary">Nous contacter</Button>
    </div>
  </div>
</section>
