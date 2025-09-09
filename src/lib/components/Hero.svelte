<script lang="ts">
  import Button from './Button.svelte';
  import Badge from './Badge.svelte';
</script>

<section class="container-1200 pt-12 md:pt-16 pb-12 md:pb-16">
  <div class="grid-12 items-center">
    <div class="col-span-12 md:col-span-7">
      <div class="flex items-center gap-3"><Badge>Démo e‑learning • FPSG</Badge></div>
      <h1 class="mt-4">La formation qui agit sur le terrain</h1>
      <p class="mt-4 md:mt-6 max-w-2xl">Passez du papier au e‑learning interactif, traçable et engageant.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" href="/exploration">Exploration guidée</Button>
        <Button variant="ghost" href="/interactions">Voir les interactions</Button>
        <Button variant="ghost" href="/tableau-de-bord">Tableau de bord Manager</Button>
      </div>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="relative mt-10 md:mt-0">
        <!-- Desktop mockup -->
        <div class="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-brand-green/10 via-white to-brand-green/20 shadow-soft"></div>
        <!-- Mobile mockup overlay -->
        <div class="absolute -bottom-6 -left-6 w-40 sm:w-48 aspect-[9/16] rounded-2xl bg-gradient-to-br from-brand-green/20 via-white to-brand-green/30 shadow-soft border border-black/5"></div>
        <div class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand-green/20 blur-2xl"></div>
      </div>
    </div>
  </div>
</section>
