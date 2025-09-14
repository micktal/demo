<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import ProofTile from '$lib/components/ProofTile.svelte';
  import WhyNow from '$lib/components/WhyNow.svelte';
  import ClientsStrip from '$lib/components/ClientsStrip.svelte';
  import CtaBanner from '$lib/components/CtaBanner.svelte';
  import trapFocus from '$lib/actions/trapFocus';
  let videoOpen = false;
</script>

<Hero />

<section class="bg-white">
  <div class="container-1200 pt-8 md:pt-12 pb-12 md:pb-16">
    <div class="grid-12">
      <div class="col-span-12 md:col-span-3"><ProofTile icon="flex" title="Flexible" text="Créez et mettez à jour vos modules en continu." /></div>
      <div class="col-span-12 md:col-span-3"><ProofTile icon="interactive" title="Interactif" text="Quiz, scénarios, simulations engageantes." /></div>
      <div class="col-span-12 md:col-span-3"><ProofTile icon="track" title="Traçable" text="Suivi fin des progrès et rapports exportables." /></div>
      <div class="col-span-12 md:col-span-3"><ProofTile icon="engage" title="Engageant" text="Micro‑interactions, badges et feedbacks." /></div>
    </div>
  </div>
</section>

<section class="bg-gray-50">
  <div class="container-1200 pt-8 md:pt-12 pb-12 md:pb-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      <div>
        <div class="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-black/10">
          <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fde36237294f94c318a401159d4c44f61?format=webp&width=1200" alt="Aperçu de la vidéo" class="absolute inset-0 h-full w-full object-cover" />
          <button class="absolute inset-0 grid place-items-center group" on:click={() => (videoOpen = true)} aria-label="Lire la vidéo">
            <span class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/90 text-brand-green shadow-soft group-hover:scale-105 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </button>
        </div>
      </div>
      <div>
        <details class="rounded-xl border border-black/10 bg-white p-5 md:p-6 open:shadow-sm" aria-label="Transcription de la vidéo">
          <summary class="cursor-pointer font-semibold text-gray-900">Transcription</summary>
          <div class="mt-3 space-y-3 text-gray-700 text-sm leading-6" lang="fr">
            <p>Bonjour, je m'appelle Alex et je travaille pour Fiducial Sécurité, l'un des principaux fournisseurs de sécurité en France.</p>
            <p>Nous comptons plus de 4 000 employés et 120 sites dans tout le pays, protégeant tout, des événements majeurs aux sites sensibles.</p>
            <p>Au sein de notre entreprise se trouve FPSG, une équipe spécialisée dans l'éducation et la formation des adultes.</p>
            <p>Notre expertise allie expérience pratique et innovation de pointe pour une excellence pédagogique.</p>
            <p>Très tôt, nos équipes ont dû relever des défis pour maintenir la cohérence et l'engagement de la formation sur tous les sites.</p>
            <p>Les PDF traditionnels ne suffisaient pas, et nous avions besoin d'un meilleur moyen de suivre les progrès et d'améliorer les compétences.</p>
            <p>C'est alors que nous avons lancé notre nouvelle plateforme d'apprentissage en ligne.</p>
            <p>Il transforme des PDF ennuyeux en modules interactifs avec des quiz et des badges, ce qui rend l'apprentissage plus dynamique et mesurable.</p>
            <p>Basé sur la taxonomie et l'analyse pédagogique de Bloom, il garantit une formation efficace et accessible à tout moment et en tout lieu.</p>
            <p>Cette plateforme a non seulement renforcé les compétences de nos équipes, mais a également fourni aux managers des KPI clairs pour suivre les progrès.</p>
            <p>C'est vraiment la combinaison parfaite entre expertise de terrain et innovation numérique.</p>
            <p>Je suis fier de participer à cette aventure.</p>
            <p>Fiducial Sécurité : leader de la formation en France</p>
            <p>FPSG : Expertise en matière de Formation</p>
            <p>Les défis de la formation</p>
            <p>Plateforme d'apprentissage en ligne innovante</p>
            <p>Découvrez la plateforme Fiducial FPSG. Demandez votre démo dès aujourd'hui !</p>
          </div>
        </details>
      </div>
    </div>
  </div>
</section>

{#if videoOpen}
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/70" on:click={() => (videoOpen = false)}></div>
    <div class="relative z-10 h-full w-full flex items-center justify-center p-4">
      <div class="w-full max-w-4xl" role="dialog" aria-modal="true" aria-label="Lecture de la vidéo" use:trapFocus>
        <div class="relative aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-black/20 bg-black">
          <video class="absolute inset-0 h-full w-full" controls autoplay playsinline preload="metadata" poster="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fde36237294f94c318a401159d4c44f61?format=webp&width=1200">
            <source src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F91fe1e91f89f429caa6b56816e5b9ddc?alt=media&token=c4279c4c-b81a-4b8c-9074-6c8f5dd55eaa&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec" type="video/mp4" />
            <track src="/subtitles/fpsg-fr.vtt" kind="subtitles" srclang="fr" label="Français" default />
          </video>
          <button class="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 text-gray-900 hover:bg-white grid place-items-center" aria-label="Fermer" on:click={() => (videoOpen = false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<section class="bg-white">
  <div class="container-1200 pt-12 md:pt-16 pb-12 md:pb-16">
    <WhyNow />
  </div>
</section>
<section class="bg-gray-50">
  <div class="container-1200 pt-12 md:pt-16 pb-12 md:pb-16">
    <ClientsStrip />
  </div>
</section>
<CtaBanner />
