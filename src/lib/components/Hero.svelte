<script lang="ts">
  import Button from './Button.svelte';
  </script>

<section class="container-1200 pt-12 md:pt-16 pb-12 md:pb-16">
  <div class="grid-12 items-center">
    <div class="col-span-12 md:col-span-7">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fde36237294f94c318a401159d4c44f61?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">La formation qui agit sur le terrain</h1>
      <p class="mt-4 md:mt-6 max-w-2xl">Passez du papier au e‑learning interactif, traçable et engageant.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" href="/exploration">Exploration guidée</Button>
        <Button variant="ghost" href="/interactions">Voir les interactions</Button>
        <Button variant="ghost" href="/tableau-de-bord">Tableau de bord Manager</Button>
      </div>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="relative mt-10 md:mt-0">
        <div class="aspect-[16/10] w-full rounded-xl overflow-hidden border border-black/5 bg-white shadow-soft">
          <svg viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration amusante e-learning">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#F1FBF6"/>
                <stop offset="100%" stop-color="#E6FAF0"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="800" height="500" fill="url(#g1)"/>

            <!-- playful circles -->
            <circle cx="120" cy="120" r="60" fill="#0C6A4C" fill-opacity="0.12"/>
            <circle cx="700" cy="120" r="40" fill="#0C6A4C" fill-opacity="0.16"/>
            <circle cx="640" cy="380" r="70" fill="#0C6A4C" fill-opacity="0.10"/>

            <!-- tile 1: play -->
            <rect x="70" y="220" rx="18" ry="18" width="200" height="130" fill="#ffffff" stroke="#DCE7E1"/>
            <circle cx="170" cy="285" r="36" fill="#0C6A4C" fill-opacity="0.9"/>
            <polygon points="160,268 196,286 160,304" fill="#ffffff"/>

            <!-- tile 2: checklist -->
            <rect x="300" y="90" rx="18" ry="18" width="220" height="150" fill="#ffffff" stroke="#DCE7E1"/>
            <rect x="320" y="120" width="140" height="14" rx="7" fill="#0C6A4C" fill-opacity="0.15"/>
            <rect x="320" y="146" width="110" height="14" rx="7" fill="#0C6A4C" fill-opacity="0.15"/>
            <path d="M520 118 l10 12 18 -24" stroke="#0C6A4C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M520 144 l10 12 18 -24" stroke="#0C6A4C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- tile 3: camera/photo proof -->
            <rect x="560" y="220" rx="18" ry="18" width="170" height="130" fill="#ffffff" stroke="#DCE7E1"/>
            <rect x="590" y="250" rx="8" ry="8" width="110" height="70" fill="#F3F9F5" stroke="#CFE3D7"/>
            <circle cx="645" cy="285" r="16" fill="#0C6A4C" fill-opacity="0.9"/>
            <rect x="610" y="245" width="24" height="12" rx="4" fill="#0C6A4C" fill-opacity="0.5"/>

            <!-- tile 4: QR/signature -->
            <rect x="280" y="310" rx="18" ry="18" width="220" height="150" fill="#ffffff" stroke="#DCE7E1"/>
            <!-- simple QR pattern -->
            <rect x="300" y="330" width="60" height="60" fill="#0C6A4C" fill-opacity="0.08"/>
            <rect x="305" y="335" width="50" height="50" fill="#0C6A4C" fill-opacity="0.12"/>
            <rect x="315" y="345" width="12" height="12" fill="#0C6A4C"/>
            <rect x="335" y="345" width="8" height="18" fill="#0C6A4C"/>
            <rect x="315" y="365" width="8" height="8" fill="#0C6A4C"/>
            <rect x="330" y="365" width="20" height="8" fill="#0C6A4C"/>
            <!-- signature line -->
            <line x1="375" y1="385" x2="480" y2="385" stroke="#CFE3D7" stroke-width="3"/>
            <path d="M385 380 q10 10 20 -2 t22 0 t20 -4 t18 6" stroke="#0C6A4C" stroke-width="3" fill="none"/>
          </svg>
        </div>
        <div class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand-green/20 blur-2xl"></div>
      </div>
    </div>
  </div>
</section>
