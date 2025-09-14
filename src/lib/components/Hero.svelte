<script lang="ts">
  import Button from './Button.svelte';
  import { t } from '$lib/i18n';
  </script>

<section class="container-1200 pt-12 md:pt-16 pb-12 md:pb-16">
  <div class="grid-12 items-center">
    <div class="col-span-12 md:col-span-7">
      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fde36237294f94c318a401159d4c44f61?format=webp&width=800" alt="FIDUCIAL FPSG" class="h-10 w-auto" />
      <h1 class="mt-4">{t('home.title','La formation qui agit sur le terrain')}</h1>
      <p class="mt-4 md:mt-6 max-w-2xl">{t('home.subtitle','Passez du papier au e‑learning interactif, traçable et engageant.')}</p>
      <div class="mt-6 flex gap-3">
        <Button href="/processus" variant="primary">{t('cta.processus','Voir le processus')}</Button>
      </div>
    </div>
    <div class="col-span-12 md:col-span-5">
      <div class="relative mt-10 md:mt-0">
        <div class="aspect-[16/10] w-full rounded-xl overflow-hidden border border-black/5 bg-white shadow-soft">
          <img src="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F6c312b410a75484eae2cd08cbb548179?format=webp&width=1200" alt="Analyse de données sur ordinateur" class="h-full w-full object-cover" />
        </div>
        <div class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand-green/20 blur-2xl"></div>
      </div>
    </div>
  </div>
</section>
