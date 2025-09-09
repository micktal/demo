<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { demo } from '$lib/stores/demo';
  import { onMount } from 'svelte';
  import { fireConfetti } from '$lib/utils/confetti';

  const KEY = 'fpsgDemo';

  type Proof = { type: 'photo'; name: string; ts: string; url?: string };
  type Validation = { tutor: string; ts: string; sig: string };
  type QR = { code: string; ts: string };

  let checklist = $state({ id: false, epi: false, plaque: false, consignes: false });
  let showCkOk = $state(false);

  let proofs = $state<Proof[]>([]);
  let photoOk = $state(false);

  let qrInput = $state('');
  let qr: QR | null = $state(null);
  let qrOk = $state(false);

  let tutorName = $state('');
  let validationTs = $state('');
  let signOk = $state(false);
  let canvasEl: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let drawing = false;
  let last = [0, 0];

  let feedbackText = $state('');
  let feedbackOk = $state(false);

  let confettiHostCk: HTMLElement | null = null;
  let confettiHostPhoto: HTMLElement | null = null;
  let confettiHostQr: HTMLElement | null = null;
  let confettiHostSign: HTMLElement | null = null;
  let confettiHostFb: HTMLElement | null = null;

  function mergeSave(partial: Record<string, any>) {
    try {
      const existing = JSON.parse(localStorage.getItem(KEY) || '{}');
      localStorage.setItem(KEY, JSON.stringify({ ...existing, ...partial }));
    } catch {}
  }

  function onChecklistChange() {
    demo.addProgress(5);
    demo.addScore(2);
    const allDone = checklist.id && checklist.epi && checklist.plaque && checklist.consignes;
    showCkOk = allDone;
    mergeSave({ checklist });
    if (allDone) {
      demo.award('AFEST – Mission');
      if (confettiHostCk) fireConfetti(confettiHostCk, 80);
    }
  }

  function onPhotoChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const ts = new Date().toISOString();
    const p: Proof = { type: 'photo', name: f.name, ts, url };
    proofs = [p];
    mergeSave({ proofs: proofs.slice() });
    demo.addProgress(8);
    demo.addScore(5);
    demo.award('Preuve terrain');
    photoOk = true;
    if (confettiHostPhoto) fireConfetti(confettiHostPhoto, 80);
  }

  function onQrValidate() {
    const val = (qrInput || '').trim();
    if (!val) { alert('Saisir un code QR de démo, ex. PB6-ZONE-A-04'); return; }
    qr = { code: val, ts: new Date().toISOString() };
    mergeSave({ qr });
    demo.addProgress(5);
    demo.addScore(3);
    demo.award('AFEST – Poste lié');
    qrOk = true;
    if (confettiHostQr) fireConfetti(confettiHostQr, 80);
  }

  function pos(e: MouseEvent | TouchEvent) {
    if (!canvasEl) return [0, 0];
    const r = canvasEl.getBoundingClientRect();
    const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    return [clientX - r.left, clientY - r.top];
  }
  function start(e: MouseEvent | TouchEvent) { drawing = true; last = pos(e) as [number, number]; }
  function move(e: MouseEvent | TouchEvent) {
    if (!drawing || !ctx) return;
    const [x, y] = pos(e) as [number, number];
    ctx.strokeStyle = '#0C6A4C';
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(x, y); ctx.stroke();
    last = [x, y];
  }
  function end() { drawing = false; }

  function clearSign() { if (!ctx || !canvasEl) return; ctx.clearRect(0, 0, canvasEl.width, canvasEl.height); }
  function saveSign() {
    if (!canvasEl) return;
    const name = (tutorName || '').trim();
    if (!name) { alert('Renseigner le nom du tuteur.'); return; }
    const img = canvasEl.toDataURL('image/png');
    const validation: Validation = { tutor: name, ts: new Date().toISOString(), sig: img };
    mergeSave({ validation });
    validationTs = validation.ts;
    demo.addProgress(10);
    demo.addScore(8);
    demo.award('AFEST – Validée');
    signOk = true;
    if (confettiHostSign) fireConfetti(confettiHostSign, 100);
  }

  function saveFeedback() {
    const val = (feedbackText || '').trim();
    if (!val) { alert('Saisir un court feedback.'); return; }
    mergeSave({ feedback: { text: val, ts: new Date().toISOString() } });
    demo.addProgress(5);
    demo.addScore(2);
    demo.award('AFEST – Feedback');
    feedbackOk = true;
    if (confettiHostFb) fireConfetti(confettiHostFb, 60);
  }

  function exportCsv() {
    const s = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })();
    const mission = 'Accueil transporteur (zone chargement)';
    const proof = s.proofs && s.proofs[0] ? `${s.proofs[0].type} ${s.proofs[0].name}` : '—';
    const tutor = s.validation && s.validation.tutor ? s.validation.tutor : '—';
    const ts = s.validation && s.validation.ts ? s.validation.ts : (s.proofs && s.proofs[0] ? s.proofs[0].ts : '—');
    const fb = s.feedback && s.feedback.text ? s.feedback.text : '—';
    const header = ['Mission','Preuve','Tuteur','Horodatage','Feedback'].join(',');
    const row = [mission, JSON.stringify(proof), JSON.stringify(tutor), JSON.stringify(ts), JSON.stringify(fb)].join(',');
    const csv = header + '\n' + row;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'afest_export_demo.csv'; a.click();
    const ok = document.getElementById('afest-exp-ok'); if (ok) ok.style.display = 'inline';
  }

  onMount(() => {
    // init canvas
    if (canvasEl) { ctx = canvasEl.getContext('2d'); }
    if (canvasEl) {
      canvasEl.addEventListener('mousedown', start as any);
      canvasEl.addEventListener('mousemove', move as any);
      window.addEventListener('mouseup', end as any);
      canvasEl.addEventListener('touchstart', start as any, { passive: true } as any);
      canvasEl.addEventListener('touchmove', move as any, { passive: true } as any);
      window.addEventListener('touchend', end as any);
    }

    // load persisted data
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (s.checklist) checklist = { ...checklist, ...s.checklist };
      if (s.proofs) proofs = s.proofs;
      if (s.qr) { qr = s.qr; qrInput = s.qr.code; }
      if (s.validation) { tutorName = s.validation.tutor; validationTs = s.validation.ts; }
      if (s.feedback) { feedbackText = s.feedback.text; }
    } catch {}
  });
</script>

<svelte:head>
  <title>AFEST : former sur le poste, tracer les preuves – Fiducial FPSG</title>
  <meta name="description" content="Timeline AFEST, mission terrain guidée, preuves photo/QR, validation tuteur, feedback apprenant, mini-dashboard opposable." />
</svelte:head>

<section class="container-1200 pt-12 md:pt-16 pb-12 md:pb-16">
  <div class="grid-12 items-center">
    <div class="col-span-12 md:col-span-7">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F02927578b250470483b3b67101b63152?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">{(await import('$lib/i18n')).t('afest.title','L’AFEST, la formation en situation réelle.')}</h1>
      <p class="mt-4 md:mt-6 max-w-2xl">{(await import('$lib/i18n')).t('afest.subtitle','Du terrain au digital : preuves, guidage et validation opposable.')}</p>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="relative mt-10 md:mt-0">
        <div class="aspect-[16/10] w-full rounded-xl overflow-hidden border border-black/5 bg-white shadow-soft">
          <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AFEST: poste, checklist, photo, QR, signature">
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#F1FBF6"/>
                <stop offset="100%" stop-color="#E6FAF0"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="800" height="500" fill="url(#ag)"/>

            <circle cx="110" cy="110" r="56" fill="#0C6A4C" opacity="0.12"/>
            <circle cx="690" cy="110" r="40" fill="#0C6A4C" opacity="0.16"/>
            <circle cx="620" cy="380" r="70" fill="#0C6A4C" opacity="0.10"/>

            <!-- Checklist tile -->
            <rect x="70" y="220" rx="18" ry="18" width="220" height="140" fill="#fff" stroke="#DCE7E1"/>
            <rect x="96" y="246" width="120" height="12" rx="6" fill="#0C6A4C" opacity="0.18"/>
            <rect x="96" y="270" width="100" height="12" rx="6" fill="#0C6A4C" opacity="0.18"/>
            <path d="M250 244 l10 12 18 -24" stroke="#0C6A4C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M250 268 l10 12 18 -24" stroke="#0C6A4C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Photo proof tile -->
            <rect x="560" y="220" rx="18" ry="18" width="180" height="140" fill="#fff" stroke="#DCE7E1"/>
            <rect x="590" y="250" rx="8" ry="8" width="120" height="70" fill="#F3F9F5" stroke="#CFE3D7"/>
            <circle cx="650" cy="285" r="16" fill="#0C6A4C" opacity="0.9"/>
            <rect x="612" y="245" width="26" height="12" rx="4" fill="#0C6A4C" opacity="0.5"/>

            <!-- QR + signature tile -->
            <rect x="300" y="320" rx="18" ry="18" width="220" height="150" fill="#fff" stroke="#DCE7E1"/>
            <rect x="320" y="340" width="60" height="60" fill="#0C6A4C" opacity="0.08"/>
            <rect x="325" y="345" width="50" height="50" fill="#0C6A4C" opacity="0.12"/>
            <rect x="335" y="355" width="12" height="12" fill="#0C6A4C"/>
            <rect x="355" y="355" width="8" height="18" fill="#0C6A4C"/>
            <rect x="335" y="375" width="8" height="8" fill="#0C6A4C"/>
            <rect x="350" y="375" width="22" height="8" fill="#0C6A4C"/>
            <line x1="385" y1="405" x2="490" y2="405" stroke="#CFE3D7" stroke-width="3"/>
            <path d="M395 400 q10 10 20 -2 t22 0 t20 -4 t18 6" stroke="#0C6A4C" stroke-width="3" fill="none"/>

            <!-- Play tile (formation) -->
            <rect x="300" y="90" rx="18" ry="18" width="220" height="150" fill="#fff" stroke="#DCE7E1"/>
            <circle cx="410" cy="165" r="36" fill="#0C6A4C" opacity="0.9"/>
            <polygon points="398,148 432,166 398,184" fill="#ffffff"/>
          </svg>
        </div>
        <div class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand-green/20 blur-2xl"></div>
      </div>
    </div>
  </div>
</section>

<section class="container-1200 pb-4">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4" aria-label="Timeline AFEST">
    <div class="card">
      <div class="font-semibold">Observer</div>
      <div class="text-sm text-gray-700 mt-1">Décrire la tâche & les critères de réussite.</div>
    </div>
    <div class="card">
      <div class="font-semibold">Réaliser</div>
      <div class="text-sm text-gray-700 mt-1">Exécuter la tâche avec guidage & sécurité.</div>
    </div>
    <div class="card">
      <div class="font-semibold">Expliquer</div>
      <div class="text-sm text-gray-700 mt-1">Verbaliser, justifier les choix & écarts.</div>
    </div>
    <div class="card">
      <div class="font-semibold">Évaluer</div>
      <div class="text-sm text-gray-700 mt-1">Collecter preuves, feedback & valider.</div>
    </div>
  </div>
  <div class="mt-3 inline-flex items-center gap-2 text-sm rounded-full bg-white border border-black/10 px-3 py-1">✅ Compatible audit : étapes historisées.</div>
</section>

<section id="mission" class="container-1200 pt-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="">
      <div bind:this={confettiHostCk} class="card" style="border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff">
        <h3 style="margin:0 0 8px 0">Checklist mission – Accueil transporteur</h3>
        <p style="margin:0 0 12px 0;color:#666">Coche chaque étape effectuée sur site. La progression & les badges se mettent à jour.</p>
        <ul id="afest-ck" style="list-style:none;padding:0;margin:0;display:grid;gap:8px">
          <li><label><input type="checkbox" data-k="id" bind:checked={checklist.id} onchange={onChecklistChange} /> Vérifier identité & badge</label></li>
          <li><label><input type="checkbox" data-k="epi" bind:checked={checklist.epi} onchange={onChecklistChange} /> Expliquer les EPI requis (gilet HV, chaussures sécu)</label></li>
          <li><label><input type="checkbox" data-k="plaque" bind:checked={checklist.plaque} onchange={onChecklistChange} /> Consigner la plaque du véhicule</label></li>
          <li><label><input type="checkbox" data-k="consignes" bind:checked={checklist.consignes} onchange={onChecklistChange} /> Expliquer les consignes de circulation & zone</label></li>
        </ul>
        <p id="afest-ck-fb" style="margin:12px 0 0 0;color:#0C6A4C;display:{showCkOk ? 'block' : 'none'}">✅ Mission cochée. Badge “AFEST – Mission” obtenu.</p>
      </div>
    </Card>
    <Card>
      <div bind:this={confettiHostPhoto} class="card" style="border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff">
        <h3 style="margin:0 0 8px 0">Preuve terrain – Photo</h3>
        <input id="afest-photo" type="file" accept="image/*" onchange={onPhotoChange} />
        <div id="afest-photo-prev" style="margin-top:12px;display:flex;gap:12px;align-items:center">
          {#if proofs[0]}
            <img src={proofs[0].url} alt="Preuve photo" style="width:96px;height:96px;object-fit:cover;border-radius:10px" />
            <div><div><strong>Fichier :</strong> {proofs[0].name}</div><div><strong>Horodatage :</strong> {proofs[0].ts}</div></div>
          {/if}
        </div>
        <p id="afest-photo-fb" style="margin:12px 0 0 0;color:#0C6A4C;display:{photoOk ? 'block' : 'none'}">✅ Preuve enregistrée (horodatée). Badge “Preuve terrain”.</p>
      </div>
    </Card>
  </div>
</section>

<section class="container-1200 pt-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <div bind:this={confettiHostQr} class="card" style="border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff">
        <h3 style="margin:0 0 8px 0">Scan QR – Poste de travail (démo)</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input id="afest-qr" type="text" placeholder="Saisir code QR (ex. PB6-ZONE-A-04)" style="padding:8px;border:1px solid #e5e7eb;border-radius:8px" bind:value={qrInput} />
          <button id="afest-qr-btn" style="padding:8px 12px;border:1px solid #0C6A4C;border-radius:8px;background:#f2fbf7" onclick={onQrValidate}>Valider</button>
        </div>
        <p id="afest-qr-fb" style="margin:12px 0 0 0;color:#0C6A4C;display:{qrOk ? 'block' : 'none'}">✅ QR validé & associé à la mission. Badge “AFEST – Poste lié”.</p>
      </div>
    </Card>
    <Card>
      <div bind:this={confettiHostSign} class="card" style="border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff">
        <h3 style="margin:0 0 8px 0">Validation tuteur</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <input id="afest-tuteur" type="text" placeholder="Nom du tuteur" style="padding:8px;border:1px solid #e5e7eb;border-radius:8px" bind:value={tutorName} />
          <canvas id="afest-sign" width="320" height="120" style="border:1px dashed #e5e7eb;border-radius:8px;background:#fff" bind:this={canvasEl} aria-label="Zone de signature"></canvas>
          <button id="afest-sign-clear" style="padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff" onclick={clearSign}>Effacer</button>
          <button id="afest-sign-save" style="padding:8px 12px;border:1px solid #0C6A4C;border-radius:8px;background:#f2fbf7" onclick={saveSign}>Valider</button>
        </div>
        <p id="afest-sign-fb" style="margin:12px 0 0 0;color:#0C6A4C;display:{signOk ? 'block' : 'none'}">✅ AFEST validée par tuteur. Badge “AFEST – Validée”.</p>
      </div>
    </Card>
  </div>
</section>

<section class="container-1200 pt-8">
  <Card>
    <div bind:this={confettiHostFb} class="card" style="border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff">
      <h3 style="margin:0 0 8px 0">Feedback apprenant</h3>
      <textarea id="afest-fb" rows="4" placeholder="Ton retour d’expérience…" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:8px" bind:value={feedbackText}></textarea>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button id="afest-fb-save" style="padding:8px 12px;border:1px solid #0C6A4C;border-radius:8px;background:#f2fbf7" onclick={saveFeedback}>Enregistrer</button>
        <span id="afest-fb-ok" style="display:{feedbackOk ? 'inline' : 'none'};color:#0C6A4C">✅ Feedback enregistré.</span>
      </div>
    </div>
  </Card>
</section>

<section id="dashboard" class="container-1200 pt-8">
  <Card>
    <div class="card" style="border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff">
      <h3 style="margin:0 0 8px 0">Aperçu AFEST – Suivi</h3>
      <table id="afest-table" style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="text-align:left;background:#f9fafb">
            <th style="padding:8px;border-bottom:1px solid #e5e7eb">Mission</th>
            <th style="padding:8px;border-bottom:1px solid #e5e7eb">Preuve</th>
            <th style="padding:8px;border-bottom:1px solid #e5e7eb">Tuteur</th>
            <th style="padding:8px;border-bottom:1px solid #e5e7eb">Horodatage</th>
            <th style="padding:8px;border-bottom:1px solid #e5e7eb">Feedback</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px;border-bottom:1px solid #f1f5f9">Accueil transporteur (zone chargement)</td>
            <td style="padding:8px;border-bottom:1px solid #f1f5f9">{proofs[0] ? `${proofs[0].type} ${proofs[0].name}` : '—'}</td>
            <td style="padding:8px;border-bottom:1px solid #f1f5f9">{tutorName || '—'}</td>
            <td style="padding:8px;border-bottom:1px solid #f1f5f9">{validationTs || (proofs[0] && proofs[0].ts) || '—'}</td>
            <td style="padding:8px;border-bottom:1px solid #f1f5f9">{feedbackText ? (feedbackText.length > 60 ? feedbackText.slice(0,60) + '…' : feedbackText) : '—'}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button id="afest-export" style="padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff" onclick={exportCsv}>Exporter CSV (démo)</button>
        <span id="afest-exp-ok" style="display:none;color:#0C6A4C">📄 Export généré (mock).</span>
      </div>
    </div>
  </Card>
</section>

<section class="container-1200 pt-12">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="card"><div class="font-semibold">Traçabilité</div><div class="text-sm text-gray-700 mt-1">horodatage, tuteur, preuve attachée.</div></div>
    <div class="card"><div class="font-semibold">Opposable</div><div class="text-sm text-gray-700 mt-1">accusé de lecture & validation conservés.</div></div>
    <div class="card"><div class="font-semibold">RGPD</div><div class="text-sm text-gray-700 mt-1">minimisation, purge, droits d’accès.</div></div>
    <div class="card"><div class="font-semibold">Interopérabilité</div><div class="text-sm text-gray-700 mt-1">SCORM/xAPI, SSO, exports CSV/JSON.</div></div>
  </div>
</section>

<section class="container-1200 pt-12 pb-16">
  <div class="card flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <div class="text-xl font-semibold">Vos AFEST, prêtes pour l’audit.</div>
      <div class="text-gray-700 mt-1">Guidage terrain, preuves, validation, suivi managérial.</div>
    </div>
    <div class="flex gap-3">
      <Button variant="primary" href="/contact?from=afest-demo">Planifier une démo</Button>
      <Button variant="ghost" href="/contact?from=afest-chiffrage">Chiffrage express</Button>
    </div>
  </div>
</section>
