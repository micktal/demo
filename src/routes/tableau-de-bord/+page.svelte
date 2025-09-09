<script lang="ts">
  import KPITile from '$lib/components/KPITile.svelte';
  import Button from '$lib/components/Button.svelte';
  import { onMount } from 'svelte';
  import { readDemo } from '$lib/utils/demoStorage';

  type Filter = { period: string; site: string; population: 'agents' | 'manager' | 'all' };
  let filter: Filter = $state({ period: '30j', site: 'Tous', population: 'all' });

  let completion = $state(0);
  let success = $state(0);
  let avgTime = $state(0);
  let incidents = $state(0);

  function load() {
    const d = readDemo();
    completion = Math.round(d.completion ?? 0);
    success = Math.round(d.success ?? 0);
    avgTime = d.avgTimeMin ?? 0;
    incidents = d.incidentsPrevented ?? 0;
  }
  onMount(() => {
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === 'fpsgDemo') load(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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
      <label class="text-sm text-gray-700">Période</label>
      <select class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={filter.period}>
        <option value="7j">7 jours</option>
        <option value="30j">30 jours</option>
        <option value="90j">90 jours</option>
      </select>
    </div>
    <div class="card">
      <label class="text-sm text-gray-700">Site</label>
      <select class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={filter.site}>
        <option>Tous</option>
        <option>Paris</option>
        <option>Lyon</option>
        <option>Marseille</option>
      </select>
    </div>
    <div class="card">
      <label class="text-sm text-gray-700">Population</label>
      <select class="mt-1 w-full rounded-md border border-black/10 p-2" bind:value={filter.population}>
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
      <div class="mt-4 h-40 rounded-lg bg-gradient-to-b from-brand-green/10 to-white relative overflow-hidden">
        <div class="absolute left-0 bottom-6 h-2 bg-brand-green" style={`width:${completion}%`}></div>
      </div>
    </div>
    <div class="card">
      <div class="font-semibold">Heatmap connexions</div>
      <div class="mt-4 grid grid-cols-7 gap-2">
        {#each Array(28) as _, i}
          {#const inten = (i*7 % 100) < completion ? 'bg-brand-green/70' : 'bg-brand-green/20'}
          <div class={`h-8 rounded ${inten}`}></div>
        {/each}
      </div>
      <p class="mt-2 text-sm text-gray-700">Intensité approximée en fonction de la complétion (démo).</p>
    </div>
  </div>
</section>
