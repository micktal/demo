<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import KPITile from '$lib/components/KPITile.svelte';
  import InteractionTile from '$lib/components/InteractionTile.svelte';
  import Card from '$lib/components/Card.svelte';
</script>

<Hero />

<section class="container-1200 pt-4 md:pt-8">
  <div class="grid-12">
    <div class="col-span-12 md:col-span-3"><KPITile value="96%" label="Satisfaction apprenants" sublabel="Moyenne clients" /></div>
    <div class="col-span-12 md:col-span-3"><KPITile value="-35%" label="Temps de production" sublabel="Grâce aux modèles" /></div>
    <div class="col-span-12 md:col-span-3"><KPITile value="82%" label="Adoption équipe" sublabel="Déploiements réussis" /></div>
    <div class="col-span-12 md:col-span-3"><KPITile value="x3" label="ROI moyen" sublabel="Mesuré à 12 mois" /></div>
  </div>
</section>

<section class="container-1200 pt-12 md:pt-16 pb-16">
  <div class="grid-12 items-start">
    <div class="col-span-12 md:col-span-5">
      <h2>Interactions riches</h2>
      <p class="mt-4">Créez des expériences engageantes : quiz adaptatifs, simulations, scénarios, évaluations, certifications et plus encore. Conforme SCORM/xAPI.</p>
    </div>
    <div class="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
      <InteractionTile icon="quiz" title="Quiz adaptatifs" description="Questions intelligentes avec feedback immédiat et niveaux de difficulté." />
      <InteractionTile icon="simulate" title="Simulations" description="Mises en situation réalistes pour ancrer les compétences." />
      <InteractionTile icon="sparkles" title="Scénarios ramifiés" description="Parcours conditionnels en fonction des choix de l'apprenant." />
      <InteractionTile icon="sparkles" title="SCORM / xAPI" description="Suivi fin des progrès et compatibilité LMS." />
    </div>
  </div>

  <div class="mt-12">
    <Card className="text-center">
      <h3>Accessibilité & Langues</h3>
      <p class="mt-3">Respect des standards WCAG, options de contraste et taille de police, gestion multilingue FR/EN par défaut.</p>
    </Card>
  </div>
</section>
