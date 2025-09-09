<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { demo } from '$lib/stores/demo';

  const KEY = 'fpsgDemo';
  function mergeSave(partial: Record<string, any>) {
    try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); localStorage.setItem(KEY, JSON.stringify({ ...s, ...partial })); } catch {}
  }

  // HUB interactive
  let hubInfo = $state('');
  function hubSet(info: string) { hubInfo = info; }

  // Export demo
  function download(content: string, name: string, type: string) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  }
  function onExportCSV() {
    const s = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })();
    const csv = `progress,score,badges\n${s.progress || 0},${s.score || 0},"${(s.badges || []).join('|')}"`;
    download(csv, 'export_demo.csv', 'text/csv');
    demo.addProgress(5); demo.addScore(3); demo.award('Export RH testé');
    mergeSave({});
    hubInfo = '✅ Export CSV généré.';
  }
  function onExportJSON() {
    const s = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })();
    download(JSON.stringify(s, null, 2), 'export_demo.json', 'application/json');
    demo.addProgress(5); demo.addScore(3); demo.award('Export RH testé');
    mergeSave({});
    hubInfo = '✅ Export JSON généré.';
  }
</script>

<svelte:head>
  <title>Intégrations RH, LMS, SSO & API – Fiducial FPSG</title>
  <meta name="description" content="SSO, SCORM/xAPI, API REST, exports RH/CSV : notre plateforme s’intègre à vos outils sans friction." />
</svelte:head>

<!-- SECTION 1 — HERO -->
<section class="w-full bg-brand-green/5">
  <div class="container-1200 py-12 md:py-16 grid-12 items-center gap-6">
    <div class="col-span-12 md:col-span-7">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">Connectée à vos outils, prête dès demain.</h1>
      <p class="mt-4 max-w-2xl">SSO, SCORM/xAPI, exports RH : nos intégrations fluidifient vos process.</p>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="rounded-xl overflow-hidden border border-black/10 bg-white p-4">
        <svg viewBox="0 0 800 360" width="100%" height="100%" role="img" aria-label="Schéma d’intégrations (hub)">
          <rect x="0" y="0" width="800" height="360" fill="#fff"/>
          <circle cx="400" cy="180" r="56" fill="#0C6A4C"/>
          <text x="400" y="176" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">Plateforme</text>
          <text x="400" y="194" text-anchor="middle" font-size="18" fill="#fff" font-weight="700">FPSG</text>
          <!-- nodes -->
          <g fill="#0C6A4C" fill-opacity=".12" stroke="#CFE3D7">
            <circle cx="400" cy="40" r="28"/>
            <circle cx="700" cy="120" r="28"/>
            <circle cx="640" cy="300" r="28"/>
            <circle cx="100" cy="260" r="28"/>
            <circle cx="140" cy="100" r="28"/>
          </g>
          <!-- links -->
          <g stroke="#CFE3D7" stroke-width="3">
            <line x1="400" y1="124" x2="400" y2="68"/>
            <line x1="448" y1="160" x2="672" y2="128"/>
            <line x1="432" y1="208" x2="616" y2="288"/>
            <line x1="352" y1="208" x2="124" y2="252"/>
            <line x1="352" y1="160" x2="152" y2="112"/>
          </g>
          <!-- labels -->
          <g font-size="12" fill="#223">
            <text x="400" y="44" text-anchor="middle">Workday</text>
            <text x="700" y="124" text-anchor="middle">SAP</text>
            <text x="640" y="304" text-anchor="middle">Moodle</text>
            <text x="100" y="264" text-anchor="middle">Teams</text>
            <text x="140" y="104" text-anchor="middle">Okta</text>
          </g>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 2 — LOGOS DES INTÉGRATIONS -->
<section class="container-1200 pt-10 md:pt-12">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card><div class="p-4 text-center">SAP</div></Card>
    <Card><div class="p-4 text-center">Workday</div></Card>
    <Card><div class="p-4 text-center">ADP</div></Card>
    <Card><div class="p-4 text-center">360Learning</div></Card>
    <Card><div class="p-4 text-center">Moodle</div></Card>
    <Card><div class="p-4 text-center">Cornerstone</div></Card>
    <Card><div class="p-4 text-center">Teams</div></Card>
    <Card><div class="p-4 text-center">Slack</div></Card>
    <Card><div class="p-4 text-center">Outlook</div></Card>
    <Card><div class="p-4 text-center">Azure AD</div></Card>
    <Card><div class="p-4 text-center">Okta</div></Card>
    <Card><div class="p-4 text-center">Google Workspace</div></Card>
    <Card><div class="p-4 text-center">SCORM</div></Card>
    <Card><div class="p-4 text-center">xAPI</div></Card>
    <Card><div class="p-4 text-center">CSV</div></Card>
    <Card><div class="p-4 text-center">JSON</div></Card>
  </div>
</section>

<!-- SECTION 3 — STANDARDS TECHNIQUES -->
<section id="standards" class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card><div class="p-4"><div class="font-semibold">SSO</div><div class="text-sm text-gray-700 mt-1">connexion unique avec Azure AD/Okta</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">SCORM & xAPI</div><div class="text-sm text-gray-700 mt-1">traçabilité LMS</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">API REST</div><div class="text-sm text-gray-700 mt-1">intégration systèmes internes</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Exports automatiques</div><div class="text-sm text-gray-700 mt-1">CSV/JSON via email ou SFTP</div></div></Card>
  </div>
</section>

<!-- SECTION 4 — HUB INTERACTIF DES LOGOS -->
<section class="container-1200 pt-10">
  <div id="hub" class="rounded-2xl border border-black/10 bg-white" style="position:relative;width:100%;max-width:720px;height:420px;margin:auto">
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:140px;height:140px;border-radius:50%;background:#0C6A4C;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;text-align:center">Plateforme<br/>FPSG</div>
    <button class="hub-logo" style="top:10%;left:50%" onclick={() => hubSet('Workday : synchronisation auto certificats')}>Workday</button>
    <button class="hub-logo" style="top:30%;left:85%" onclick={() => hubSet('SAP : export RH & badges')}>SAP</button>
    <button class="hub-logo" style="top:75%;left:80%" onclick={() => hubSet('Moodle : import SCORM/xAPI')}>Moodle</button>
    <button class="hub-logo" style="top:85%;left:45%" onclick={() => hubSet('Teams : notifications auto')}>Teams</button>
    <button class="hub-logo" style="top:65%;left:10%" onclick={() => hubSet('Okta : SSO sécurisé')}>Okta</button>
  </div>
  <p id="hub-info" class="text-brand-green text-center mt-3">{hubInfo}</p>
  <style>
    #hub .hub-logo{position:absolute;padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;transform:translate(-50%,-50%)}
    #hub .hub-logo:hover{border-color:#0C6A4C;color:#0C6A4C}
  </style>
</section>

<!-- SECTION 5 — EXEMPLE D’EXPORT RH -->
<section id="export" class="container-1200 pt-10">
  <div class="rounded-2xl border border-black/10 bg-white p-4 max-w-[720px] mx-auto">
    <div class="flex gap-2 flex-wrap">
      <button class="px-3 py-2 rounded-lg border border-brand-green bg-brand-green/10" onclick={onExportCSV}>Exporter CSV</button>
      <button class="px-3 py-2 rounded-lg border border-brand-green bg-brand-green/10" onclick={onExportJSON}>Exporter JSON</button>
    </div>
    <p class="mt-2 text-brand-green">{hubInfo}</p>
  </div>
</section>

<!-- SECTION 6 — CAS D’USAGE CONCRET -->
<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card><div class="p-4"><div class="font-semibold">Scénario</div><div class="text-gray-700 mt-1">Un agent valide un module critique → certificat exporté dans Workday.</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Notification Teams</div><div class="text-gray-700 mt-1">“Agent Durand a complété la formation Incendie. Certificat disponible.”</div></div></Card>
  </div>
</section>

<!-- SECTION 7 — BLOC CONFORMITÉ -->
<section class="container-1200 pt-10">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card><div class="p-4"><div class="font-semibold">RGPD</div><div class="text-sm text-gray-700 mt-1">minimisation des données, purge auto.</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Sécurité</div><div class="text-sm text-gray-700 mt-1">hébergement UE, chiffrement AES.</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Interopérabilité</div><div class="text-sm text-gray-700 mt-1">SCORM, xAPI, API.</div></div></Card>
    <Card><div class="p-4"><div class="font-semibold">Audit</div><div class="text-sm text-gray-700 mt-1">exports opposables.</div></div></Card>
  </div>
</section>

<!-- SECTION 8 — CTA FINAL -->
<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-semibold">Votre plateforme, vos outils, zéro friction.</h2>
      <p class="text-gray-700">Nous connectons vos modules à votre écosystème en quelques jours.</p>
    </div>
  </div>
</section>
