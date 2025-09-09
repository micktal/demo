<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { onMount } from 'svelte';
  import { demo } from '$lib/stores/demo';
  import { t } from '$lib/i18n';

  const KEY = 'fpsgDemo';
  function mergeSave(partial: Record<string, any>) {
    try { const existing = JSON.parse(localStorage.getItem(KEY) || '{}'); localStorage.setItem(KEY, JSON.stringify({ ...existing, ...partial })); } catch {}
  }

  // SECTION 3 — Toggle Avant/Après
  let viewAA: 'before' | 'after' = 'before';
  function setAA(v: 'before' | 'after') {
    viewAA = v;
    if (v === 'after') {
      demo.addProgress(5); demo.addScore(3); demo.award('Avant/Après testé');
    }
  }

  // SECTION 5 — Slider visuel avant/après
  let sliderVal = 50;
  let maskWidth = '50%';
  let sliderCompleted = false;
  function onSliderInput() {
    maskWidth = sliderVal + '%';
    if (sliderVal === 100 && !sliderCompleted) {
      sliderCompleted = true;
      demo.addProgress(4); demo.addScore(2); demo.award('Comparateur complété');
    }
  }

  // SECTION 6 — ROI counters
  type Counter = { id: string; from: number; to: number; value: number; done?: boolean };
  let counters: Counter[] = [
    { id: 'c1', from: 0, to: -40, value: 0 },
    { id: 'c2', from: 0, to: 3, value: 0 },
    { id: 'c3', from: 0, to: 100, value: 0 },
    { id: 'c4', from: 10, to: 0, value: 10 }
  ];
  function animateCounter(i: number) {
    const item = counters[i];
    const start = performance.now();
    const dur = 900;
    function step(t: number) {
      const p = Math.min(1, (t - start) / dur);
      item.value = Math.round(item.from + (item.to - item.from) * p);
      if (p < 1) requestAnimationFrame(step);
      else if (!item.done) {
        item.done = true;
        // Only once overall when one completes fully
        if (!counters.some((c, idx) => idx !== i && c.done)) {
          demo.addProgress(6); demo.addScore(4); demo.award('ROI analysé');
        }
      }
    }
    requestAnimationFrame(step);
  }
  let roiHost: HTMLElement | null = null;
  onMount(() => {
    if (roiHost) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            counters.forEach((_, i) => animateCounter(i));
            io.disconnect();
          }
        });
      }, { threshold: 0.6 });
      io.observe(roiHost);
    }
  });

  // SECTION 7 — Calculateur d’économies
  let cPeople = 500; let cSessions = 2; let cCost = 45; let cOut = '';
  function runCalc() {
    const papier = cPeople * cSessions * cCost;
    const digital = papier * 0.6; // -40%
    const gain = papier - digital;
    cOut = `Économie estimée : ~ ${gain.toLocaleString('fr-FR')} € / an`;
    demo.addProgress(6); demo.addScore(5); demo.award('ROI calculé');
    mergeSave({ calc: { people: cPeople, sessions: cSessions, cost: cCost, gain } });
  }
</script>

<svelte:head>
  <title>Comparatif Papier vs Digital Learning – Fiducial FPSG</title>
  <meta name="description" content="Le match papier/digital : interactivité, traçabilité, coûts, engagement. Cas concrets avant/après, ROI et conformité." />
</svelte:head>

<!-- SECTION 1 — HERO (split screen) -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-6">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">{t('comparatif.title','Papier ou Digital : le match est vite plié.')}</h1>
      <p class="mt-4 max-w-2xl">{t('comparatif.subtitle','Le e-learning transforme vos supports en expériences interactives, mesurables et déployables partout.')}</p>
    </div>
    <div class="col-span-12 md:col-span-6">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white">
        <svg viewBox="0 0 800 420" width="100%" height="100%" role="img" aria-label="Comparatif: Papier vs Digital">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#f1fbf6"/></linearGradient>
          </defs>
          <rect x="0" y="0" width="800" height="420" fill="url(#cg)"/>
          <!-- Left: Papier -->
          <rect x="20" y="40" width="360" height="340" rx="16" fill="#ffffff" stroke="#e5e7eb"/>
          <rect x="60" y="80" width="280" height="18" rx="9" fill="#cbd5e1"/>
          <rect x="60" y="110" width="240" height="18" rx="9" fill="#e2e8f0"/>
          <rect x="60" y="140" width="200" height="18" rx="9" fill="#e2e8f0"/>
          <rect x="60" y="180" width="280" height="140" rx="10" fill="#f8fafc" stroke="#e5e7eb"/>
          <text x="200" y="360" text-anchor="middle" font-size="14" fill="#334155">Papier</text>
          <!-- Right: Digital -->
          <rect x="420" y="40" width="360" height="340" rx="16" fill="#ffffff" stroke="#e5e7eb"/>
          <rect x="450" y="70" width="300" height="200" rx="12" fill="#0C6A4C" fill-opacity="0.12" stroke="#cfe3d7"/>
          <circle cx="600" cy="170" r="34" fill="#0C6A4C"/>
          <polygon points="590,152 618,170 590,188" fill="#ffffff"/>
          <rect x="450" y="290" width="160" height="14" rx="7" fill="#cfe3d7"/>
          <rect x="450" y="312" width="120" height="14" rx="7" fill="#cfe3d7"/>
          <text x="600" y="360" text-anchor="middle" font-size="14" fill="#334155">Digital</text>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 2 — TABLEAU COMPARATIF -->
<section class="container-1200 pt-10 md:pt-12">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card>
      <div class="p-4 rounded-xl bg-gray-50 border border-black/10">
        <div class="font-semibold">Papier</div>
        <ul class="mt-3 space-y-2 text-gray-800">
          <li class="flex gap-2"><span aria-hidden>📄</span>Statique et non interactif</li>
          <li class="flex gap-2"><span aria-hidden>❓</span>Pas de traçabilité (qui a lu ? quand ?)</li>
          <li class="flex gap-2"><span aria-hidden>💸</span>Coûts d’impression & logistique</li>
          <li class="flex gap-2"><span aria-hidden>🐢</span>Mises à jour lentes & obsolescence</li>
          <li class="flex gap-2"><span aria-hidden>🌍</span>Monolingue la plupart du temps</li>
          <li class="flex gap-2"><span aria-hidden>📝</span>Évaluations manuelles</li>
          <li class="flex gap-2"><span aria-hidden>🕳️</span>Zéro données pour le pilotage</li>
        </ul>
      </div>
    </Card>
    <Card>
      <div class="p-4 rounded-xl bg-white border border-brand-green/20">
        <div class="font-semibold">Digital</div>
        <ul class="mt-3 space-y-2 text-gray-800">
          <li class="flex gap-2"><span aria-hidden>🎮</span>Interactif (vidéo, quiz, scénarios, drag & drop)</li>
          <li class="flex gap-2"><span aria-hidden>⏱️</span>Traçable (SCORM/xAPI, horodatage, preuves)</li>
          <li class="flex gap-2"><span aria-hidden>⚡</span>Zéro impression, déploiement instantané</li>
          <li class="flex gap-2"><span aria-hidden>🛠️</span>Mise à jour en un clic</li>
          <li class="flex gap-2"><span aria-hidden>🗣️</span>Multilingue, sous-titres & transcripts</li>
          <li class="flex gap-2"><span aria-hidden>✅</span>Feedback immédiat et adaptatif</li>
          <li class="flex gap-2"><span aria-hidden>📊</span>KPI manager & automatisations (relances)</li>
        </ul>
      </div>
    </Card>
  </div>
  <p class="mt-3 text-sm text-gray-700">Note : Les modules digitaux sont accessibles 24/7 sur ordinateur et mobile.</p>
</section>

<!-- SECTION 3 — TOGGLE AVANT / APRÈS -->
<section id="avant-apres" class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4">
    <div class="flex gap-2 items-center flex-wrap mb-3">
      <strong>Affichage :</strong>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" aria-pressed={viewAA==='before'} onclick={() => setAA('before')}>Avant (papier)</button>
      <button class="px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" aria-pressed={viewAA==='after'} onclick={() => setAA('after')}>Après (digital)</button>
    </div>

    {#if viewAA==='before'}
      <div>
        <h3 class="m-0 mb-2">Procédure Incendie – PDF 40 pages</h3>
        <ul class="pl-5 text-gray-700 list-disc">
          <li>Lecture linéaire, peu engageante</li>
          <li>Mise à jour : réimpression et diffusion</li>
          <li>Pas de preuve de lecture ni de score</li>
        </ul>
      </div>
    {:else}
      <div>
        <h3 class="m-0 mb-2">Module Interactif – 3 chapitres</h3>
        <ul class="pl-5 text-brand-green list-disc">
          <li>Vidéo 2 min + quiz in-video</li>
          <li>Scénario ramifié “Que feriez-vous ?”</li>
          <li>Certificat + suivi manager en temps réel</li>
        </ul>
        <p class="mt-2 text-brand-green">✅ Transformation réussie : progression & score augmentent.</p>
      </div>
    {/if}
  </div>
</section>

<!-- SECTION 4 — MINI CAS D’USAGE -->
<section class="container-1200 pt-10">
  <h2>3 exemples concrets qui parlent à vos équipes</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <div class="p-4">
        <div class="text-2xl" aria-hidden>❓➡️🧠</div>
        <div class="font-semibold mt-2">QCM papier → Quiz interactif</div>
        <div class="text-gray-700 mt-1">Feedback immédiat, aléa des questions, temps réel pour le manager.</div>
      </div>
    </Card>
    <Card>
      <div class="p-4">
        <div class="text-2xl" aria-hidden>📄➡️✅</div>
        <div class="font-semibold mt-2">Procédure PDF → Checklist traçable</div>
        <div class="text-gray-700 mt-1">Accusé de lecture horodaté, opposable en audit.</div>
      </div>
    </Card>
    <Card>
      <div class="p-4">
        <div class="text-2xl" aria-hidden>🎤➡️🧭</div>
        <div class="font-semibold mt-2">Brief salle → Scénario ramifié</div>
        <div class="text-gray-700 mt-1">Prise de décision, conséquences visibles, mémorisation forte.</div>
      </div>
    </Card>
  </div>
</section>

<!-- SECTION 5 — SLIDER VISUEL AVANT/APRÈS -->
<section class="container-1200 pt-10">
  <div class="rounded-2xl overflow-hidden border border-black/10 bg-white">
    <div class="relative w-full max-w-full aspect-[16/9] m-auto">
      <img src="https://via.placeholder.com/1280x720?text=AVANT+%28PDF%29" alt="Avant" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 overflow-hidden" style={`width:${maskWidth}`}>
        <img src="https://via.placeholder.com/1280x720?text=APRES+%28Module+Interactif%29" alt="Après" class="absolute inset-0 w-full h-full object-cover" />
      </div>
      <input type="range" min="0" max="100" bind:value={sliderVal} oninput={onSliderInput} class="absolute left-[10%] right-[10%] bottom-3 w-[80%]" />
    </div>
  </div>
</section>

<!-- SECTION 6 — ROI (compteurs animés) -->
<section id="roi" class="container-1200 pt-10">
  <div bind:this={roiHost} class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[720px] mx-auto">
    <div class="p-4 rounded-2xl border border-black/10 bg-white text-center">
      <div class="text-5xl font-extrabold text-brand-green leading-none">{counters[0].value}</div>
      <div class="text-gray-700 mt-1">coûts de formation (%)</div>
    </div>
    <div class="p-4 rounded-2xl border border-black/10 bg-white text-center">
      <div class="text-5xl font-extrabold text-brand-green leading-none">{counters[1].value}</div>
      <div class="text-gray-700 mt-1">engagement apprenants (×)</div>
    </div>
    <div class="p-4 rounded-2xl border border-black/10 bg-white text-center">
      <div class="text-5xl font-extrabold text-brand-green leading-none">{counters[2].value}</div>
      <div class="text-gray-700 mt-1">traçabilité & conformité (%)</div>
    </div>
    <div class="p-4 rounded-2xl border border-black/10 bg-white text-center">
      <div class="text-5xl font-extrabold text-brand-green leading-none">{counters[3].value}</div>
      <div class="text-gray-700 mt-1">impressions papier</div>
    </div>
  </div>
</section>

<!-- SECTION 7 — CALCULATEUR D’ÉCONOMIES -->
<section class="container-1200 pt-10">
  <h2>Estimez vos gains annuels</h2>
  <p class="text-gray-700 mt-1">Entrez vos volumes pour simuler les économies potentielles.</p>
  <div class="rounded-2xl border border-black/10 bg-white p-4 max-w-[860px] mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <label>Nb. apprenants/an<br/><input type="number" min="0" bind:value={cPeople} class="w-full rounded-md border border-black/10 p-2" /></label>
      <label>Sessions/pers/an (papier)<br/><input type="number" min="0" bind:value={cSessions} class="w-full rounded-md border border-black/10 p-2" /></label>
      <label>Coût moyen papier/session (€)<br/><input type="number" min="0" bind:value={cCost} class="w-full rounded-md border border-black/10 p-2" /></label>
    </div>
    <div class="mt-3 flex items-center gap-3">
      <button class="px-3 py-2 rounded-lg border border-brand-green bg-brand-green/10" onclick={runCalc}>Calculer</button>
      <div class="font-semibold text-brand-green">{cOut}</div>
    </div>
  </div>
</section>

<!-- SECTION 8 — CONFORMITÉ & TRAÇABILITÉ -->
<section class="container-1200 pt-10">
  <h2>Opposable et pilotable</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="card"><div class="font-semibold">Traçabilité</div><div class="text-sm text-gray-700 mt-1">horodatage, résultats, preuves AFEST.</div></div>
    <div class="card"><div class="font-semibold">Conformité</div><div class="text-sm text-gray-700 mt-1">accusés de lecture, certificats, relances.</div></div>
    <div class="card"><div class="font-semibold">RGPD</div><div class="text-sm text-gray-700 mt-1">minimisation, purge, gestion des droits.</div></div>
    <div class="card"><div class="font-semibold">Interopérabilité</div><div class="text-sm text-gray-700 mt-1">SCORM/xAPI, SSO, exports CSV/JSON.</div></div>
  </div>
</section>

<!-- SECTION 9 — TÉMOIGNAGE + LOGOS -->
<section class="container-1200 pt-10">
  <div class="card p-6">
    <blockquote>
      <p class="text-lg">“Nous avons divisé par deux nos coûts de formation et gagné en conformité en passant au digital.”</p>
      <footer class="mt-2 text-sm text-gray-700">— Responsable HSE, industrie (témoignage démo)</footer>
    </blockquote>
  </div>
  <div class="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
    <div class="h-10 bg-gray-100 rounded"></div>
    <div class="h-10 bg-gray-100 rounded"></div>
    <div class="h-10 bg-gray-100 rounded"></div>
    <div class="h-10 bg-gray-100 rounded"></div>
    <div class="h-10 bg-gray-100 rounded"></div>
    <div class="h-10 bg-gray-100 rounded"></div>
  </div>
</section>

<!-- SECTION 10 — CTA FINAL -->
<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-semibold">Le papier appartient au passé. Votre avenir est digital.</h2>
      <p class="text-gray-700">Transformons un support critique en 10 jours, multi-langues et traçable.</p>
    </div>
    <div class="flex gap-3"></div>
  </div>
</section>
