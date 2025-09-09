<script lang="ts">
  import '../app.css';
  import { lang, highContrast, fontScale, applyAccessibilityToDom } from '$lib/stores/ui';
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';

  let { children } = $props();

  let openMenu = false;

  function setLang(value: 'fr' | 'en') { lang.set(value); }
  function toggleContrast() { highContrast.update((v) => !v); }
  function cycleFont() {
    fontScale.update((v) => (v === '100' ? '112' : v === '112' ? '125' : '100'));
  }

  onMount(() => {
    const unsub1 = highContrast.subscribe(() => applyAccessibilityToDom());
    const unsub2 = fontScale.subscribe(() => applyAccessibilityToDom());
    applyAccessibilityToDom();
    return () => { unsub1(); unsub2(); };
  });

  const nav = [
    { label: 'Accueil', href: '/' },
    { label: 'Interactions', href: '/interactions' },
    { label: 'Parcours', href: '/parcours' },
    { label: 'AFEST', href: '/afest' },
    { label: 'Accessibilité & Langues', href: '/accessibilite-langues' },
    { label: 'Tableau de bord', href: '/tableau-de-bord' },
    { label: 'Intégrations', href: '/integrations' },
    { label: 'Comparatif', href: '/comparatif' },
    { label: 'ROI & Témoignages', href: '/roi-temoignages' },
    { label: 'Contact', href: '/contact' }
  ];
</script>

<header class="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
  <div class="container-1200 h-16 md:h-20 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center gap-3">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F13137c2a909f405dab2ca3233793a766?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-8 w-auto" />
      <span class="sr-only">Fiducial FPSG</span>
    </a>

    <nav class="hidden lg:flex items-center gap-6">
      {#each nav as item}
        <a class="header-link" href={item.href}>{item.label}</a>
      {/each}
    </nav>

    <div class="hidden lg:flex items-center gap-3">
      <div class="flex rounded-lg border border-black/10 overflow-hidden">
        <button class="px-3 py-1.5 text-sm font-medium hover:bg-black/5" on:click={() => setLang('fr')}>FR</button>
        <button class="px-3 py-1.5 text-sm font-medium hover:bg-black/5" on:click={() => setLang('en')}>EN</button>
      </div>
      <div class="flex items-center gap-2">
        <button class="header-link" title="Contraste" on:click={toggleContrast}>Contraste</button>
        <button class="header-link" title="Taille du texte" on:click={cycleFont}>A1y A</button>
      </div>
      <Button variant="primary" href="/contact">Demander une démo projet</Button>
    </div>

    <button class="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-black/5" on:click={() => openMenu = !openMenu} aria-label="Menu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </div>
  {#if openMenu}
    <div class="lg:hidden border-t border-black/5 bg-white">
      <div class="container-1200 py-3 flex flex-col gap-3">
        {#each nav as item}
          <a class="header-link py-2" href={item.href} on:click={() => openMenu=false}>{item.label}</a>
        {/each}
        <div class="flex items-center gap-3 pt-2">
          <div class="flex rounded-lg border border-black/10 overflow-hidden">
            <button class="px-3 py-1.5 text-sm font-medium hover:bg-black/5" on:click={() => setLang('fr')}>FR</button>
            <button class="px-3 py-1.5 text-sm font-medium hover:bg-black/5" on:click={() => setLang('en')}>EN</button>
          </div>
          <button class="header-link" on:click={toggleContrast}>Contraste</button>
          <button class="header-link" on:click={cycleFont}>Taille texte</button>
          <Button variant="primary" href="/contact">Demander une démo projet</Button>
        </div>
      </div>
    </div>
  {/if}
</header>

<main>
  {@render children()}
</main>

<footer class="mt-16 border-t border-black/10 bg-brand-black text-white">
  <div class="container-1200 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    <div>
      <div class="flex items-center gap-3">
        <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F13137c2a909f405dab2ca3233793a766?format=webp&width=200" alt="FIDUCIAL FPSG" class="h-7 w-auto" />
      </div>
      <p class="mt-3 text-sm text-white/70">Plateforme e‑learning premium, centrée sur l'impact et l'accessibilité.</p>
    </div>
    <div>
      <div class="font-semibold mb-3">Navigation</div>
      <ul class="space-y-2 text-white/80">
        {#each nav as item}
          <li><a href={item.href} class="hover:text-white">{item.label}</a></li>
        {/each}
      </ul>
    </div>
    <div>
      <div class="font-semibold mb-3">Légal</div>
      <ul class="space-y-2 text-white/80">
        <li><a href="#" class="hover:text-white">RGPD</a></li>
        <li><a href="#" class="hover:text-white">Mentions</a></li>
      </ul>
    </div>
    <div>
      <div class="font-semibold mb-3">Contact</div>
      <p class="text-white/80">contact@votre-domaine.com<br/>+33 1 23 45 67 89</p>
      <div class="mt-4 flex items-center gap-3">
        <a href="#" aria-label="LinkedIn" class="hover:text-white/90"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5Zm.02 6.5H2v11h3V10Zm7.5 0h-3v11h3v-6.1c0-1.67 2-1.8 2 0V21h3v-6.75c0-4.66-5.5-4.48-5.5-2.19V10Z"/></svg></a>
        <a href="#" aria-label="Twitter" class="hover:text-white/90"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4 1-1.4-1.5-3.9-1.6-5.4-.1-1 .9-1.5 2.3-1.2 3.7-3.1-.2-6-1.7-7.9-4.1-1 1.7-.5 3.9 1.2 5  -.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.4 3.6 3.3 4-.6.2-1.2.2-1.8.1.5 1.6 2 2.7 3.7 2.7-1.6 1.3-3.7 2.1-5.9 2.1H2c2.1 1.3 4.6 2 7.3 2 8.8 0 13.6-7.3 13.6-13.6v-.6c.9-.6 1.6-1.3 2.1-2.1Z"/></svg></a>
        <a href="#" aria-label="YouTube" class="hover:text-white/90"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.6-1.9.6-5.8.6-5.8s0-3.9-.6-5.8ZM9.7 15.5v-7L15.8 12l-6.1 3.5Z"/></svg></a>
      </div>
    </div>
  </div>
  <div class="border-t border-white/10 py-4 text-center text-white/60 text-sm">© {new Date().getFullYear()} Fiducial FPSG — Tous droits réservés.</div>
</footer>
