<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { onMount } from 'svelte';
  import Avatar from '$lib/components/Avatar.svelte';

  const KEY = 'fpsgDemo';
  function readS() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function mergeSave(partial: Record<string, any>) { try { const s = readS(); localStorage.setItem(KEY, JSON.stringify({ ...s, ...partial })); } catch {} }
  function awardBadge(b: string) { try { const s = readS(); const badges = Array.isArray(s.badges) ? s.badges : []; if (!badges.includes(b)) { badges.push(b); } mergeSave({ badges }); } catch {} }
  function addProgress(p = 0) { try { const s = readS(); const v = Math.min(100, Math.round((s.progress || 0) + p)); mergeSave({ progress: v }); } catch {} }
  function addScore(sc = 0) { try { const s = readS(); const v = (s.score || 0) + sc; mergeSave({ score: v }); } catch {} }

  // SECTION 2 — TIMELINE PROCESSUS
  type Step = 'analyse'|'bloom'|'raci'|'story'|'prod'|'deploy';
  const copy: Record<Step, string> = {
    analyse:'Recueil besoins, publics, contraintes, risques, objectifs mesurables.',
    bloom:'Transposition des objectifs sur la taxonomie (Se souvenir → Créer).',
    raci:'Rôles clarifiés : qui fait quoi et quand (Responsable, Accountable, Consulté, Informé).',
    story:'Storyboard chapitré, prototype cliquable à votre charte.',
    prod:'Intégrations, médias, accessibilité, QA fonctionnelle & technique.',
    deploy:'SCORM/xAPI, SSO, KPI & tableau de bord, relances automatiques.'
  };
  const badgeMap: Record<Step, string> = { analyse:'Analyse validée', bloom:'Bloom mappée', raci:'RACI cadré', story:'Prototype validé', prod:'QA OK', deploy:'Déployé' };
  let tDesc = '';
  function clickStep(k: Step) {
    tDesc = '✅ ' + copy[k];
    addProgress(5); addScore(3); awardBadge(badgeMap[k]);
  }

  // SECTION 3 — BLOOM Avant/Après
  let bloomView: 'before'|'after' = 'before';
  function setBloom(v: 'before'|'after') {
    bloomView = v;
    if (v === 'after') { addProgress(6); addScore(3); awardBadge('Bloom démontrée'); }
  }

  // SECTION 4 — RACI bonus
  let raciFb = '';
  onMount(() => { addProgress(3); addScore(2); awardBadge('RACI compris'); raciFb = 'Gouvernance clarifiée (RACI).'; refreshLeaderboard(); refreshBadges(); refreshStreakFromStore(); });

  // SECTION 5 — Avant/Après slider
  let aaVal = 50; let aaWidth = '50%'; let aaDone = false;
  function onRange(input: number) {
    aaVal = input; aaWidth = input + '%';
    if (!aaDone && input === 100) { aaDone = true; addProgress(5); addScore(3); awardBadge('Transformation comparée'); }
  }

  // Voice-over (synthèse vocale)
  let speaking = false;
  const voText = 'Exemple de voice-over: vous interagissez avec le module, répondez aux questions et progressez.';
  function toggleVoice() {
    try {
      const synth: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
      if (!synth) { alert('Synthèse vocale non disponible sur ce navigateur.'); return; }
      if (speaking) { synth.cancel(); speaking = false; return; }
      const u = new SpeechSynthesisUtterance(voText);
      u.lang = 'fr-FR'; u.rate = 1; u.pitch = 1; u.onend = () => { speaking = false; };
      speaking = true; synth.speak(u); addProgress(2); addScore(1); awardBadge('Voice-over testé');
    } catch {}
  }

  // Mini-quiz Avant/Après
  let aaPicked: number | null = null;
  const aaOptions = [
    { t: 'Lecture passive du PDF', ok: false },
    { t: 'Interactions + feedback immédiat', ok: true }
  ];
  function aaPick(j: number) {
    if (aaPicked != null) return;
    aaPicked = j; if (aaOptions[j].ok) { addProgress(3); addScore(2); awardBadge('Mini-quiz Avant/Après'); }
  }

  // ROI Calculator
  let learners = 200; let hoursSaved = 1.5; let costPerHour = 35; let travelPerLearner = 20; let projectCost = 5000;
  $: savingsTime = Math.max(0, Math.round(learners * hoursSaved * costPerHour));
  $: savingsTravel = Math.max(0, Math.round(learners * travelPerLearner));
  $: totalSavings = savingsTime + savingsTravel;
  $: roiPct = projectCost > 0 ? Math.round(((totalSavings - projectCost) / projectCost) * 100) : 0;
  function markRoiUsed() { addProgress(4); addScore(2); awardBadge('ROI estimé'); }

  // Calendrier atelier (.ics)
  let calDate = '';
  let calTime = '10:00';
  let calDur = 60; // minutes
  let calTopic = 'Atelier de cadrage e-learning';
  function pad(n: number) { return (n < 10 ? '0' : '') + n; }
  function toIcsDate(dateStr: string, timeStr: string, durMin: number) {
    const [y, m, d] = dateStr.split('-').map((x) => +x);
    const [hh, mm] = timeStr.split(':').map((x) => +x);
    const start = new Date(y, (m - 1), d, hh, mm);
    const end = new Date(start.getTime() + durMin * 60000);
    const fmt = (dt: Date) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    return { dtstart: fmt(start), dtend: fmt(end) };
  }
  function downloadICS() {
    if (!calDate) { alert('Choisissez une date.'); return; }
    const { dtstart, dtend } = toIcsDate(calDate, calTime, calDur);
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Fiducial FPSG//Processus//FR',
      'BEGIN:VEVENT',`UID:${Date.now()}@fpsg`,`DTSTAMP:${toIcsDate(calDate, calTime, 0).dtstart}Z`,
      `DTSTART:${dtstart}`,`DTEND:${dtend}`,`SUMMARY:${calTopic}`,
      'DESCRIPTION:Atelier de cadrage avec l\'équipe pédagogique.','END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'atelier_cadrage.ics'; a.click();
    addProgress(4); addScore(2); awardBadge('Atelier planifié');
  }
  // Gamif/social state
  type LBRow = { name: string; points: number };
  let leaderboard: LBRow[] = [];
  function refreshLeaderboard(){
    const s = readS();
    const me = { name: 'Vous', points: Math.max(0, Math.round(s.score || 0)) };
    const others: LBRow[] = [
      { name: 'Amina', points: 120 },
      { name: 'Léo', points: 95 },
      { name: 'Sophie', points: 82 },
      { name: 'Marco', points: 76 }
    ];
    leaderboard = [...others, me].sort((a,b)=>b.points-a.points).slice(0,5);
  }
  let publicBadges: string[] = [];
  function refreshBadges(){ const s = readS(); publicBadges = Array.isArray(s.badges) ? s.badges : []; }

  // Streaks
  let streakDays = 0; let lastStreakDate = '';
  function ymd(d: Date){ return d.toISOString().slice(0,10); }
  function refreshStreakFromStore(){ try { const s = readS(); const st = s.streak || {}; streakDays = st.days || 0; lastStreakDate = st.last || ''; } catch {} }
  function markStreak(){
    const today = ymd(new Date());
    const s = readS(); const st = s.streak || {}; const last = st.last || '';
    const yesterday = ymd(new Date(Date.now() - 24*3600*1000));
    let days = st.days || 0;
    if (last === today) { /* already marked */ }
    else if (last === yesterday) { days = days + 1; }
    else { days = 1; }
    mergeSave({ streak: { days, last: today } }); streakDays = days; lastStreakDate = today; addProgress(2); addScore(1); awardBadge('Streak'); refreshLeaderboard(); refreshBadges();
  }
</script>

<svelte:head>
  <title>Processus e-learning : andragogie, Bloom, RACI & GANTT – Fiducial FPSG</title>
  <meta name="description" content="Du PDF à la compétence : analyse andragogique, taxonomie de Bloom, RACI, GANTT, prototypage et livraison SCORM/xAPI." />
</svelte:head>

<!-- SECTION 1 — HERO -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-6">
      <h1>Du PDF à la compétence acquise.</h1>
      <p class="mt-3 max-w-2xl">Analyse andragogique, taxonomie de Bloom, gouvernance RACI et GANTT : un processus rigoureux, une expérience engageante.</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <a href="#timeline" class="btn-primary">Voir les étapes</a>
        <a href="#avant-apres" class="btn-ghost">Comparer Avant/Après</a>
      </div>
    </div>
    <div class="col-span-12 md:col-span-6">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white p-4">
        <div class="grid grid-cols-2 gap-2">
          <div class="aspect-video rounded-lg bg-gray-200 grid place-items-center text-gray-600">PDF statique</div>
          <div class="aspect-video rounded-lg bg-brand-green/20 grid place-items-center text-brand-green">Module interactif</div>
        </div>
        <div class="mt-3">
          <svg viewBox="0 0 800 80" class="w-full h-auto" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0C6A4C"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs><line x1="40" y1="40" x2="760" y2="40" stroke="url(#lg)" stroke-width="6" stroke-linecap="round"/>{#each [40,180,320,460,600,760] as x}<circle cx={x} cy="40" r="10" fill="#fff" stroke="#0C6A4C" stroke-width="3" />{/each}</svg>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 2 — TIMELINE PROCESSUS -->
<section id="timeline" class="container-1200 pt-10 md:pt-12">
  <div id="proc-timeline" class="rounded-2xl border border-black/10 bg-white p-4">
    <h3 class="m-0">Notre processus en 6 étapes</h3>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
      <button class="t-step" data-k="analyse" onclick={() => clickStep('analyse')}>1. Analyse andragogique</button>
      <button class="t-step" data-k="bloom" onclick={() => clickStep('bloom')}>2. Mapping Bloom</button>
      <button class="t-step" data-k="raci" onclick={() => clickStep('raci')}>3. Cadrage RACI</button>
      <button class="t-step" data-k="story" onclick={() => clickStep('story')}>4. Storyboard & prototype</button>
      <button class="t-step" data-k="prod" onclick={() => clickStep('prod')}>5. Production & QA</button>
      <button class="t-step" data-k="deploy" onclick={() => clickStep('deploy')}>6. Déploiement & KPI</button>
    </div>
    <div id="t-desc" class="mt-3 text-brand-green">{tDesc}</div>
  </div>
  <style>
    #proc-timeline .t-step{padding:10px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;cursor:pointer;text-align:left}
    #proc-timeline .t-step:hover{border-color:#0C6A4C;color:#0C6A4C}
  </style>
</section>

<!-- SECTION 3 — ANDRAGOGIE + BLOOM -->
<section class="container-1200 pt-10">
  <div id="bloom-card" class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="flex gap-2 flex-wrap mb-2">
      <button class="b-btn" data-v="before" onclick={() => setBloom('before')}>Avant (PDF)</button>
      <button class="b-btn" data-v="after" onclick={() => setBloom('after')}>Après (e-learning)</button>
    </div>
    {#if bloomView==='before'}
      <div id="b-before">
        <h3 class="m-0">Avant — niveaux 1–2</h3>
        <ul class="text-gray-600 list-disc pl-5 mt-2"><li><strong>Se souvenir</strong> : lecture passive, liste de consignes</li><li><strong>Comprendre</strong> : reformulation théorique</li><li>Faible engagement, pas de preuves</li></ul>
      </div>
    {:else}
      <div id="b-after">
        <h3 class="m-0">Après — niveaux 3–5 (→6)</h3>
        <ul class="text-brand-green list-disc pl-5 mt-2"><li><strong>Appliquer</strong> : quiz, checklists traçables, AFEST</li><li><strong>Analyser</strong> : scénarios à embranchements</li><li><strong>Évaluer</strong> : décisions argument��es, feedback</li><li><em>Créer</em> : RETEX, plan d’action</li></ul>
        <p class="mt-2 text-brand-green">✅Progression cognitive mesurable (Bloom).</p>
      </div>
    {/if}
  </div>
  <style>
    #bloom-card .b-btn{padding:8px 12px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;cursor:pointer}
    #bloom-card .b-btn:hover{border-color:#0C6A4C;color:#0C6A4C}
  </style>
</section>

<!-- SECTION 4 — MATRICE RACI -->
<section class="container-1200 pt-10">
  <div id="raci" class="rounded-2xl border border-black/10 bg-white p-4 overflow-auto">
    <table class="w-full" style="border-collapse:collapse;min-width:680px">
      <thead>
        <tr class="bg-slate-50">
          <th class="p-2 border-b border-slate-200 text-left">Livrable / Étape</th>
          <th class="p-2 border-b border-slate-200 text-left">Ingé Pédago</th>
          <th class="p-2 border-b border-slate-200 text-left">Chef de Projet</th>
          <th class="p-2 border-b border-slate-200 text-left">Expert Métier</th>
          <th class="p-2 border-b border-slate-200 text-left">Client RH/QHSE</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="p-2 border-b">Analyse & objectifs</td><td class="p-2 border-b">R</td><td class="p-2 border-b">A</td><td class="p-2 border-b">C</td><td class="p-2 border-b">I</td></tr>
        <tr><td class="p-2 border-b">Storyboard</td><td class="p-2 border-b">R</td><td class="p-2 border-b">A</td><td class="p-2 border-b">C</td><td class="p-2 border-b">I</td></tr>
        <tr><td class="p-2 border-b">Prototype</td><td class="p-2 border-b">R</td><td class="p-2 border-b">A</td><td class="p-2 border-b">C</td><td class="p-2 border-b">I</td></tr>
        <tr><td class="p-2 border-b">Production</td><td class="p-2 border-b">C</td><td class="p-2 border-b">A</td><td class="p-2 border-b">R</td><td class="p-2 border-b">I</td></tr>
        <tr><td class="p-2 border-b">QA & accessibilité</td><td class="p-2 border-b">C</td><td class="p-2 border-b">A</td><td class="p-2 border-b">I</td><td class="p-2 border-b">R</td></tr>
        <tr><td class="p-2 border-b">Déploiement & KPI</td><td class="p-2 border-b">I</td><td class="p-2 border-b">A</td><td class="p-2 border-b">C</td><td class="p-2 border-b">R</td></tr>
      </tbody>
    </table>
    <p class="mt-2 text-brand-green" id="raci-fb">{raciFb}</p>
  </div>
</section>

<!-- SECTION 5 — AVANT / APRÈS -->
<section id="avant-apres" class="container-1200 pt-10">
  <div id="aa" class="rounded-2xl border border-black/10 bg-white p-4">
    <h3 class="m-0 mb-2">Avant / Après : du PDF à l’expérience</h3>
    <div class="relative w-full" style="max-width:100%">
      <div class="rounded-lg overflow-hidden border border-slate-200" style="position:relative;max-width:100%;aspect-ratio:16/9;background:#fff">
        <svg viewBox="0 0 1600 900" class="absolute inset-0 w-full h-full" role="img" aria-label="Avant: PDF statique">
          <defs>
            <linearGradient id="pdfbg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f8fafc"/>
              <stop offset="100%" stop-color="#eef2f7"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1600" height="900" fill="url(#pdfbg)"/>
          <g>
            <rect x="280" y="90" width="1040" height="720" rx="16" fill="#e5e7eb" stroke="#cbd5e1"/>
            <rect x="320" y="140" width="960" height="24" fill="#d1d5db"/>
            {#each Array(10) as _, i}
              <rect x="320" y={190 + i*52} width={i%2? 720: 880} height="14" fill="#d1d5db" opacity="0.9"/>
            {/each}
            <rect x="320" y="720" width="420" height="18" fill="#d1d5db"/>
            <rect x="860" y="720" width="280" height="18" fill="#d1d5db"/>
            <g transform="translate(320,140)">
              <rect x="-200" y="-40" width="160" height="60" rx="8" fill="#9ca3af"/>
              <text x="-120" y="-5" text-anchor="middle" font-size="22" fill="#111827">PDF</text>
            </g>
          </g>
        </svg>
        <div id="aa-mask" style={`position:absolute;inset:0;width:${aaWidth};overflow:hidden`}>
          <svg viewBox="0 0 1600 900" class="w-full h-full" role="img" aria-label="Après: module interactif">
            <defs>
              <linearGradient id="modbg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f0fdf4"/>
                <stop offset="100%" stop-color="#dcfce7"/>
              </linearGradient>
              <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0C6A4C"/>
                <stop offset="100%" stop-color="#16a34a"/>
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.12" />
              </filter>
            </defs>
            <rect x="0" y="0" width="1600" height="900" fill="url(#modbg)"/>
            <g filter="url(#soft)">
              <rect x="220" y="120" width="1160" height="80" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
              <rect x="240" y="150" width="280" height="20" rx="10" fill="#0C6A4C" opacity="0.15"/>
              <rect x="540" y="150" width="180" height="20" rx="10" fill="#0C6A4C" opacity="0.15"/>
              <rect x="740" y="150" width="120" height="20" rx="10" fill="#0C6A4C" opacity="0.15"/>
            </g>
            <g filter="url(#soft)">
              <rect x="220" y="240" width="540" height="300" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
              <circle cx="350" cy="370" r="60" fill="#0C6A4C" opacity="0.15"/>
              <polygon points="330,350 410,390 330,430" fill="#0C6A4C"/>
              <rect x="260" y="480" width="400" height="16" rx="8" fill="#e5e7eb"/>
              <rect x="260" y="510" width="220" height="16" rx="8" fill="#e5e7eb"/>
            </g>
            <g filter="url(#soft)">
              <rect x="800" y="240" width="580" height="300" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
              <rect x="840" y="280" width="500" height="16" rx="8" fill="#e5e7eb"/>
              <rect x="840" y="310" width="360" height="16" rx="8" fill="#e5e7eb"/>
              <rect x="840" y="360" width="520" height="14" rx="7" fill="#e5e7eb"/>
              <rect x="840" y="420" width="420" height="10" rx="5" fill="#e5e7eb"/>
              <rect x="840" y="450" width="520" height="10" rx="5" fill="#e5e7eb"/>
              <rect x="840" y="480" width="280" height="10" rx="5" fill="#e5e7eb"/>
            </g>
            <g>
              <rect x="220" y="580" width="1160" height="18" rx="9" fill="#e5e7eb"/>
              <rect x="220" y="580" width="560" height="18" rx="9" fill="url(#bar)"/>
            </g>
            <g filter="url(#soft)">
              <rect x="220" y="620" width="320" height="64" rx="12" fill="#0C6A4C"/>
              <text x="380" y="660" text-anchor="middle" font-size="24" fill="#ffffff">Démarrer</text>
              <rect x="560" y="620" width="220" height="64" rx="12" fill="#f0fdf4" stroke="#0C6A4C"/>
              <text x="670" y="660" text-anchor="middle" font-size="22" fill="#0C6A4C">Voir le quiz</text>
            </g>
            <g opacity="0.9">
              <circle cx="1280" cy="560" r="16" fill="#0C6A4C"/>
              <circle cx="1320" cy="600" r="16" fill="#0C6A4C"/>
              <circle cx="1360" cy="560" r="16" fill="#0C6A4C"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <input id="aa-range" type="range" min="0" max="100" bind:value={aaVal} oninput={(e:any)=>onRange(+e.currentTarget.value)} class="w-full mt-3" />
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <div class="rounded-lg border border-black/10 bg-white p-3">
        <div class="flex items-center justify-between gap-3">
          <div class="font-medium">Voice‑over</div>
          <button class="btn-ghost" onclick={toggleVoice} aria-pressed={speaking}>{speaking ? 'Arrêter' : 'Écouter'}</button>
        </div>
        <p class="mt-2 text-sm text-gray-700">Synthèse vocale intégrée (démo).</p>
      </div>
      <div class="rounded-lg border border-black/10 bg-white p-3">
        <div class="font-medium">Mini‑quiz</div>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each aaOptions as o, j}
            <button class="btn-ghost" onclick={() => aaPick(j)} disabled={aaPicked != null} aria-pressed={aaPicked===j}>{o.t}</button>
          {/each}
        </div>
        {#if aaPicked != null}
          <p class="mt-2 text-sm {aaOptions[aaPicked].ok ? 'text-brand-green' : 'text-red-600'}">{aaOptions[aaPicked].ok ? 'Correct' : 'Réponse incorrecte'}</p>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- SECTION 6 — MINI GANTT -->
<section class="container-1200 pt-10">
  <div id="gantt" class="rounded-2xl border border-black/10 bg-white p-4">
    <h3 class="m-0">Planning indicatif</h3>
    <div class="grid" style="grid-template-columns:140px 1fr;gap:10px">
      <div>Analyse</div><div><div class="bar" style="width:20%"></div></div>
      <div>Storyboard</div><div><div class="bar" style="width:35%"></div></div>
      <div>Prototype</div><div><div class="bar" style="width:55%"></div></div>
      <div>Production</div><div><div class="bar" style="width:80%"></div></div>
      <div>QA & Déploiement</div><div><div class="bar" style="width:100%"></div></div>
    </div>
  </div>
  <style>
    #gantt .bar{height:12px;background:#0C6A4C;border-radius:999px}
  </style>
</section>

<!-- SECTION 6b — CALCULATEUR ROI -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <h3 class="m-0">Calculateur ROI (démo)</h3>
    <div class="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
      <label class="block">Apprenants
        <input type="number" min="1" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={learners} onchange={markRoiUsed} />
      </label>
      <label class="block">Heures gagnées / apprenant
        <input type="number" step="0.1" min="0" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={hoursSaved} onchange={markRoiUsed} />
      </label>
      <label class="block">Coût horaire (€)
        <input type="number" min="0" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={costPerHour} onchange={markRoiUsed} />
      </label>
      <label class="block">Frais déplacement / apprenant (€)
        <input type="number" min="0" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={travelPerLearner} onchange={markRoiUsed} />
      </label>
      <label class="block">Coût projet (€)
        <input type="number" min="0" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={projectCost} onchange={markRoiUsed} />
      </label>
    </div>
    <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <div class="card text-center"><div class="text-xl font-semibold text-brand-green">{savingsTime.toLocaleString()} €</div><div class="text-xs text-gray-600">Gain temps</div></div>
      <div class="card text-center"><div class="text-xl font-semibold text-brand-green">{savingsTravel.toLocaleString()} €</div><div class="text-xs text-gray-600">Frais évités</div></div>
      <div class="card text-center"><div class="text-xl font-semibold text-brand-green">{totalSavings.toLocaleString()} €</div><div class="text-xs text-gray-600">Gains totaux</div></div>
      <div class="card text-center"><div class="text-xl font-semibold {roiPct>=0?'text-brand-green':'text-red-600'}">{roiPct}%</div><div class="text-xs text-gray-600">ROI estimé</div></div>
    </div>
  </div>
</section>

<!-- SECTION 6c — CALENDRIER ATELIER INTÉGRÉ -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <h3 class="m-0">Planifier un atelier</h3>
    <div class="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <label class="block">Date
        <input type="date" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={calDate} />
      </label>
      <label class="block">Heure
        <input type="time" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={calTime} />
      </label>
      <label class="block">Durée (min)
        <input type="number" min="15" step="15" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={calDur} />
      </label>
      <label class="block">Sujet
        <input type="text" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={calTopic} />
      </label>
    </div>
    <div class="mt-3 flex flex-wrap gap-3">
      <button class="btn-primary" onclick={downloadICS}>Ajouter au calendrier (.ics)</button>
      <a class="btn-ghost" href="/contact" target="_blank" rel="noopener">Demander ce créneau</a>
    </div>
  </div>
</section>

<!-- SECTION 7 — QA, ACCESSIBILITÉ & CONFORMITÉ -->
<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card><div class="p-4"><div class="font-semibold">Accessibilité</div><ul class="mt-2 list-disc pl-5 text-gray-700"><li>Contraste, clavier, ARIA</li><li>Sous‑titres & transcripts</li></ul></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Tech</div><ul class="mt-2 list-disc pl-5 text-gray-700"><li>SCORM/xAPI</li><li>SSO (Azure/Okta)</li><li>Hébergement UE</li></ul></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Opposabilité</div><ul class="mt-2 list-disc pl-5 text-gray-700"><li>Logs / horodatage</li><li>Preuves AFEST</li><li>Certificats</li></ul></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Sécurité</div><ul class="mt-2 list-disc pl-5 text-gray-700"><li>RGPD, purge</li><li>Droits d’accès</li></ul></div></Card>
  </div>
</section>

<!-- SECTION 8 — LIVRAISON & KPI -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="font-semibold">Livraison & KPI</div>
    <p class="mt-2 text-gray-700">Export SCORM/xAPI, intégrations RH/LMS, dashboards KPI, relances automatiques.</p>
    <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="card text-center"><div class="text-2xl font-semibold text-brand-green">98%</div><div class="text-xs text-gray-600">Taux de complétion</div></div>
      <div class="card text-center"><div class="text-2xl font-semibold text-brand-green">+37%</div><div class="text-xs text-gray-600">Engagement</div></div>
      <div class="card text-center"><div class="text-2xl font-semibold text-brand-green">24h</div><div class="text-xs text-gray-600">Déploiement</div></div>
      <div class="card text-center"><div class="text-2xl font-semibold text-brand-green">0</div><div class="text-xs text-gray-600">Incidents majeurs</div></div>
    </div>
  </div>
</section>

<!-- SECTION 8b — Gamification & Social -->
<section class="container-1200 pt-10">
  <h3 class="m-0 mb-3">Gamification & Social</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
    <div class="rounded-2xl border border-black/10 bg-white p-4">
      <div class="font-semibold">Profil</div>
      <div class="mt-3 flex items-center gap-3">
        <Avatar expression="happy" size={72} />
        <div>
          <div class="font-medium">Apprenant Démo</div>
          <div class="text-sm text-gray-700">Streak: {streakDays} jour(s)</div>
        </div>
      </div>
      <button class="btn-ghost mt-3" onclick={markStreak}>Je me connecte aujourd’hui</button>
    </div>

    <div class="rounded-2xl border border-black/10 bg-white p-4">
      <div class="font-semibold">Classement</div>
      <ol class="mt-2 space-y-1">
        {#each leaderboard as row, i}
          <li class="flex justify-between"><span>{i+1}. {row.name}</span><strong>{row.points}</strong></li>
        {/each}
      </ol>
    </div>

    <div class="rounded-2xl border border-black/10 bg-white p-4">
      <div class="font-semibold">Badges publics</div>
      <div class="mt-2 flex flex-wrap gap-2">
        {#if publicBadges.length === 0}
          <span class="text-sm text-gray-600">Aucun badge pour le moment.</span>
        {:else}
          {#each publicBadges as b}<span class="badge">{b}</span>{/each}
        {/if}
      </div>
    </div>

    <div class="rounded-2xl border border-black/10 bg-white p-4">
      <div class="font-semibold">Témoignages vidéo</div>
      <div class="mt-2 space-y-2">
        <div class="aspect-video rounded-lg overflow-hidden border border-black/10">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Témoignage 1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="aspect-video rounded-lg overflow-hidden border border-black/10">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/oHg5SJYRHA0" title="Témoignage 2" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 8c — Cas clients & Templates -->
<section class="container-1200 pt-10">
  <h3 class="m-0 mb-3">Cas clients sectoriels & templates</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="card">
      <div class="font-semibold">Industrie</div>
      <p class="mt-1 text-sm text-gray-700">Procédures sécurité, EPI, audits.</p>
      <div class="mt-2 flex gap-2">
        <a class="btn-ghost" href="/templates/raci-template.csv" download>RACI .csv</a>
        <a class="btn-ghost" href="/templates/gantt-template.csv" download>GANTT .csv</a>
      </div>
    </div>
    <div class="card">
      <div class="font-semibold">Retail</div>
      <p class="mt-1 text-sm text-gray-700">Accueil client, sûreté, inventaires.</p>
      <div class="mt-2 flex gap-2">
        <a class="btn-ghost" href="/templates/raci-template.csv" download>RACI .csv</a>
        <a class="btn-ghost" href="/templates/gantt-template.csv" download>GANTT .csv</a>
      </div>
    </div>
    <div class="card">
      <div class="font-semibold">Services</div>
      <p class="mt-1 text-sm text-gray-700">AFEST, conformité, qualité.</p>
      <div class="mt-2 flex gap-2">
        <a class="btn-ghost" href="/templates/raci-template.csv" download>RACI .csv</a>
        <a class="btn-ghost" href="/templates/gantt-template.csv" download>GANTT .csv</a>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 9 — CTA FINAL -->
<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <div class="text-xl font-semibold">Confiez-nous vos PDF, obtenez des parcours engageants & auditables.</div>
    </div>
    <div class="flex gap-3">
      <Button href="/contact" variant="primary">Planifier un atelier de cadrage</Button>
      <Button href="/roi-temoignages" variant="ghost">Voir un cas client sectoriel</Button>
    </div>
  </div>
</section>
