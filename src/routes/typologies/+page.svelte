<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { t } from '$lib/i18n';

  const KEY = 'fpsgDemo';
  function readS() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function mergeSave(partial: Record<string, any>) { try { const s = readS(); localStorage.setItem(KEY, JSON.stringify({ ...s, ...partial })); } catch {} }
  function awardBadge(b: string) { try { const s = readS(); const badges = Array.isArray(s.badges) ? s.badges : []; if (!badges.includes(b)) { badges.push(b); } mergeSave({ badges }); } catch {} }
  function addProgress(p = 0) { try { const s = readS(); const v = Math.min(100, Math.round((s.progress || 0) + p)); mergeSave({ progress: v }); } catch {} }
  function addScore(sc = 0) { try { const s = readS(); const v = (s.score || 0) + sc; mergeSave({ score: v }); } catch {} }

  type CatKey = 'LMS'|'Social'|'Business'|'MOOC'|'Repo'|'LXS'|'Custom'|'Apps';
  const catKeys: CatKey[] = ['LMS','Social','Business','MOOC','Repo','LXS','Custom','Apps'];
  function cTitle(k: CatKey){ return t(`typologies.cat.${k}.title`, {
    LMS:'Learning Management Systems (LMS)', Social:'Social Learning', Business:'Business Training', MOOC:'MOOCs', Repo:'Destination Site', LXS:'Learning Experience Systems (LXS)', Custom:'Sur‑mesure', Apps:'Learning Apps'
  }[k]); }
  function cShort(k: CatKey){ return t(`typologies.cat.${k}.short`, {
    LMS:'Web‑based, centralisent cours, suivi et évaluations.', Social:'Forums, feedbacks pairs, meilleure complétion.', Business:'Montée en compétences orientée performance.', MOOC:'Cours massifs, rythme libre, ouverts/payant.', Repo:'Répertoires type Coursera/Udemy avec outils auteur.', LXS:'Expériences immersives, personnalisées.', Custom:'Développement spécifique à vos besoins.', Apps:'Microlearning mobile, jeux et quêtes.'
  }[k]); }
  function cOrientation(k: CatKey){ return t(`typologies.cat.${k}.orientation`, { LMS:'Gestion & conformité', Social:'Communauté & entraide', Business:'KPI & efficacité', MOOC:'Ouverture & volume', Repo:'Marketplace de contenus', LXS:'Expérience & personnalisation', Custom:'Adéquation totale', Apps:'Mobile & microlearning' }[k]); }
  function cStrengths(k: CatKey){ return t(`typologies.cat.${k}.strengths`, { LMS:'Suivi, rôles, évaluations, intégrations SSO/SCORM', Social:'Interactions, peer review, engagement', Business:'Parcours ciblés, évaluation des compétences', MOOC:'Catalogue large, flexibilité', Repo:'Découverte, ratings, auteurs multiples', LXS:'Parcours adaptatifs, analytics UX', Custom:'Liberté fonctionnelle et UX', Apps:'Sessions courtes, gamification' }[k]); }
  function cUse(k: CatKey){ return t(`typologies.cat.${k}.use`, { LMS:'Corporate et académique', Social:'Groupes métiers, partage de pratiques', Business:'Ventes, sécurité, qualité', MOOC:'Upskilling large audience', Repo:'Portails de formation', LXS:'Onboarding, change management', Custom:'Cas complexes, intégrations spécifiques', Apps:'Terrain, just‑in‑time' }[k]); }
  function cDetails(k: CatKey){ return t(`typologies.cat.${k}.details`, { LMS:'Administration des formations, catalogues, rôles (apprenant/formateur), reporting SCORM/xAPI.', Social:'Ajoute forums, fils de discussion, likes, peer review et missions collaboratives.', Business:'Ciblé métiers; compétences mesurées, plans d’action et KPIs opérationnels.', MOOC:'Large audience; parcours à rythme libre, certificats, parfois monétisation.', Repo:'Catalogue de contenus avec recherche, évaluations et outils auteur intégrés.', LXS:'Personnalisation, parcours adaptatifs, analytics d’usage.', Custom:'Développement spécifique: intégrations SI, UX dédiée, logique métier avancée.', Apps:'Micro‑sessions mobiles gamifiées, notifications et mode hors‑ligne.' }[k]); }

  let active: CatKey | null = null;
  function openCat(k: CatKey){ active = k; addProgress(5); addScore(2); awardBadge(k); }

  // Comparator
  let compA: CatKey | '' = '';
  let compB: CatKey | '' = '';
  function pickA(k: CatKey){ compA = k; }
  function pickB(k: CatKey){ compB = k; }

  // Details & expansion per card
  const details: Record<CatKey, string> = {
    LMS: "Administration des formations, catalogues, rôles (apprenant/formateur), reporting SCORM/xAPI.",
    Social: "Ajoute forums, fils de discussion, likes, peer review et missions collaboratives.",
    Business: "Ciblé métiers; compétences mesurées, plans d’action et KPIs opérationnels.",
    MOOC: "Large audience; parcours à rythme libre, certificats, parfois monétisation.",
    Repo: "Catalogue de contenus avec recherche, évaluations et outils auteur intégrés.",
    LXS: "Oriente l’expérience: personnalisation, parcours adaptatifs, analytics d’usage.",
    Custom: "Développement spécifique: intégrations SI, UX dédiée, logique métier avancée.",
    Apps: "Micro‑sessions mobiles gamifiées, notifications et mode hors‑ligne."
  };
  let expanded: Partial<Record<CatKey, boolean>> = {};
  function toggleExpand(k: CatKey){ expanded[k] = !expanded[k]; }
</script>

<svelte:head>
  <title>Typologies de plateformes e‑learning – Fiducial FPSG</title>
  <meta name="description" content="Du LMS traditionnel aux Learning Apps : comparez 8 familles de plateformes e‑learning et choisissez selon vos objectifs." />
</svelte:head>

<!-- Hero -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-6">
      <h1>{t('typologies.hero.title','Quels types de plateformes e‑learning existe‑t‑il ?')}</h1>
      <p class="mt-3 max-w-2xl">{t('typologies.hero.subtitle','Du LMS traditionnel aux Learning Apps, découvrez les grandes familles de solutions digitales.')}</p>
      <div class="mt-4 flex gap-2 flex-wrap">
        <a href="#grid" class="btn-primary">{t('typologies.cta.grid','Voir les 8 catégories')}</a>
        <a href="#interactive" class="btn-ghost">{t('typologies.cta.compare','Comparer')}</a>
      </div>
    </div>
    <div class="col-span-12 md:col-span-6">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white p-4">
        <svg viewBox="0 0 800 400" class="w-full h-auto" role="img" aria-label={t('typologies.constellation','Constellation des typologies')}>
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
  <div class="grid" style="grid-template: none / repeat(auto-fit,minmax(250px,1fr));gap:16px">
    {#each catKeys as k}
      <div class="rounded-xl border border-black/10 bg-white p-4 cursor-pointer hover:border-brand-green hover:-translate-y-0.5 transition" onclick={() => { openCat(k as CatKey); toggleExpand(k as CatKey); }} aria-expanded={expanded[k as CatKey] ? 'true' : 'false'}>
        <div class="font-semibold mt-1">{cTitle(k as CatKey)}</div>
        <p class="text-sm text-gray-700 mt-1">{cShort(k as CatKey)}</p>
        {#if expanded[k as CatKey]}
          <p class="mt-2 text-sm text-gray-700">{cDetails(k as CatKey)}</p>
        {/if}
      </div>
    {/each}
  </div>
  <div class="mt-3 text-brand-green">{active ? `Vous avez exploré ${active}` : ''}</div>
</section>

<!-- Interactive: onglets + comparateur -->
<section id="interactive" class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="flex gap-2 flex-wrap">
      {#each catKeys as k}
        <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" aria-pressed={active===k} onclick={() => (active = k as CatKey)}>{cTitle(k as CatKey)}</button>
      {/each}
    </div>
    {#if active}
      <div class="mt-3">
        <div class="font-semibold">{cTitle(active)}</div>
        <ul class="text-sm text-gray-700 list-disc pl-5 mt-1">
          <li><strong>{t('typologies.labels.orientation','Orientation')}:</strong> {cOrientation(active)}</li>
          <li><strong>{t('typologies.labels.strengths','Points forts')}:</strong> {cStrengths(active)}</li>
          <li><strong>{t('typologies.labels.uses','Usages typiques')}:</strong> {cUse(active)}</li>
        </ul>
      </div>
    {/if}

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div class="text-sm font-medium">{t('typologies.compare.a','Comparateur — Catégorie A')}</div>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each catKeys as k}
            <button class="btn-ghost" aria-pressed={compA===k} onclick={() => pickA(k as CatKey)}>{k}</button>
          {/each}
        </div>
      </div>
      <div>
        <div class="text-sm font-medium">{t('typologies.compare.b','Comparateur — Catégorie B')}</div>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each catKeys as k}
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
              <th class="p-2 border-b border-slate-200 text-left">{t('typologies.compare.criterion','Critère')}</th>
              <th class="p-2 border-b border-slate-200 text-left">{cTitle(compA as CatKey)}</th>
              <th class="p-2 border-b border-slate-200 text-left">{cTitle(compB as CatKey)}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border-b">{t('typologies.labels.orientation','Orientation')}</td><td class="p-2 border-b">{cOrientation(compA as CatKey)}</td><td class="p-2 border-b">{cOrientation(compB as CatKey)}</td></tr>
            <tr><td class="p-2 border-b">{t('typologies.labels.strengths','Points forts')}</td><td class="p-2 border-b">{cStrengths(compA as CatKey)}</td><td class="p-2 border-b">{cStrengths(compB as CatKey)}</td></tr>
            <tr><td class="p-2 border-b">{t('typologies.labels.uses','Usages')}</td><td class="p-2 border-b">{cUse(compA as CatKey)}</td><td class="p-2 border-b">{cUse(compB as CatKey)}</td></tr>
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>

<!-- Conclusion -->
<section class="container-1200 pt-12 pb-16">
  <div class="card">
    <div class="font-semibold">{t('typologies.conclusion.title','Comment choisir ?')}</div>
    <p class="mt-2 text-gray-700">{t('typologies.conclusion.text','Le choix dépend de vos objectifs : formation réglementaire, social learning, montée en compétences, microlearning… Notre expertise consiste à conseiller la meilleure combinaison.')}</p>
    <div class="mt-3">
      <Button href="/contact" variant="primary">{t('typologies.conclusion.cta','Demander un audit plateforme')}</Button>
    </div>
  </div>
</section>
