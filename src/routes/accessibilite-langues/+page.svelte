<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { onMount } from 'svelte';

  // SEO
  const title = 'E-learning multilingue & accessible – Fiducial FPSG';
  const description = 'Sous-titres, transcriptions, RTL (arabe), glossaire, coutumes. Déployez vos formations en plusieurs langues avec traçabilité et accessibilité.';

  // Section 2: language lab
  type Lang = 'fr'|'en'|'es'|'de'|'it'|'pt'|'ro'|'pl'|'sq'|'ar';
  let current: Lang = 'fr';
  const map: Record<Lang,string> = {
    fr:'La formation qui agit sur le terrain.',
    en:'Training that drives real-world action.',
    es:'Formación que impacta en el terreno.',
    de:'Training mit Wirkung vor Ort.',
    it:'Formazione che agisce sul campo.',
    pt:'Formação com impacto no terreno.',
    ro:'Formare cu impact pe teren.',
    pl:'Szkolenie działające w terenie.',
    sq:'Trajnim që vepron në terren.',
    ar:'التدريب الذي يصنع أثراً على أرض الواقع.'
  };
  const langs: { code: Lang; label: string }[] = [
    {code:'fr',label:'FR'},{code:'en',label:'EN'},{code:'es',label:'ES'},{code:'de',label:'DE'},{code:'it',label:'IT'},
    {code:'pt',label:'PT'},{code:'ro',label:'RO'},{code:'pl',label:'PL'},{code:'sq',label:'SQ'},{code:'ar',label:'AR'}
  ];

  // Section 3: captions + transcript demo
  let showTranscript = $state(false);
  let captionsOn = $state(true);
  let trackLang: 'fr'|'en'|'es'|'ar' = 'fr';
  let videoEl: HTMLVideoElement | null = null;
  function syncTracks(){
    const tt = videoEl?.textTracks; if (!tt) return;
    for (let i=0;i<tt.length;i++){ tt[i].mode = 'disabled'; }
    const wanted = {fr:0,en:1,es:2,ar:3}[trackLang];
    if (tt[wanted]) tt[wanted].mode = captionsOn ? 'showing' : 'disabled';
  }
  $effect(() => syncTracks());
  onMount(() => { syncTracks(); buildCloud(); });

  // World cloud custom code
  function buildCloud(){
    const words = ['Bonjour','Hello','¡Hola!','Guten Tag','Ciao','Olá','Bună','Cześć','Përshëndetje','مرحباً'];
    const box = document.getElementById('hello-cloud');
    if (!box) return;
    words.forEach(w=>{
      const s = document.createElement('span');
      s.textContent = w; s.style.position='absolute'; s.style.fontWeight='600'; s.style.opacity='0.85';
      s.style.left = Math.random()*80+10+'%'; s.style.top = Math.random()*70+15+'%';
      s.style.transform = `rotate(${(Math.random()*10-5)}deg)`; s.style.fontSize = (16 + Math.random()*14)+'px';
      box.appendChild(s);
    });
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<!-- 1) HERO -->
<section class="w-full bg-gradient-to-br from-white to-bg">
  <div class="container-1200 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <div>
      <h1>Former partout, à tous.</h1>
      <p class="mt-4 max-w-xl">Multi-langues, sous-titres, transcriptions, lecture RTL : vos équipes apprennent mieux, plus vite, où qu’elles soient.</p>
      <div class="mt-6 flex gap-3 flex-wrap">
        <Button variant="primary" href="/exploration">Essayer la démo multilingue</Button>
        <Button variant="ghost" href="#captions">Voir les sous-titres & transcripts</Button>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-5 gap-3">{#each ['🇫🇷','🇬🇧','🇪🇸','🇩🇪','🇮🇹','🇵🇹','🇷🇴','🇵🇱','🇦🇱','🇸🇦'] as f}<div class="grid place-items-center rounded-lg bg-white shadow-soft py-4 text-2xl">{f}</div>{/each}</div>
      <div id="hello-cloud" class="mt-4 relative h-40 border border-black/10 rounded-xl bg-white"></div>
    </div>
  </div>
</section>

<!-- 2) Sélecteur de langue (démo live) -->
<section class="container-1200 pt-12 md:pt-16">
  <h2>Démo multilingue</h2>
  <div id="lang-lab" class="mt-4 flex flex-wrap items-center gap-3">
    <div role="group" aria-label="Langue" class="flex flex-wrap gap-2">
      {#each langs as l}
        <button data-l={l.code} class="px-3 py-1.5 rounded-md border border-black/10 hover:border-brand-green" aria-pressed={current===l.code} onclick={() => current = l.code}>{l.label}</button>
      {/each}
    </div>
    <div id="copy" class="ml-2 rounded-lg border border-black/10 bg-white px-3 py-2" dir={current==='ar' ? 'rtl' : 'ltr'}>{map[current]}</div>
    {#if current==='ar'}<span id="rtlBadge" class="badge bg-brand-green/10 text-brand-green">RTL prêt</span>{/if}
  </div>
  <p class="mt-2 text-sm text-gray-700">Sous-titres & transcripts disponibles dans chaque langue. Lecteur compatible RTL.</p>
</section>

<!-- 3) Vidéo + Sous-titres + Transcript (démo) -->
<section id="captions" class="container-1200 pt-12 md:pt-16">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
    <div class="md:col-span-2 card">
      <div class="flex flex-wrap items-center gap-2">
        <button class="btn-ghost" onclick={() => { captionsOn = !captionsOn; syncTracks(); }}>{captionsOn ? 'Sous-titres ON' : 'Sous-titres OFF'}</button>
        <select class="px-3 py-2 rounded-md border border-black/10" bind:value={trackLang} onchange={syncTracks} aria-label="Langue des sous-titres">
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="ar">AR</option>
        </select>
        <button class="btn-primary" onclick={() => showTranscript = !showTranscript}>Transcript</button>
      </div>
      <video bind:this={videoEl} controls class="mt-4 w-full rounded-lg">
        <source src="" />
        <track kind="captions" srcLang="fr" label="FR" />
        <track kind="captions" srcLang="en" label="EN" />
        <track kind="captions" srcLang="es" label="ES" />
        <track kind="captions" srcLang="ar" label="AR" />
      </video>
      {#if showTranscript}
        <div class="mt-4">
          <details open class="rounded-lg border border-black/10 bg-white p-3">
            <summary class="font-medium cursor-pointer">Transcript (FR)</summary>
            <p class="mt-2 text-sm text-gray-700">Dans ce module, vous apprendrez à accueillir un visiteur en toute sécurité : contrôle d’identité, gestion d’une incivilité, et application des EPI selon la zone.</p>
          </details>
          <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="card text-sm">EN: In this module, you will learn to safely welcome a visitor...</div>
            <div class="card text-sm">ES: En este módulo, aprenderá a recibir a un visitante con seguridad...</div>
            <div class="card text-sm">AR: في هذا الدرس، ستتعلم استقبال الزائر بأمان...</div>
          </div>
        </div>
      {/if}
    </div>
    <aside class="card">
      <ul class="space-y-2 text-sm">
        <li>✅ Accessibilité : sous-titres, transcript, vitesse x0.75 à x1.5.</li>
        <li>✅ Inclusif : lecture RTL (arabe) prise en charge.</li>
        <li>✅ Conformité : modèle de sous-titres exportable (VTT, SRT).</li>
      </ul>
    </aside>
  </div>
</section>

<!-- 4) Grille de drapeaux + mots qui connectent -->
<section class="container-1200 pt-12 md:pt-16">
  <h2>Mots qui connectent</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
    {#each [
      ['🇫🇷','Bonjour !','Clarté, concision, précision.'],
      ['🇬🇧','Hello!','Ton direct, orienté résultats.'],
      ['🇪🇸','¡Hola!','Chaleur relationnelle, expliquer le pourquoi.'],
      ['🇩🇪','Guten Tag!','Procédure et traçabilité.'],
      ['🇵🇹','Olá!','Exemples concrets de terrain.'],
      ['🇷🇴','Bună!','Termes techniques simplifiés.'],
      ['🇵🇱','Cześć!','Étapes détaillées, checklists.'],
      ['🇦🇱','Përshëndetje!','Coopération et pratique.'],
      ['🇮🇹','Ciao!','Storytelling + visuels.'],
      ['🇸🇦','مرحباً!','RTL correct et politesse.']
    ] as t}
      <div class="card">
        <div class="text-2xl">{t[0]}</div>
        <div class="mt-2 font-semibold">{t[1]}</div>
        <p class="text-sm text-gray-700">{t[2]}</p>
      </div>
    {/each}
  </div>
  <div class="mt-4 rounded-md bg-black/5 px-3 py-2 text-sm">Plus de 30 langues disponibles sur demande.</div>
</section>

<!-- 5) Coutumes & contexte -->
<section class="container-1200 pt-12 md:pt-16">
  <h2>Coutumes & contexte</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
    {#each [
      ['Formules & ton','Adapter politesse, vouvoiement / tutoiement, structure des messages.'],
      ['Symboles & couleurs','Éviter les contresens culturels, visuels/pictos adaptés.'],
      ['Exemples terrain','Cas alignés au contexte du site (FR, RO, PL, AL…).'],
      ['Conformité locale','Mentions RGPD, affichages, pictogrammes normalisés.']
    ] as c}
      <div class="card"><div class="font-semibold">{c[0]}</div><p class="mt-1 text-sm">{c[1]}</p></div>
    {/each}
  </div>
</section>

<!-- 6) Glossaire interactif -->
<section class="container-1200 pt-12 md:pt-16">
  <h2>Glossaire</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
    {#each [
      ['EPI','PPE','EPP','EIP','OZO','Pajisje Mbrojtëse','معدات الوقاية الشخصية'],
      ['Incivilité','disruptive behavior','incivilidad','incivilitate','niegrzeczne zachowanie','mosmirësjellje','سلوك غي�� لائق'],
      ['Contrôle d’accès','access control','control de acceso','controlul accesului','kontrola dostępu','kontrolli i hyrjes','التحكم في الوصول']
    ] as g}
      <div class="card group">
        <div class="font-semibold">{g[0]}</div>
        <div class="mt-1 text-gray-700">EN {g[1]} • ES {g[2]} • RO {g[3]} • PL {g[4]} • SQ {g[5]} • AR {g[6]}</div>
      </div>
    {/each}
  </div>
  <p class="mt-2 text-sm text-gray-700">Le glossaire peut être filtré par rôle (agent, manager, HSE).</p>
</section>

<!-- 7) Démo RTL -->
<section class="container-1200 pt-12 md:pt-16">
  <h2>Démo RTL</h2>
  <div class="card" dir={current==='ar' ? 'rtl' : 'ltr'}>
    <p>التدريب الذي يصنع أثراً على أرض الواقع.</p>
    <div class="mt-3"><button class="btn-ghost" onclick={() => current = current==='ar' ? 'fr' : 'ar'}>Basculer RTL/LTR</button></div>
    <p class="mt-2 text-sm text-gray-700">RTL natif : texte, listes, pagination, formulaires, tout suit.</p>
  </div>
</section>

<!-- 8) Localisation complète -->
<section class="container-1200 pt-12 md:pt-16">
  <h2>Localisation complète</h2>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="card"><div class="font-semibold">Dates</div><p class="mt-1 text-sm">31/12/2025 (FR) · 12/31/2025 (EN US)</p></div>
    <div class="card"><div class="font-semibold">Unités</div><p class="mt-1 text-sm">m/kg vs ft/lb</p></div>
    <div class="card"><div class="font-semibold">Nombres</div><p class="mt-1 text-sm">1 234,56 (FR) vs 1,234.56 (EN)</p></div>
  </div>
  <div class="mt-3 text-sm text-gray-700">Zéro friction : vos équipes lisent leurs formats.</div>
</section>

<!-- 9) Data & déploiement -->
<section class="container-1200 pt-12 md:pt-16">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    {#each ['+30 langues activables','Sous-titres auto + révision humaine','Export SCORM/xAPI & LRS','SSO, RGPD, multi-sites'] as s}
      <div class="card text-center"><div class="font-semibold">{s}</div></div>
    {/each}
  </div>
  <p class="mt-2 text-sm text-gray-700">Traduction et révision en 10 jours ouvrés pour un module de référence (estimation).</p>
</section>

<!-- 10) Témoignage + logos -->
<section class="container-1200 pt-12 md:pt-16">
  <div class="card">
    <p>“Avec la version FR/EN/AR, nous avons doublé le taux de complétion sur nos sites MENA, tout en gardant la conformité RGPD.” — Responsable HSE, Industrie</p>
    <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {#each Array(8) as _}<div class="h-10 rounded bg-black/10"></div>{/each}
    </div>
  </div>
</section>

<!-- 11) CTA final -->
<section class="container-1200 pt-12 md:pt-16 pb-16">
  <div class="rounded-xl border border-black/10 bg-gradient-to-r from-brand-green/10 via-white to-brand-green/10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-soft">
    <div>
      <h3>Passez en multilingue, sans friction.</h3>
      <p class="mt-2 text-gray-700">On transforme vos supports & on déploie vos langues prioritaires.</p>
    </div>
    <div class="flex gap-3">
      <Button variant="primary" href="/contact">Demander un chiffrage</Button>
      <Button variant="ghost" href="/exploration">Voir une démo en 5 minutes</Button>
    </div>
  </div>
</section>
