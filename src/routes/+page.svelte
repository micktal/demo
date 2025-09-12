<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import ProofTile from '$lib/components/ProofTile.svelte';
  import WhyNow from '$lib/components/WhyNow.svelte';
  import ClientsStrip from '$lib/components/ClientsStrip.svelte';
  import CtaBanner from '$lib/components/CtaBanner.svelte';
</script>

<Hero />

<section class="container-1200 pt-6 md:pt-10">
  <div class="grid-12">
    <div class="col-span-12 md:col-span-3"><ProofTile icon="flex" title="Flexible" text="Créez et mettez à jour vos modules en continu." /></div>
    <div class="col-span-12 md:col-span-3"><ProofTile icon="interactive" title="Interactif" text="Quiz, scénarios, simulations engageantes." /></div>
    <div class="col-span-12 md:col-span-3"><ProofTile icon="track" title="Traçable" text="Suivi fin des progrès et rapports exportables." /></div>
    <div class="col-span-12 md:col-span-3"><ProofTile icon="engage" title="Engageant" text="Micro‑interactions, badges et feedbacks." /></div>
  </div>
</section>

<section class="container-1200 pt-6 md:pt-10">
  <div class="grid-12">
    <div class="col-span-12">
      <div class="rounded-xl overflow-hidden shadow-lg">
        <video
          class="w-full h-auto"
          controls
          playsinline
          preload="metadata"
          src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fedaf0f8287ba4b0f8ac21c19a30c54d7?alt=media&token=f69f48cb-0831-48f0-b74d-b8bdf7d56ec8&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
          aria-label="Présentation vidéo">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>
    </div>
  </div>
</section>

<WhyNow />
<ClientsStrip />
<CtaBanner />
