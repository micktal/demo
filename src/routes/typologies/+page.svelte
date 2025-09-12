<script lang="ts">
  import Button from '$lib/components/Button.svelte';

  const KEY = 'fpsgDemo';
  function readS() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function mergeSave(partial: Record<string, any>) { try { const s = readS(); localStorage.setItem(KEY, JSON.stringify({ ...s, ...partial })); } catch {} }
  function awardBadge(b: string) { try { const s = readS(); const badges = Array.isArray(s.badges) ? s.badges : []; if (!badges.includes(b)) { badges.push(b); } mergeSave({ badges }); } catch {} }
  function addProgress(p = 0) { try { const s = readS(); const v = Math.min(100, Math.round((s.progress || 0) + p)); mergeSave({ progress: v }); } catch {} }
  function addScore(sc = 0) { try { const s = readS(); const v = (s.score || 0) + sc; mergeSave({ score: v }); } catch {} }

  type CatKey = 'LMS'|'Social'|'Business'|'MOOC'|'Repo'|'LXS'|'Custom'|'Apps';
  const cats: Record<CatKey, { title: string; short: string; icon: string; orientation: string; strengths: string; use: string }>= {
    LMS: { title:'Learning Management Systems (LMS)', short:'Web‑based, centralisent cours, suivi et évaluations.', icon:'📚', orientation:'Gestion & conformité', strengths:'Suivi, rôles, évaluations, intégrations SSO/SCORM', use:'Corporate et académique' },
    Social: { title:'Social Learning', short:'Forums, feedbacks pairs, meilleure complétion.', icon:'💬', orientation:'Communauté & entraide', strengths:'Interactions, peer review, engagement', use:'Groupes métiers, partage de pratiques' },
    Business: { title:'Business Training', short:'Montée en compétences orientée performance.', icon:'🏭', orientation:'KPI & efficacité', strengths:'Parcours ciblés, évaluation des compétences', use:'Ventes, sécurité, qualité' },
    MOOC: { title:'MOOCs', short:'Cours massifs, rythme libre, ouverts/payant.', icon:'🌍', orientation:'Ouverture & volume', strengths:'Catalogue large, flexibilité', use:'Upskilling large audience' },
    Repo: { title:'Destination Site', short:'Répertoires type Coursera/Udemy avec outils auteur.', icon:'🗂️', orientation:'Marketplace de contenus', strengths:'Découverte, ratings, auteurs multiples', use:'Portails de formation' },
    LXS: { title:'Learning Experience Systems (LXS)', short:'Expériences immersives, personnalisées.', icon:'✨', orientation:'Expérience & personnalisation', strengths:'Parcours adaptatifs, analytics UX', use:'Onboarding, change management' },
    Custom: { title:'Sur‑mesure', short:'Développement spécifique à vos besoins.', icon:'🛠️', orientation:'Adéquation totale', strengths:'Liberté fonctionnelle et UX', use:'Cas complexes, intégrations spécifiques' },
    Apps: { title:'Learning Apps', short:'Microlearning mobile, jeux et quêtes.', icon:'📱', orientation:'Mobile & microlearning', strengths:'Sessions courtes, gamification', use:'Terrain, just‑in‑time' }
  };

  let active: CatKey | null = null;
  function openCat(k: CatKey){ active = k; addProgress(5); addScore(2); awardBadge(k); }

  // Comparator
  let compA: CatKey | '' = '';
  let compB: CatKey | '' = '';
  function pickA(k: CatKey){ compA = k; }
  function pickB(k: CatKey){ compB = k; }
</script>

<svelte:head>
  <title>Typologies de plateformes e‑learning – Fiducial FPSG</title>
  <meta name="description" content="Du LMS traditionnel aux Learning Apps : comparez 8 familles de plateformes e‑learning et choisissez selon vos objectifs." />
</svelte:head>

<!-- Hero -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-6">
      <h1>Quels types de plateformes e‑learning existe‑t‑il ?</h1>
      <p class="mt-3 max-w-2xl">Du LMS traditionnel aux Learning Apps, découvrez les grandes familles de solutions digitales.</p>
      <div class="mt-4 flex gap-2 flex-wrap">
        <a href="#grid" class="btn-primary">Voir les 8 catégories</a>
        <a href="#interactive" class="btn-ghost">Comparer</a>
      </div>
    </div>
    <div class="col-span-12 md:col-span-6">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white p-4">
        <svg viewBox="0 0 800 400" class="w-full h-auto" role="img" aria-label="Constellation des typologies">
          <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0C6A4C"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs>
          <circle cx="400" cy="200" r="10" fill="url(#lg)" />
          {#each [
            {x:120,y:80,l:'LMS'},{x:680,y:80,l:'Social'},{x:120,y:320,l:'Business'},{x:680,y:320,l:'MOOC'},
            {x:240,y:160,l:'Repo'},{x:560,y:160,l:'LXS'},{x:240,y:260,l:'Custom'},{x:560,y:260,l:'Apps'}] as n}
            <line x1="400" y1="200" x2={n.x} y2={n.y} stroke="#a7f3d0" />
            <circle cx={n.x} cy={n.y} r="8" fill="#dcfce7" stroke="#0C6A4C"/>
            <text x={n.x} y={n.y-12} text-anchor="middle" font-size="12" fill="#0C6A4C">{n.l}</text>
          {/each}
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- Grid 8 catégories -->
<section id="grid" class="container-1200 pt-10 md:pt-12">
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px">
    {#each Object.entries(cats) as [k, c]}
      <div class="rounded-xl border border-black/10 bg-white p-4 cursor-pointer hover:border-brand-green hover:-translate-y-0.5 transition" onclick={() => openCat(k as CatKey)}>
        <div class="text-2xl">{c.icon}</div>
        <div class="font-semibold mt-1">{c.title}</div>
        <p class="text-sm text-gray-700 mt-1">{c.short}</p>
      </div>
    {/each}
  </div>
  <div class="mt-3 text-brand-green">{active ? `Vous avez exploré ${active}` : ''}</div>
</section>

<!-- Interactive: onglets + comparateur -->
<section id="interactive" class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="flex gap-2 flex-wrap">
      {#each Object.keys(cats) as k}
        <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" aria-pressed={active===k} onclick={() => (active = k as CatKey)}>{cats[k as CatKey].title}</button>
      {/each}
    </div>
    {#if active}
      <div class="mt-3">
        <div class="font-semibold">{cats[active].title}</div>
        <ul class="text-sm text-gray-700 list-disc pl-5 mt-1">
          <li><strong>Orientation:</strong> {cats[active].orientation}</li>
          <li><strong>Points forts:</strong> {cats[active].strengths}</li>
          <li><strong>Usages typiques:</strong> {cats[active].use}</li>
        </ul>
      </div>
    {/if}

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div class="text-sm font-medium">Comparateur — Catégorie A</div>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each Object.keys(cats) as k}
            <button class="btn-ghost" aria-pressed={compA===k} onclick={() => pickA(k as CatKey)}>{k}</button>
          {/each}
        </div>
      </div>
      <div>
        <div class="text-sm font-medium">Comparateur — Catégorie B</div>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each Object.keys(cats) as k}
            <button class="btn-ghost" aria-pressed={compB===k} onclick={() => pickB(k as CatKey)}>{k}</button>
          {/each}
        </div>
      </div>
    </div>

    {#if compA && compB}
      <div class="mt-4 overflow-auto">
        <table class="w-full" style="border-collapse:collapse;min-width:680px">
          <thead>
            <tr class="bg-slate-50">
              <th class="p-2 border-b border-slate-200 text-left">Critère</th>
              <th class="p-2 border-b border-slate-200 text-left">{cats[compA as CatKey].title}</th>
              <th class="p-2 border-b border-slate-200 text-left">{cats[compB as CatKey].title}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border-b">Orientation</td><td class="p-2 border-b">{cats[compA as CatKey].orientation}</td><td class="p-2 border-b">{cats[compB as CatKey].orientation}</td></tr>
            <tr><td class="p-2 border-b">Points forts</td><td class="p-2 border-b">{cats[compA as CatKey].strengths}</td><td class="p-2 border-b">{cats[compB as CatKey].strengths}</td></tr>
            <tr><td class="p-2 border-b">Usages</td><td class="p-2 border-b">{cats[compA as CatKey].use}</td><td class="p-2 border-b">{cats[compB as CatKey].use}</td></tr>
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>

<!-- Conclusion -->
<section class="container-1200 pt-12 pb-16">
  <div class="card">
    <div class="font-semibold">Comment choisir ?</div>
    <p class="mt-2 text-gray-700">Le choix dépend de vos objectifs : formation réglementaire, social learning, montée en compétences, microlearning… Notre expertise consiste à conseiller la meilleure combinaison.</p>
    <div class="mt-3">
      <Button href="/contact" variant="primary">Demander un audit plateforme</Button>
    </div>
  </div>
</section>
