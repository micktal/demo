<section class="container-1200 pt-12 md:pt-16">
  <div class="card">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
      {#each Array(6) as _, i}
        <div class="h-8 w-24 rounded bg-black/5"></div>
      {/each}
    </div>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="text-center">
        <div class="text-3xl font-semibold text-brand-green">78%</div>
        <div class="text-sm text-gray-700">de complétion</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-semibold text-brand-green">5</div>
        <div class="text-sm text-gray-700">pays</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-semibold text-brand-green">4</div>
        <div class="text-sm text-gray-700">langues</div>
      </div>
    </div>
  </div>
</section>
