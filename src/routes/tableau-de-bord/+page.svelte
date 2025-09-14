<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { demo } from '$lib/stores/demo';
  import { t } from '$lib/i18n';

  const KEY = 'fpsgDemo';
  let kpiProgress = $state(0);
  let kpiScore = $state(0);
  let kpiBadges = $state(0);
  let kpiAfest = $state(0);

  let filterMsg = $state('');

  // FPSG custom section state
  let fpsgProg = $state(0);
  let fpsgScoreNum = $state(0);
  let fpsgBadgesNum = $state(0);
  let fpsgSite: 'all'|'paris'|'lyon'|'toulouse' = $state('all');
  let exportMsg = $state('');
  const fpsgRows = [
    { site:'paris', name:'Durand', progression:75, score:120, badges:3, last:'09/09/2025 10:42' },
    { site:'lyon', name:'Martin', progression:50, score:85, badges:1, last:'08/09/2025 14:17' },
    { site:'toulouse', name:'Lemaire', progression:90, score:160, badges:4, last:'09/09/2025 09:03' }
  ];
  const fpsgFiltered = $derived(fpsgRows.filter(r => fpsgSite==='all' || r.site===fpsgSite));
  function animateFpsg(){
    const pTo=78, sTo=112, bTo=6; const d=900; const t0=performance.now();
    function tick(t:number){ const k=Math.min(1,(t-t0)/d); fpsgProg=Math.round(pTo*k); fpsgScoreNum=Math.round(sTo*k); fpsgBadgesNum=Math.round(bTo*k); if(k<1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }
  function exportCsv2(){
    const header=['Nom','Progression','Score','Badges','Dernière activité'];
    const rows=fpsgFiltered.map(r=>[r.name, r.progression+'%', String(r.score), String(r.badges), r.last]);
    const csv=[header, ...rows].map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='dashboard_demo.csv'; a.click(); exportMsg='✅ Export CSV généré.';
  }

  let chart1: Chart | null = null;
  let chart2: Chart | null = null;
  let chart3: Chart | null = null;

  function readLS() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }

  function refreshKPIs() {
    const s = readLS();
    kpiProgress = Math.round(s.progress || 0);
    kpiScore = Math.round(s.score || 0);
    kpiBadges = (s.badges || []).length;
    kpiAfest = s.validation ? 1 : 0;
  }

  function exportCsvFromTable() {
    const rows = Array.from(document.querySelectorAll('#dash-table tr'))
      .map((r) => Array.from(r.querySelectorAll('th,td')).map((td) => td.textContent || '').join(','))
      .join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'dashboard_demo.csv'; a.click();
  }

  function onFilter(v: string) {
    filterMsg = v === 'all' ? 'Affichage : tous les sites' : 'Affichage filtré : ' + v;
  }

  onMount(() => {
    refreshKPIs();
    animateFpsg();
    const unsub = demo.subscribe(() => refreshKPIs());

    const ctx1 = (document.getElementById('chart-progress') as HTMLCanvasElement | null)?.getContext('2d');
    const ctx2 = (document.getElementById('chart-badges') as HTMLCanvasElement | null)?.getContext('2d');
    const ctx3 = (document.getElementById('chart-compliance') as HTMLCanvasElement | null)?.getContext('2d');

    if (ctx1) {
      chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Durand','Martin','Lemaire','Santos','Kowalski'],
          datasets: [{ label: 'Progression %', data: [75,50,90,60,40], backgroundColor: '#0C6A4C' }]
        },
        options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
      });
    }
    if (ctx2) {
      const s = readLS();
      chart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
          labels: ['Quiz maîtrisé','EPI triés','AFEST validée','ROI analysé'],
          datasets: [{ data: [2,1, (s.validation?1:0), (s.badges||[]).length], backgroundColor: ['#0C6A4C','#16a34a','#f59e0b','#3b82f6'] }]
        },
        options: { responsive: true }
      });
    }
    if (ctx3) {
      chart3 = new Chart(ctx3, {
        type: 'doughnut',
        data: { labels: ['À jour','En retard'], datasets: [{ data: [78,22], backgroundColor: ['#0C6A4C','#ef4444'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
    }

    return () => { unsub(); chart1?.destroy(); chart2?.destroy(); chart3?.destroy(); };
  });
</script>

<svelte:head>
  <title>Tableau de Bord E-learning – Fiducial FPSG</title>
  <meta name="description" content="KPI, progression, scores, badges et conformité : un suivi temps réel, opposable en audit." />
</svelte:head>

<!-- SECTION 1 — HERO -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-7">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">{t('dashboard.title','Pilotez vos formations en temps réel.')}</h1>
      <p class="mt-4 max-w-2xl">{t('dashboard.subtitle','Suivez la progression de vos équipes, les scores, les badges obtenus et exportez vos preuves pour l’audit.')}</p>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white aspect-[16/10]">
        <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dashboard mock: charts and KPIs">
          <rect x="0" y="0" width="800" height="500" fill="#ffffff"/>
          <rect x="24" y="24" width="752" height="452" rx="18" fill="#F6FAF8" stroke="#e5e7eb"/>
          <!-- KPI cards -->
          <g>
            <rect x="48" y="56" width="160" height="80" rx="12" fill="#ffffff" stroke="#e5e7eb"/>
            <text x="68" y="86" font-size="12" fill="#556">Progression</text>
            <text x="68" y="118" font-size="26" fill="#0C6A4C" font-weight="700">78%</text>
            <rect x="224" y="56" width="160" height="80" rx="12" fill="#ffffff" stroke="#e5e7eb"/>
            <text x="244" y="86" font-size="12" fill="#556">Score moyen</text>
            <text x="244" y="118" font-size="26" fill="#0C6A4C" font-weight="700">112</text>
            <rect x="400" y="56" width="160" height="80" rx="12" fill="#ffffff" stroke="#e5e7eb"/>
            <text x="420" y="86" font-size="12" fill="#556">Badges</text>
            <text x="420" y="118" font-size="26" fill="#0C6A4C" font-weight="700">6</text>
          </g>
          <!-- Bar chart -->
          <g>
            <rect x="48" y="168" width="360" height="240" rx="12" fill="#ffffff" stroke="#e5e7eb"/>
            <rect x="78" y="370" width="30" height="30" fill="#0C6A4C"/>
            <rect x="128" y="340" width="30" height="60" fill="#16a34a"/>
            <rect x="178" y="300" width="30" height="100" fill="#22c55e"/>
            <rect x="228" y="330" width="30" height="70" fill="#0ea5e9"/>
            <rect x="278" y="280" width="30" height="120" fill="#f59e0b"/>
          </g>
          <!-- Pie / donut chart -->
          <g>
            <rect x="432" y="168" width="320" height="240" rx="12" fill="#ffffff" stroke="#e5e7eb"/>
            <circle cx="592" cy="288" r="70" fill="#e5e7eb"/>
            <path d="M592 288 L592 218 A70 70 0 0 1 650 320 Z" fill="#0C6A4C"/>
            <path d="M592 288 L650 320 A70 70 0 0 1 540 340 Z" fill="#16a34a"/>
            <path d="M592 288 L540 340 A70 70 0 0 1 592 218 Z" fill="#f59e0b"/>
          </g>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 2 — KPI Cards dynamiques -->
<section id="kpis" class="container-1200 pt-10 md:pt-12">
  <div id="dash-kpis" class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin:24px 0">
    <div class="card text-center"><div class="n text-brand-green font-bold text-2xl mb-1" id="kpi-progress">{kpiProgress}%</div><div>Progression moyenne</div></div>
    <div class="card text-center"><div class="n text-brand-green font-bold text-2xl mb-1" id="kpi-score">{kpiScore} pts</div><div>Score moyen</div></div>
    <div class="card text-center"><div class="n text-brand-green font-bold text-2xl mb-1" id="kpi-badges">{kpiBadges}</div><div>Badges obtenus</div></div>
    <div class="card text-center"><div class="n text-brand-green font-bold text-2xl mb-1" id="kpi-afest">{kpiAfest}</div><div>Missions AFEST validées</div></div>
  </div>
</section>

<!-- VIDEO EXPLICATIVE DASH -->
<section class="container-1200 pt-6 md:pt-8">
  <div class="card p-0 overflow-hidden">
    <video class="w-full h-auto" controls playsinline preload="metadata" poster="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=1200" aria-label="Vidéo d’introduction du dashboard">
      <source src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F7e5565e25d0244758fc990793c5bcb3b?alt=media&token=07edde50-381c-4c0d-879a-4c0e3013ed7a&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec" type="video/mp4" />
      Votre navigateur ne supporte pas la lecture vidéo.
    </video>
  </div>
</section>

<!-- SECTION 3 — Graphiques interactifs -->
<section class="container-1200 pt-4">
  <p class="text-gray-700 mb-3">Visualisez vos données en un clin d’œil.</p>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
    <div class="card p-4"><canvas id="chart-progress" height="220"></canvas></div>
    <div class="card p-4"><canvas id="chart-badges" height="220"></canvas></div>
    <div class="card p-4"><canvas id="chart-compliance" height="220"></canvas></div>
  </div>
</section>

<!-- SECTION 3B — VISUELS / CONTEXTE -->
<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
    <div class="card p-0 overflow-hidden">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F27dea9e56bb24d58b6d88bd9cc287c64?format=webp&width=1200" alt="Saisie de compte‑rendu sur ordinateur portable" class="w-full h-auto" />
      <div class="p-4">
        <div class="font-semibold">Saisie et suivi</div>
        <p class="mt-1 text-gray-700 text-sm">Les apprenants consignent leurs missions et évaluations directement en ligne. Chaque action est horodatée pour une traçabilité simple et exploitable.</p>
      </div>
    </div>
    <div class="card p-0 overflow-hidden">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fc34a3093958c423b8386d6bc8b73dc5d?format=webp&width=1200" alt="Analyse des résultats et point d’équipe" class="w-full h-auto" />
      <div class="p-4">
        <div class="font-semibold">Analyse en équipe</div>
        <p class="mt-1 text-gray-700 text-sm">Les managers pilotent l’avancement par site, accompagnent les stagiaires et partagent des exports clairs lors des points d’équipe ou des audits.</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 4 — Tableau apprenants (mock + export) -->
<section id="table" class="container-1200 pt-10">
  <table id="dash-table" style="width:100%;border-collapse:collapse;margin:24px 0">
    <thead><tr style="background:#f9fafb;text-align:left">
      <th style="padding:8px;border-bottom:1px solid #e5e7eb">Nom</th>
      <th style="padding:8px;border-bottom:1px solid #e5e7eb">Progression</th>
      <th style="padding:8px;border-bottom:1px solid #e5e7eb">Score</th>
      <th style="padding:8px;border-bottom:1px solid #e5e7eb">Badges</th>
      <th style="padding:8px;border-bottom:1px solid #e5e7eb">Dernière activité</th>
    </tr></thead>
    <tbody>
      <tr><td>Durand</td><td>75%</td><td>120</td><td>3</td><td>09/09/2025 10:42</td></tr>
      <tr><td>Martin</td><td>50%</td><td>85</td><td>1</td><td>08/09/2025 14:17</td></tr>
      <tr><td>Lemaire</td><td>90%</td><td>160</td><td>4</td><td>09/09/2025 09:03</td></tr>
    </tbody>
  </table>
  <Button variant="ghost" onclick={exportCsvFromTable}>Exporter CSV</Button>
</section>

<!-- SECTION 5 — Filtres / Segments -->
<section class="container-1200 pt-10">
  <p>Affichez vos données par site ou par rôle.</p>
  <div class="mt-2 flex gap-2 flex-wrap">
    <button class="f-btn px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => onFilter('all')}>Tous les sites</button>
    <button class="f-btn px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => onFilter('paris')}>Paris</button>
    <button class="f-btn px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => onFilter('lyon')}>Lyon</button>
    <button class="f-btn px-3 py-2 rounded-lg border border-black/10 bg-white hover:border-brand-green" onclick={() => onFilter('toulouse')}>Toulouse</button>
  </div>
  <p id="filter-msg" class="text-brand-green mt-2">{filterMsg}</p>
</section>

<!-- SECTION 6 — Bloc conformité -->
<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="card"><div class="font-semibold">Traçabilité horodatée</div></div>
    <div class="card"><div class="font-semibold">Opposable en cas de contrôle</div></div>
    <div class="card"><div class="font-semibold">Export CSV/JSON</div></div>
    <div class="card"><div class="font-semibold">Relances automatiques (email/SMS)</div></div>
  </div>
</section>

<!-- FPSG Custom Dashboard Section -->
<section id="fpsg-dash" style="max-width:1100px;margin:0 auto;padding:16px">
  <header style="margin-bottom:8px">
    <h2 style="margin:0;font:800 28px/1.2 system-ui">Pilotez vos formations en temps réel.</h2>
    <p style="margin:.25rem 0 0;color:#475569">Suivez la progression de vos équipes, les scores, les badges obtenus et exportez vos preuves pour l’audit.</p>
  </header>

  <div id="kpis" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:12px 0">
    <div class="card"><div class="n">{fpsgProg}%</div><div class="l">Progression</div></div>
    <div class="card"><div class="n">{fpsgScoreNum}</div><div class="l">Score moyen</div></div>
    <div class="card"><div class="n">{fpsgBadgesNum}</div><div class="l">Badges</div></div>
    <div class="card small">
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div><div class="s">{kpiProgress}%</div><small>Progression moyenne</small></div>
        <div><div class="s">{kpiScore} pts</div><small>Score moyen</small></div>
        <div><div class="s">{kpiBadges}</div><small>Badges obtenus</small></div>
        <div><div class="s">{kpiAfest}</div><small>Missions AFEST validées</small></div>
      </div>
    </div>
  </div>

  <p style="margin:.25rem 0 12px;color:#0C6A4C">Visualisez vos données en un clin d’œil.</p>

  <div id="filters" style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 12px">
    <button class={`pill ${fpsgSite==='all'?'active':''}`} onclick={() => fpsgSite='all'}>Tous les sites</button>
    <button class={`pill ${fpsgSite==='paris'?'active':''}`} onclick={() => fpsgSite='paris'}>Paris</button>
    <button class={`pill ${fpsgSite==='lyon'?'active':''}`} onclick={() => fpsgSite='lyon'}>Lyon</button>
    <button class={`pill ${fpsgSite==='toulouse'?'active':''}`} onclick={() => fpsgSite='toulouse'}>Toulouse</button>
    <span id="f-msg" style="margin-left:auto;color:#64748b">{fpsgSite==='all' ? 'Affichage : tous les sites' : 'Filtre : '+fpsgSite}</span>
  </div>

  <div class="table-wrap">
    <table id="t" aria-label="Tableau des apprenants">
      <thead><tr>
        <th>Nom</th><th>Progression</th><th>Score</th><th>Badges</th><th>Dernière activité</th>
      </tr></thead>
      <tbody>
        {#each fpsgFiltered as r}
          <tr data-site={r.site}><td>{r.name}</td><td>{r.progression}%</td><td>{r.score}</td><td>{r.badges}</td><td>{r.last}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
    <button id="exportCsv" class="btn" onclick={exportCsv2}>Exporter CSV</button>
    <span style="color:#0C6A4C" id="exp-msg">{exportMsg}</span>
  </div>

  <ul style="margin:16px 0 8px;color:#334155;columns:2;gap:24px;max-width:800px">
    <li>Traçabilité horodatée</li>
    <li>Opposable en cas de contrôle</li>
    <li>Export CSV/JSON</li>
    <li>Relances automatiques (email/SMS)</li>
  </ul>

  <footer style="margin-top:8px">
    <strong>Vos données, en temps réel, opposables en audit.</strong><br/>
    <span>Un tableau de bord simple pour les managers, complet pour les auditeurs.</span>
  </footer>
</section>

<!-- SECTION 7 — CTA final -->
<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <div class="text-xl font-semibold">Vos données, en temps réel, opposables en audit.</div>
      <div class="text-gray-700">Un tableau de bord simple pour les managers, complet pour les auditeurs.</div>
    </div>
    <div class="flex gap-3">
      <Button variant="ghost" onclick={exportCsvFromTable}>Télécharger un exemple d’export</Button>
    </div>
  </div>
</section>
