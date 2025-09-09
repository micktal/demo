<script lang="ts">
  export let label: string;
  export let value: string;
  export let sublabel: string = '';
</script>

<div class="card text-center">
  <div class="text-3xl md:text-4xl font-semibold text-brand-green">{value}</div>
  <div class="mt-1 text-gray-900 font-medium">{label}</div>
  {#if sublabel}
    <div class="mt-1 text-sm text-gray-700">{sublabel}</div>
  {/if}
</div>
