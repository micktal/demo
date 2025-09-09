<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { demo } from '$lib/stores/demo';
  import { onMount } from 'svelte';

  const KEY = 'fpsgDemo';
  function readS() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function mergeSave(partial: Record<string, any>) { try { const s = readS(); localStorage.setItem(KEY, JSON.stringify({ ...s, ...partial })); } catch {} }

  // SECTION 2 — Timeline interactive
  type StepKey = 'accueil' | 'modules' | 'afest' | 'eval' | 'certif';
  let timelineDesc = $state('');
  const desc: Record<StepKey, string> = {
    accueil:'Bienvenue, objectifs clairs, pré-test facultatif.',
    modules:'Vidéos, quiz, scénarios & interactions engageantes.',
    afest:'Missions terrain guidées + preuves (photo/QR).',
    eval:'Épreuves finales + feedbacks formateurs.',
    certif:'Certificat généré et suivi par le manager.'
  };
  const badgeMap: Record<StepKey, string> = {
    accueil:'Parcours démarré', modules:'Interactif engagé', afest:'AFEST effectuée', eval:'Évaluation passée', certif:'Certificat obtenu'
  };
  function clickStep(k: StepKey) {
    timelineDesc = '✅ ' + desc[k];
    demo.addProgress(6); demo.addScore(3); demo.award(badgeMap[k]);
  }

  // SECTION 3 — Progress global
  let pVal = $state(0);
  let pBadges: string[] = $state([]);
  $effect(() => { const s = readS(); pVal = Math.round(s.progress || 0); pBadges = s.badges || []; });

  // SECTION 5 — Gamification
  let levelText = $state('Starter');
  function refreshLevel() { const p = readS().progress || 0; levelText = p >= 100 ? 'Master' : p >= 60 ? 'Advanced' : 'Starter'; }
  function boostXp() { demo.addProgress(4); demo.addScore(2); demo.award('Motivé'); refreshLevel(); }

  // SECTION 6 — Bloom
  let bloomView: 'before' | 'after' = $state('before');
  function setBloom(v: 'before' | 'after') {
    bloomView = v;
    if (v === 'after') { demo.addProgress(6); demo.addScore(3); demo.award('Bloom maîtrisée'); }
  }

  // SECTION 7 — Certificat
  let nameInput = $state('Apprenant Démo');
  let canvasEl: HTMLCanvasElement | null = null;
  function generateCert() {
    const can = canvasEl; if (!can) return; const ctx = can.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,800,560);
    ctx.strokeStyle = '#0C6A4C'; ctx.lineWidth = 6; ctx.strokeRect(16,16,768,528);
    ctx.fillStyle = '#0C6A4C'; ctx.font = 'bold 28px Inter,Arial'; ctx.fillText('CERTIFICAT DE RÉUSSITE', 230, 80);
    ctx.fillStyle = '#111'; ctx.font = '20px Inter,Arial'; ctx.fillText('Délivré à :', 120, 160);
    ctx.font = 'bold 28px Inter,Arial'; ctx.fillText((nameInput || 'Apprenant Démo'), 220, 160);
    ctx.font = '18px Inter,Arial'; ctx.fillText('Parcours E-learning – Fiducial FPSG', 120, 210);
    const date = new Date().toLocaleDateString('fr-FR'); ctx.fillText('Date : ' + date, 120, 250);
    ctx.fillText('Score & progression selon suivi plateforme.', 120, 290);
    ctx.strokeStyle = '#e5e7eb'; ctx.strokeRect(100,320,600,140);
    ctx.fillStyle = '#666'; ctx.fillText('Signature (tuteur/manager) :', 120, 350);
    const a = document.createElement('a'); a.href = can.toDataURL('image/png'); a.download = 'certificat_demo.png'; a.click();
    demo.addProgress(10); demo.addScore(10); demo.award('Certifié');
  }

  onMount(() => { refreshLevel(); });
</script>

<svelte:head>
  <title>Parcours e-learning clair &amp; mesurable – Fiducial FPSG</title>
  <meta name="description" content="Timeline interactive, progression, badges, vue manager/apprenant, certificat mock et taxonomie de Bloom (avant/après)." />
</svelte:head>

<!-- SECTION 1 — HERO -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-7">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">{(await import('$lib/i18n')).t('parcours.title','Un parcours clair, du premier clic au certificat.')}</h1>
      <p class="mt-4 max-w-2xl">{(await import('$lib/i18n')).t('parcours.subtitle','Chaque apprenant suit un chemin balisé, motivant et mesurable.')}</p>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white p-4">
        <svg viewBox="0 0 800 240" class="w-full h-auto" role="img" aria-label="Ligne de temps: Inscription → Modules → Quiz → AFEST → Certificat">
          <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0C6A4C"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs>
          <line x1="60" y1="120" x2="740" y2="120" stroke="url(#lg)" stroke-width="8" stroke-linecap="round" />
          {#each [60,220,380,540,740] as x, i}
            <circle cx={x} cy="120" r="22" fill="#fff" stroke="#0C6A4C" stroke-width="4" />
            <text x={x} y="170" text-anchor="middle" font-size="14" fill="#111">{['Inscription','Modules','Quiz','AFEST','Certificat'][i]}</text>
          {/each}
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 2 — TIMELINE INTERACTIVE -->
<section id="timeline" class="container-1200 pt-10 md:pt-12">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <p class="text-sm text-gray-700 mb-3">Cliquez une étape pour afficher le détail et gagner le badge associé (démo).</p>
    <div class="flex flex-wrap gap-3 justify-between">
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => clickStep('accueil')}>1) Accueil & objectifs</button>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => clickStep('modules')}>2) Modules e-learning</button>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => clickStep('afest')}>3) AFEST sur site</button>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => clickStep('eval')}>4) Évaluation & feedback</button>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => clickStep('certif')}>5) Certificat final</button>
    </div>
    <div class="mt-3 text-brand-green">{timelineDesc}</div>
  </div>
</section>

<!-- SECTION 3 — BARRE DE PROGRESSION GLOBALE -->
<section class="container-1200 pt-8">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="flex items-center gap-3 flex-wrap">
      <div class="flex-1 min-w-[200px]">
        <div class="h-2.5 rounded-lg bg-black/10 overflow-hidden"><div class="h-full bg-brand-green" style={`width:${pVal}%`}></div></div>
      </div>
      <strong class="min-w-[64px] text-right">{pVal}%</strong>
    </div>
    <div class="mt-2 flex gap-2 flex-wrap" aria-label="Badges">
      {#if (pBadges?.length || 0) === 0}
        <span class="text-gray-500">Aucun badge pour le moment.</span>
      {:else}
        {#each pBadges as b}<span class="badge">{b}</span>{/each}
      {/if}
    </div>
  </div>
  <style>
    .badge{background:#f2fbf7;border:1px solid rgba(12,106,76,.25);color:#0C6A4C;padding:4px 8px;border-radius:999px;font-size:.85rem}
  </style>
</section>

<!-- SECTION 4 — VUE APPRENANT vs MANAGER -->
<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card><div class="p-4"><div class="font-semibold">Ce que je vois</div><ul class="mt-2 list-disc pl-5 text-gray-700"><li>Ma progression personnelle</li><li>Les étapes à venir</li><li>Certificat téléchargeable</li></ul></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Ce que je pilote</div><ul class="mt-2 list-disc pl-5 text-gray-700"><li>Complétion d’équipe</li><li>Relances automatiques</li><li>Exports CSV/JSON, conformité</li></ul></div></Card>
  </div>
</section>

<!-- SECTION 5 — GAMIFICATION (XP & Niveaux) -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4 flex gap-4 items-center flex-wrap">
    <div><strong>Niveau :</strong> {levelText}</div>
    <div class="flex-1 min-w-[220px]"><div class="h-2 rounded-lg bg-black/10 overflow-hidden"><div class="h-full bg-brand-green" style={`width:${pVal}%`}></div></div></div>
    <button class="px-3 py-2 rounded-lg border border-brand-green bg-brand-green/10" onclick={boostXp}>Gagner un peu d’XP (démo)</button>
  </div>
</section>

<!-- SECTION 6 — TAXONOMIE DE BLOOM (Avant / Après) -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="flex gap-2 flex-wrap mb-2">
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" aria-pressed={bloomView==='before'} onclick={() => setBloom('before')}>Avant (papier)</button>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" aria-pressed={bloomView==='after'} onclick={() => setBloom('after')}>Après (digital)</button>
    </div>
    {#if bloomView==='before'}
      <div>
        <h3>Avant : niveaux 1–2</h3>
        <ul class="text-gray-600 list-disc pl-5"><li><strong>Se souvenir</strong> : mémorisation de consignes</li><li><strong>Comprendre</strong> : reformuler, sans mise en pratique</li><li>Peu de traçabilité, pas d’évaluation authentique</li></ul>
      </div>
    {:else}
      <div>
        <h3>Après : niveaux 3–5 (→6)</h3>
        <ul class="text-brand-green list-disc pl-5"><li><strong>Appliquer</strong> : quiz, drag&drop, missions AFEST</li><li><strong>Analyser</strong> : scénarios ramifiés, cas concrets</li><li><strong>Évaluer</strong> : décisions argumentées, feedback</li><li><em>(Créer)</em> : plan d’action / RETEX</li></ul>
        <p class="mt-2 text-brand-green">✅ Progression cognitive mesurable.</p>
      </div>
    {/if}
  </div>
</section>

<!-- SECTION 7 — CERTIFICAT FINAL (mock) -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4 flex gap-3 items-center flex-wrap">
    <input class="rounded-md border border-black/10 p-2" placeholder="Nom Prénom" bind:value={nameInput} />
    <button class="px-3 py-2 rounded-lg border border-brand-green bg-brand-green/10" onclick={generateCert}>Télécharger le certificat (PNG)</button>
    <canvas bind:this={canvasEl} width="800" height="560" style="display:none"></canvas>
  </div>
</section>

<!-- SECTION 8 — TÉMOIGNAGE -->
<section class="container-1200 pt-10">
  <div class="card p-6">
    <blockquote>
      <p class="text-lg">“Avec une vision claire du parcours, nos agents savent exactement quoi faire et nos managers savent où ils en sont.”</p>
      <footer class="mt-2 text-sm text-gray-700">— Responsable Formation, secteur industriel</footer>
    </blockquote>
  </div>
</section>

<!-- SECTION 9 — CTA FINAL -->
<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <div class="text-xl font-semibold">Construisons ensemble vos parcours sur mesure.</div>
    </div>
    <div class="flex gap-3">
      <Button href="/interactions" variant="primary">Demander un parcours démo</Button>
    </div>
  </div>
</section>
