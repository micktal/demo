<script lang="ts">
  import { lang, highContrast, fontScale, applyAccessibilityToDom } from '$lib/stores/ui';
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  let msg = 'Prêt.';
  function announce(text: string) { msg = text; }

  onMount(() => {
    const u1 = highContrast.subscribe(() => applyAccessibilityToDom());
    const u2 = fontScale.subscribe(() => applyAccessibilityToDom());
    applyAccessibilityToDom();
    return () => { u1(); u2(); };
  });

  function setLang(val: 'fr'|'en') { lang.set(val); }
</script>

<section class="container-1200 py-12 md:py-16">
  <h1>Accessibilité & Langues</h1>
  <p class="mt-3 max-w-2xl">Options inclusives et multilingues. Les réglages ici sont persistés et appliqués au site.</p>

  <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    <div class="card">
      <div class="font-semibold mb-2">Contraste élevé</div>
      <div class="flex items-center gap-2">
        <button class="btn-ghost" on:click={() => highContrast.set(false)}>Normal</button>
        <button class="btn-primary" on:click={() => highContrast.set(true)}>Élevé</button>
      </div>
    </div>
    <div class="card">
      <div class="font-semibold mb-2">Taille du texte</div>
      <div class="flex items-center gap-2">
        <button class="btn-ghost" on:click={() => fontScale.set('100')}>100%</button>
        <button class="btn-ghost" on:click={() => fontScale.set('112')}>112%</button>
        <button class="btn-primary" on:click={() => fontScale.set('125')}>125%</button>
      </div>
    </div>
    <div class="card">
      <div class="font-semibold mb-2">Langue</div>
      <div class="flex items-center gap-2">
        <button class="btn-primary" on:click={() => setLang('fr')}>FR</button>
        <button class="btn-ghost" on:click={() => setLang('en')}>EN</button>
      </div>
    </div>
  </div>

  <div class="mt-10">
    <h2>Contenu multilingue</h2>
    <div class="mt-3 card">
      <div class="lang-fr"><p>Bonjour — ce contenu s’affiche quand la langue est réglée sur FR.</p></div>
      <div class="lang-en"><p>Hello — this content shows when the language is set to EN.</p></div>
    </div>
  </div>

  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div class="card">
      <div class="font-semibold">Sous‑titres et transcript</div>
      <video controls class="mt-3 w-full rounded-lg" aria-describedby="transcript">
        <source src="#" type="video/mp4" />
        <track kind="captions" srcLang="fr" label="FR" default />
      </video>
      <div id="transcript" class="mt-3 text-sm text-gray-700">[Transcript] Exemple de dialogue lisible au clavier.</div>
    </div>
    <div class="card">
      <div class="font-semibold">Navigation clavier & ARIA live</div>
      <div class="mt-3 flex flex-wrap gap-2">
        <button class="btn-ghost" type="button">Lien 1</button>
        <button class="btn-ghost" type="button">Lien 2</button>
        <Button variant="primary" on:click={() => announce('Action réussie annoncée aux lecteurs d’écran')}>Simuler succès</Button>
      </div>
      <div class="mt-3 text-sm text-gray-700">La zone ci‑dessous annonce les mises à jour :</div>
      <div aria-live="polite" class="mt-2 rounded-md bg-black/5 px-3 py-2">{msg}</div>
    </div>
  </div>
</section>

<style>
  :global(.lang-fr){ display: var(--show-fr, block); }
  :global(.lang-en){ display: var(--show-en, none); }
</style>

<!-- Toggle visibility based on store via inline style on wrapper -->
<svelte:window on:load={() => {
  const root = document.documentElement;
  const set = (l: 'fr'|'en') => {
    root.style.setProperty('--show-fr', l==='fr' ? 'block' : 'none');
    root.style.setProperty('--show-en', l==='en' ? 'block' : 'none');
  };
  set('fr');
  const unsub = lang.subscribe((v) => set(v));
  return () => unsub();
}} />
