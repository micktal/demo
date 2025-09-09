<script lang="ts">
  import KPITile from '$lib/components/KPITile.svelte';
  import Button from '$lib/components/Button.svelte';
  import { onMount } from 'svelte';
  import { demo, level } from '$lib/stores/demo';
  import Chart from 'chart.js/auto';

  type Filter = { period: string; site: string; population: 'agents' | 'manager' | 'all' };
  let filter: Filter = $state({ period: '30j', site: 'Tous', population: 'all' });

  let completion = $state(0);
  let success = $state(0);
  let avgTime = $state(0);
  let incidents = $state(0);

  onMount(() => {
    const unsub = demo.subscribe((d) => {
      completion = Math.round(d.progress ?? 0);
      success = Math.min(100, Math.round(((d.score ?? 0) / 5) * 100));
      // Placeholders computed from progress
      avgTime = Math.round((d.progress ?? 0) / 10); // approx minutes
      incidents = Math.round((d.progress ?? 0) / 50);
    });
    return () => unsub();
  });

  function exportCsv() {
    const rows = [
      ['period','site','population','completion','success','avgTimeMin','incidents'],
      [filter.period, filter.site, filter.population, completion, success, avgTime, incidents]
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tableau-de-bord.csv';
    a.click();
  }
  function relancer() { alert('Relance envoyée (démo)'); }
</script>

<section class="container-1200 pt-12 md:pt-16 pb-16">
  <h1>Tableau de bord Manager (pilotage & traçabilité)</h1>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-end">
    <div class="card">
      <label class="text-sm text-gray-700" for="filter-period">Période</label>
      <select id="filter-period" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={filter.period}>
        <option value="7j">7 jours</option>
        <option value="30j">30 jours</option>
        <option value="90j">90 jours</option>
      </select>
    </div>
    <div class="card">
      <label class="text-sm text-gray-700" for="filter-site">Site</label>
      <select id="filter-site" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={filter.site}>
        <option>Tous</option>
        <option>Paris</option>
        <option>Lyon</option>
        <option>Marseille</option>
      </select>
    </div>
    <div class="card">
      <label class="text-sm text-gray-700" for="filter-population">Population</label>
      <select id="filter-population" class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={filter.population}>
        <option value="all">Tous</option>
        <option value="agents">Agents</option>
        <option value="manager">Manager</option>
      </select>
    </div>
    <div class="flex gap-3">
      <Button variant="ghost" onclick={exportCsv}>Exporter CSV</Button>
      <Button variant="primary" onclick={relancer}>Relancer</Button>
    </div>
  </div>

  <div class="mt-8 grid-12">
    <div class="col-span-12 md:col-span-3"><KPITile label="Taux de complétion global" value={`${completion}%`} sublabel="Mise à jour depuis le parcours" /></div>
    <div class="col-span-12 md:col-span-3"><KPITile label="Réussite moyenne" value={`${success}%`} sublabel="Score moyen" /></div>
    <div class="col-span-12 md:col-span-3"><KPITile label="Temps moyen/chapitre" value={`${avgTime} min`} sublabel="Estimé" /></div>
    <div class="col-span-12 md:col-span-3"><KPITile label="Incidents simulés évités" value={`${incidents}`} sublabel="Démo" /></div>
  </div>

  <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div class="card">
      <div class="font-semibold">Progression</div>
      <canvas id="chartProgress" class="mt-4"></canvas>
    </div>
    <div class="card">
      <div class="font-semibold">Connexions (heatmap)</div>
      <canvas id="chartHeat" class="mt-4"></canvas>
      <p class="mt-2 text-sm text-gray-700">Intensité approximée en fonction de la complétion (démo).</p>
    </div>
  </div>
</section>

<script>
  let chart1: Chart | null = null;
  let chart2: Chart | null = null;
  onMount(() => {
    const ctx1 = (document.getElementById('chartProgress') as HTMLCanvasElement).getContext('2d');
    const ctx2 = (document.getElementById('chartHeat') as HTMLCanvasElement).getContext('2d');
    if (!ctx1 || !ctx2) return;
    chart1 = new Chart(ctx1, {
      type: 'line',
      data: { labels: Array.from({length: 12}, (_,i)=>`S${i+1}`), datasets: [{ label: 'Complétion %', data: Array.from({length:12},()=>completion).map((v,i)=>Math.min(100, Math.max(0, v + (i-6)*2))), borderColor: 'rgb(16,185,129)', fill: false }] },
      options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
    });
    chart2 = new Chart(ctx2, {
      type: 'bar',
      data: { labels: Array.from({length:28},(_,i)=>i+1), datasets: [{ label: 'Connexions', data: Array.from({length:28},(_,i)=> Math.round((completion/10)+ (i%5))), backgroundColor: 'rgba(16,185,129,.5)' }] },
      options: { responsive: true }
    });
    const unsub = demo.subscribe(d => {
      completion = Math.round(d.progress ?? 0);
      success = Math.min(100, Math.round(((d.score ?? 0) / 5) * 100));
      avgTime = Math.round((d.progress ?? 0) / 10);
      incidents = Math.round((d.progress ?? 0) / 50);
      if (chart1) { chart1.data.datasets[0].data = Array.from({length:12},()=>completion).map((v,i)=>Math.min(100, Math.max(0, v + (i-6)*2))); chart1.update(); }
      if (chart2) { chart2.data.datasets[0].data = Array.from({length:28},(_,i)=> Math.round((completion/10)+ (i%5))); chart2.update(); }
    });
    return () => { unsub(); chart1?.destroy(); chart2?.destroy(); };
  });
</script>
