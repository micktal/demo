<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { demo } from '$lib/stores/demo';

  const KEY = 'fpsgDemo';
  let kpiProgress = $state(0);
  let kpiScore = $state(0);
  let kpiBadges = $state(0);
  let kpiAfest = $state(0);

  let filterMsg = $state('');

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
      <h1>Pilotez vos formations en temps réel.</h1>
      <p class="mt-4 max-w-2xl">Suivez la progression de vos équipes, les scores, les badges obtenus et exportez vos preuves pour l’audit.</p>
      <div class="mt-6 flex gap-3 flex-wrap">
        <Button href="#kpis" variant="primary">Essayer le tableau de bord</Button>
        <Button variant="ghost" onclick={exportCsvFromTable}>Exporter une démo CSV</Button>
      </div>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white aspect-[16/10]"></div>
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

<!-- SECTION 3 — Graphiques interactifs -->
<section class="container-1200 pt-4">
  <p class="text-gray-700 mb-3">Visualisez vos données en un clin d’œil.</p>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
    <div class="card p-4"><canvas id="chart-progress" height="220"></canvas></div>
    <div class="card p-4"><canvas id="chart-badges" height="220"></canvas></div>
    <div class="card p-4"><canvas id="chart-compliance" height="220"></canvas></div>
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

<!-- SECTION 7 — CTA final -->
<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <div class="text-xl font-semibold">Vos données, en temps réel, opposables en audit.</div>
      <div class="text-gray-700">Un tableau de bord simple pour les managers, complet pour les auditeurs.</div>
    </div>
    <div class="flex gap-3">
      <Button href="/contact?from=dashboard-demo" variant="primary">Demander un accès démo</Button>
      <Button variant="ghost" onclick={exportCsvFromTable}>Télécharger un exemple d’export</Button>
    </div>
  </div>
</section>
