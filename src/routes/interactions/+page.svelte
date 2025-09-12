<script lang="ts">
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { fireConfetti } from '$lib/utils/confetti';
  import { demo } from '$lib/stores/demo';
  import { t } from '$lib/i18n';
  import MemoryGameDemo from '$lib/components/demos/MemoryGameDemo.svelte';
  import ReactionDemo from '$lib/components/demos/ReactionDemo.svelte';
  import Avatar from '$lib/components/Avatar.svelte';
  import EpiSortDemo from '$lib/components/demos/EpiSortDemo.svelte';
  import TimedCaseDemo from '$lib/components/demos/TimedCaseDemo.svelte';
  import ChecklistDemo from '$lib/components/demos/ChecklistDemo.svelte';

  // Score & progression
  let score = $state(0);
  let quizDone = $state(false);
  let scenarioDone = $state(false);
  let hotspotDone = $state(false);
  let memoryDone = $state(false);
  let reactionDone = $state(false);
  let epiDone = $state(false);
  let timedDone = $state(false);
  let checklistDone = $state(false);
  $effect(() => { if (typeof document !== 'undefined' && progress === 100) { fireConfetti(document.body, 180); demo.award('Parcours 100%'); } });
  const totalChapters = 8;
  const completed = $derived(Number(quizDone) + Number(scenarioDone) + Number(hotspotDone) + Number(memoryDone) + Number(reactionDone) + Number(epiDone) + Number(timedDone) + Number(checklistDone));
  const progress = $derived(Math.round((completed / totalChapters) * 100));

  // Certificate modal
  let certOpen = $state<string | null>(null);
  const mountedAt = Date.now();
  let tQuiz = $state(0); let tScenario = $state(0); let tHot = $state(0);
  let comment = $state('');
  let comments = $state([{author:'Responsable site', text:'Nous appliquons cette règle dans notre site.'},{author:'Manager', text:'Les EPI sont vérifiés en entrée, merci.'}]);

  // Quiz state (3 questions)
  type Q = { q: string; options: { t: string; ok: boolean }[]; picked?: number; };
  let questions = $state<Q[]>([
    { q: 'Un mot de passe doit être…', options: [{ t: 'Partagé avec l’équipe', ok: false }, { t: 'Unique et complexe', ok: true }, { t: 'Collé sur l’écran', ok: false }] },
    { q: 'En cas d’alerte incendie, vous…', options: [{ t: 'Évacuez par l’issue la plus proche', ok: true }, { t: 'Attendez la fin de la réunion', ok: false }, { t: 'Prenez l’ascenseur', ok: false }] },
    { q: 'Phishing : vous recevez un mail suspect', options: [{ t: 'Cliquez et entrez vos codes', ok: false }, { t: 'Le signalez et supprimez', ok: true }, { t: 'Le transférez à tous', ok: false }] }
  ]);
  function pick(i: number, j: number) {
    if (questions[i].picked != null) return; // lock
    questions[i].picked = j;
    if (questions[i].options[j].ok) { score += 1; demo.addScore(1); }
    const all = questions.every((x) => x.picked != null);
    if (all) { quizDone = true; tQuiz = Math.max(1, Math.round((Date.now() - mountedAt)/1000)); demo.addProgress(34); }
  }

  // Scenario state (2 choices -> 2 consequences)
  let scenStep = $state<0 | 1 | 2>(0); // 0 choose, 1 good, 2 bad
  function chooseScenario(good: boolean) {
    scenStep = good ? 1 : 2;
    scenarioDone = true;
    tScenario = Math.max(1, Math.round((Date.now() - mountedAt)/1000));
    if (good) { score += 1; demo.addScore(1); if (typeof document !== 'undefined') fireConfetti(document.body, 120); }
    demo.addProgress(33);
  }

  // Hotspots
  type HP = { label: string; x: number; y: number; found?: boolean };
  let hotspots = $state<HP[]>([
    { label: 'Liquide renversé', x: 18, y: 62 },
    { label: 'Câble au sol', x: 53, y: 70 },
    { label: 'EPI manquant', x: 78, y: 38 }
  ]);
  function toggleHotspot(i: number) {
    hotspots[i].found = true;
    if (hotspots.every((h) => h.found)) { hotspotDone = true; score += 1; demo.addScore(1); tHot = Math.max(1, Math.round((Date.now() - mountedAt)/1000)); demo.addProgress(33); }
  }
</script>

<section class="container-1200 pt-12 md:pt-16 pb-16">
  <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
  <h1>{t('interactions.title','Les interactions de nos plateformes')}</h1>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
    <div class="md:col-span-2 card">
      <div class="flex flex-wrap items-center gap-3">
        <div class="badge">Score: {score} / 5</div>
        <div class="badge">Chapitres: {completed}/{totalChapters}</div>
      </div>
      <div class="mt-3"><ProgressBar value={progress} /></div>
    </div>
    <div class="flex items-center gap-3"></div>
  </div>

  <!-- Chapitre 1 -->
  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div class="card">
      <div class="font-semibold">Chapitre 1 — Capsule vidéo 45s</div>
      <div class="mt-3 aspect-video w-full rounded-lg bg-black/10 grid place-items-center text-gray-700">Vidéo (placeholder)</div>
      <p class="mt-2 text-sm text-gray-700">Sous‑titres activés, transcript disponible.</p>
    </div>
    <div class="card">
      <div class="font-semibold">Quiz (3 questions)</div>
      <ol class="mt-3 space-y-3">
        {#each questions as q, i}
          <li class="border-t first:border-0 border-black/10 pt-3 first:pt-0">
            <div class="font-medium">{q.q}</div>
            <div class="mt-2 flex flex-wrap gap-2">
              {#each q.options as o, j}
                <button class="btn-ghost" onclick={() => pick(i,j)} disabled={q.picked != null} aria-pressed={q.picked===j}>{o.t}</button>
              {/each}
            </div>
            {#if q.picked != null}
              <p class="mt-1 text-sm {q.options[q.picked].ok ? 'text-brand-green' : 'text-red-600'}">{q.options[q.picked].ok ? 'Correct' : 'Réponse incorrecte'}</p>
            {/if}
          </li>
        {/each}
      </ol>
      {#if quizDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Quiz terminé</div>{/if}
    </div>
  </div>

  <!-- Chapitre 2 -->
  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div class="card">
      <div class="font-semibold">Chapitre 2 — Scénario incivilités</div>
      {#if scenStep === 0}
        <p class="mt-2">Un usager devient agressif à l’accueil. Que faites‑vous ?</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button class="btn-primary" onclick={() => chooseScenario(true)}>Adopter une posture calme et alerter</button>
          <button class="btn-ghost" onclick={() => chooseScenario(false)}>Répondre sèchement</button>
        </div>
      {:else if scenStep === 1}
        <div class="mt-3 card">Bonne pratique. Conséquence : désescalade. <span class="text-brand-green font-medium">+1</span></div>
      {:else}
        <div class="mt-3 card">Conséquence : escalade et incident. Revoir la procédure.</div>
      {/if}
    </div>
    <div class="card">
      <div class="font-semibold">Conséquence</div>
      {#if scenStep === 0}
        <div class="mt-3">
          <Avatar expression="neutral" message="Choisissez une option pour voir la suite." size={160} />
        </div>
      {:else if scenStep === 1}
        <div class="mt-3">
          <Avatar expression="happy" message="Bravo ! Vous gardez votre calme, alertez le référent et désamorcez la situation. +1 point." size={160} />
        </div>
      {:else}
        <div class="mt-3">
          <Avatar expression="sad" message="Réponse sèche : l’incident s’aggrave. Revoir la procédure et adopter la posture recommandée." size={160} />
        </div>
      {/if}
      {#if scenarioDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Scénario terminé</div>{/if}
    </div>
  </div>

  <!-- Chapitre 3 -->
  <div class="mt-10 card">
    <div class="font-semibold">Chapitre 3 — Cas pratique (hotspots)</div>
    <div class="mt-4 relative">
      <svg viewBox="0 0 1600 900" class="w-full aspect-[16/9] rounded-xl border border-black/10 bg-white" role="img" aria-label="Atelier: repérez les risques (liquide renversé, câble au sol, EPI manquant)">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#eef7f1"/>
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#eaf5ee"/>
            <stop offset="100%" stop-color="#dff0e7"/>
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#cfe3d8" stroke-width="1" />
          </pattern>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.15" />
          </filter>
        </defs>
        <rect x="0" y="0" width="1600" height="540" fill="url(#bg)" />
        <rect x="0" y="540" width="1600" height="360" fill="url(#floor)" />
        <rect x="0" y="540" width="1600" height="360" fill="url(#grid)" opacity="0.35"/>
        <g filter="url(#shadow)">
          <rect x="80" y="200" width="280" height="280" rx="8" fill="#ffffff"/>
          <rect x="80" y="200" width="280" height="280" fill="none" stroke="#cbd5e1"/>
          <rect x="90" y="230" width="260" height="12" fill="#e2e8f0"/>
          <rect x="90" y="310" width="260" height="12" fill="#e2e8f0"/>
          <rect x="90" y="390" width="260" height="12" fill="#e2e8f0"/>
        </g>
        <g filter="url(#shadow)">
          <rect x="1120" y="520" width="360" height="40" rx="6" fill="#9ca3af"/>
          <rect x="1140" y="400" width="90" height="120" rx="6" fill="#d1d5db"/>
          <rect x="1440" y="400" width="90" height="120" rx="6" fill="#d1d5db"/>
        </g>
        <g transform="translate(1248,342)">
          <circle cx="0" cy="-40" r="28" fill="#fde68a" stroke="#f59e0b"/>
          <rect x="-18" y="-12" width="36" height="60" rx="10" fill="#34d399"/>
          <rect x="-38" y="46" width="76" height="18" rx="9" fill="#374151"/>
          <rect x="-26" y="64" width="16" height="44" rx="8" fill="#6b7280"/>
          <rect x="10" y="64" width="16" height="44" rx="8" fill="#6b7280"/>
          <text x="0" y="-75" text-anchor="middle" font-size="14" fill="#ef4444">EPI manquant</text>
          <line x1="-28" y1="-66" x2="28" y2="-66" stroke="#ef4444" stroke-width="6"/>
        </g>
        <g transform="translate(288,558)">
          <path d="M-90 15 C-60 -10, 40 -10, 70 12 C110 35, 40 60, -30 44 C-70 38,-110 34,-90 15 Z" fill="#60a5fa" opacity="0.85"/>
          <ellipse cx="-20" cy="10" rx="18" ry="6" fill="#93c5fd"/>
        </g>
        <g transform="translate(848,630)">
          <path d="M-260 -10 C-180 30, -80 10, 0 0 S 160 -20, 260 10" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round"/>
          <circle cx="-260" cy="-10" r="10" fill="#111827"/>
          <rect x="250" y="0" width="24" height="10" rx="3" fill="#111827"/>
        </g>
        <g transform="translate(600,260)" filter="url(#shadow)">
          <polygon points="0,0 80,0 40,70" fill="#fcd34d" stroke="#f59e0b"/>
          <line x1="40" y1="18" x2="40" y2="48" stroke="#78350f" stroke-width="6" />
          <circle cx="40" cy="60" r="4" fill="#78350f" />
        </g>
      </svg>
      {#each hotspots as h, i}
        <button class="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green text-white text-xs" style={`left:${h.x}%; top:${h.y}%`} onclick={() => toggleHotspot(i)} aria-label={h.label} aria-pressed={h.found}>✓</button>
      {/each}
      <div class="absolute left-4 bottom-4 card">Identifiez 3 risques/EPI : {hotspots.filter(h=>h.found).length}/3</div>
    </div>
    {#if hotspotDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Cas pratique terminé</div>{/if}
  </div>

  <!-- Chapitre 4 -->
  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div class="card">
      <div class="font-semibold">Chapitre 4 — Mémoire EPI (mini‑jeu)</div>
      <MemoryGameDemo on:memory:done={() => { if (!memoryDone) { memoryDone = true; demo.addProgress(25); } }} />
      {#if memoryDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Mémoire complétée</div>{/if}
    </div>
    <div class="card">
      <div class="font-semibold">Chapitre 5 — Réflexe sécurité</div>
      <ReactionDemo on:reaction:done={() => { if (!reactionDone) { reactionDone = true; demo.addProgress(25); } }} />
      {#if reactionDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Réflexe validé</div>{/if}
    </div>
  </div>

  <!-- Chapitre 6 — Tri EPI (Drag & Drop) -->
  <div class="mt-10 card">
    <div class="font-semibold">Chapitre 6 — Drag & Drop (classer / associer)</div>
    <p class="mt-1 text-sm text-gray-700">Triez les items en “EPI obligatoires” vs “Non EPI”.</p>
    <EpiSortDemo on:sort:done={() => { if (!epiDone) { epiDone = true; demo.addProgress(10); demo.award('Badge EPI triés'); } }} />
    {#if epiDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Tri EPI réussi</div>{/if}
  </div>

  <!-- Chapitre 7 — Étude de cas chronométrée -->
  <div class="mt-10 card">
    <div class="font-semibold">Chapitre 7 — Étude de cas chronométrée</div>
    <p class="mt-1 text-sm text-gray-700">Répondez rapidement sous pression.</p>
    <TimedCaseDemo on:timed:done={() => { if (!timedDone) { timedDone = true; demo.addProgress(10); demo.award('Décideur rapide'); } }} />
    {#if timedDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Étude de cas validée</div>{/if}
  </div>

  <!-- Chapitre 8 — Checklist engageante -->
  <div class="mt-10 card">
    <div class="font-semibold">Chapitre 8 — Checklist engageante</div>
    <ChecklistDemo on:checklist:done={() => { if (!checklistDone) { checklistDone = true; demo.addProgress(10); demo.award('Checklist validée'); } }} />
    {#if checklistDone}<div class="mt-3 badge bg-brand-green/20 text-brand-green">Checklist terminée</div>{/if}
  </div>

  <!-- Mini social learning (mock) -->
  <div class="mt-10 card">
    <div class="font-semibold">Donnez votre avis</div>
    <form class="mt-3 flex flex-col sm:flex-row gap-2" onsubmit={(e) => { e.preventDefault(); if (comment.trim()) { comments = [{author:'Vous', text: comment}, ...comments]; comment=''; } }}>
      <input class="flex-1 rounded-md border border-black/10 p-2" placeholder="Votre commentaire" bind:value={comment} />
      <Button variant="ghost" type="submit">Publier</Button>
    </form>
    <div class="mt-3 space-y-2">
      {#each comments as c}<div class="rounded-md border border-black/10 bg-white px-3 py-2 text-sm"><span class="font-medium">{c.author}</span> — {c.text}</div>{/each}
    </div>
  </div>

  <!-- Finale -->
  <div class="mt-10 card text-center">
    <div class="font-semibold">Finale — Générez votre certificat</div>
    <p class="mt-2 text-sm text-gray-700">Terminez tous les chapitres pour débloquer le certificat animé.</p>
    <div class="mt-4 flex items-center justify-center"><ProgressBar value={progress} /></div>
    <div class="mt-4">
      <Button variant="primary" onclick={() => { if (progress===100) { certOpen='open'; demo.award('Certificat généré'); } }}>
        Générer mon certificat (démo)
      </Button>
      {#if progress < 100}
        <div class="mt-2 text-sm text-gray-700">Complétez le parcours pour activer le bouton.</div>
      {/if}
    </div>
  </div>
</section>

<Modal bind:openKey={certOpen} title="Certificat (démo)" onClose={() => certOpen = null}>
  <div class="text-center">
    <h3 class="text-2xl font-semibold">Attestation de réussite</h3>
    <p class="mt-2">Parcours Sécurité & Sûreté – Complétion: {progress}% | Score: {score}/5</p>
    <p class="mt-1 text-sm text-gray-700">Ce certificat est une démonstration.</p>
  </div>
</Modal>
