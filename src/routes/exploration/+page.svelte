<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import InteractionCard from '$lib/components/InteractionCard.svelte';
  import VideoQuizDemo from '$lib/components/demos/VideoQuizDemo.svelte';
  import BranchingScenarioDemo from '$lib/components/demos/BranchingScenarioDemo.svelte';
  import HotspotsDemo from '$lib/components/demos/HotspotsDemo.svelte';
  import DragDropDemo from '$lib/components/demos/DragDropDemo.svelte';
  import FlashcardsDemo from '$lib/components/demos/FlashcardsDemo.svelte';
  import TimedCaseDemo from '$lib/components/demos/TimedCaseDemo.svelte';
  import ChecklistDemo from '$lib/components/demos/ChecklistDemo.svelte';
  import AudioPodcastDemo from '$lib/components/demos/AudioPodcastDemo.svelte';
  import ThreeDMockDemo from '$lib/components/demos/ThreeDMockDemo.svelte';

  type DemoKey = 'video'|'scenario'|'hotspots'|'drag'|'flash'|'timed'|'checklist'|'audio'|'threeD';
  let open: DemoKey | null = null;
  const cards: { key: DemoKey; title: string; description: string }[] = [
    { key: 'video', title: 'Vidéo interactive', description: 'Questions in‑video' },
    { key: 'scenario', title: 'Scénario à embranchements', description: 'Que feriez‑vous ?' },
    { key: 'hotspots', title: 'Image à hotspots', description: 'Plan de site / poste de travail' },
    { key: 'drag', title: 'Drag & Drop', description: 'Classer / associer' },
    { key: 'flash', title: 'Flashcards', description: 'Révélation' },
    { key: 'timed', title: 'Étude de cas chronométrée', description: '' },
    { key: 'checklist', title: 'Checklist engageante', description: 'Accusé de lecture' },
    { key: 'audio', title: 'Capsule audio / podcast', description: '' },
    { key: 'threeD', title: '3D / 360° (mock)', description: '' }
  ];
</script>

<section class="container-1200 pt-12 md:pt-16">
  <h1>Galerie d’interactions</h1>
  <p class="mt-3 max-w-2xl">Le showroom des possibilités e‑learning. Ouvrez une carte pour tester une mini‑démo.</p>

  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    {#each cards as c}
      <div on:click={() => (open = c.key)}>
        <InteractionCard title={c.title} description={c.description} />
      </div>
    {/each}
  </div>
</section>

<Modal bind:openKey={open} title="Démo" onClose={() => (open = null)}>
  {#if open === 'video'}<VideoQuizDemo />{/if}
  {#if open === 'scenario'}<BranchingScenarioDemo />{/if}
  {#if open === 'hotspots'}<HotspotsDemo />{/if}
  {#if open === 'drag'}<DragDropDemo />{/if}
  {#if open === 'flash'}<FlashcardsDemo />{/if}
  {#if open === 'timed'}<TimedCaseDemo />{/if}
  {#if open === 'checklist'}<ChecklistDemo />{/if}
  {#if open === 'audio'}<AudioPodcastDemo />{/if}
  {#if open === 'threeD'}<ThreeDMockDemo />{/if}
</Modal>

<section class="container-1200 pt-12 md:pt-16">
  <h2>Accessibilité prête</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    <div class="card">Sous‑titres et transcript intégrés pour audio/vidéo.</div>
    <div class="card">Navigation clavier, focus visible, ARIA roles.</div>
    <div class="card">Contraste et taille de police ajustables (header).</div>
  </div>
</section>

<section class="container-1200 pt-12 md:pt-16 pb-16">
  <h2>Gamification</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
    <div class="card">Badges de réussite, points et paliers.</div>
    <div class="card">
      <div class="font-medium">Progression</div>
      <div class="mt-2 h-3 w-full overflow-hidden rounded-full bg-black/10">
        <div class="h-full bg-brand-green" style="width: 64%"></div>
      </div>
      <p class="mt-2 text-sm text-gray-700">64% de complétion</p>
    </div>
    <div class="card">Feedback positif (confettis) lors des réussites.</div>
  </div>
</section>
