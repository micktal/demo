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
          src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F91fe1e91f89f429caa6b56816e5b9ddc?alt=media&token=c4279c4c-b81a-4b8c-9074-6c8f5dd55eaa&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
          aria-label="Présentation vidéo Fiducial Sécurité">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>
      <details class="mt-4 rounded-xl border border-black/10 bg-white p-4 open:shadow-sm" aria-label="Transcription de la vidéo">
        <summary class="cursor-pointer font-semibold text-gray-900">Transcription</summary>
        <div class="mt-2 space-y-2 text-gray-700 text-sm" lang="fr">
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
</section>

<WhyNow />
<ClientsStrip />
<CtaBanner />
