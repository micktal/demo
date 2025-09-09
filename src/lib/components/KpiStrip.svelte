<script lang="ts">
  import { demo, level } from '$lib/stores/demo';
  import { onMount } from 'svelte';
  let confettiOnce = false;

  function confetti() {
    const n = 26, dur = 900;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.style.position = 'fixed';
      d.style.left = Math.random() * 100 + 'vw';
      d.style.top = '-12px';
      d.style.width = '8px';
      d.style.height = '14px';
      d.style.borderRadius = '2px';
      d.style.background = 'var(--brand-green, #0C6A4C)';
      d.style.opacity = '0.9';
      d.style.transition = 'transform .9s linear, top .9s linear, opacity .9s ease-out';
      document.body.appendChild(d);
      requestAnimationFrame(() => {
        d.style.top = '110vh';
        d.style.transform = 'translateY(100vh) rotate(' + (Math.random()*180) + 'deg)';
        d.style.opacity = '0';
      });
      setTimeout(() => d.remove(), dur);
    }
  }

  onMount(() => {
    const unsub = demo.subscribe(($d) => {
      if ($d.progress >= 100 && !confettiOnce) { confetti(); confettiOnce = true; }
    });
    return unsub;
  });
</script>

<div class="kpi-wrap" role="status" aria-live="polite">
  <div class="kpi">
    <span>Progression</span>
    {#await import('svelte') then _}
      {#key Math.random()}
        <div class="bar">
          <div class="fill" style="width: {$demo.progress}%"></div>
        </div>
      {/key}
    {/await}
    <strong>{$demo.progress}%</strong>
  </div>
  <div class="kpi"><span>Score</span><strong>{$demo.score} pts</strong></div>
  <div class="kpi"><span>Niveau</span><strong>{$level}</strong></div>
  <div class="badges" aria-label="Badges">
    {#if $demo.badges.length === 0}<span class="muted">—</span>{/if}
    {#each $demo.badges as b}<span class="badge">{b}</span>{/each}
  </div>
</div>

<style>
  .kpi-wrap{display:flex;gap:16px;align-items:center;justify-content:flex-start;padding:8px 12px;border-top:1px solid rgba(0,0,0,.06);border-bottom:1px solid rgba(0,0,0,.06);background:#fff}
  .kpi{display:flex;align-items:center;gap:8px}
  .kpi span{color:#666;font-size:.9rem}
  .kpi strong{font-weight:600}
  .bar{width:160px;height:8px;border-radius:6px;background:#eee;overflow:hidden}
  .fill{height:100%;background:var(--brand-green,#0C6A4C)}
  .badges{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
  .badge{background:#f2fbf7;border:1px solid rgba(12,106,76,.25);color:#0C6A4C;padding:4px 8px;border-radius:999px;font-size:.8rem}
  .muted{color:#999}
</style>
