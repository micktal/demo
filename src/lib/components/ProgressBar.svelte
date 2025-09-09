<script lang="ts">
  export let value = 0;
</script>
<div class="w-full">
  <div class="h-3 w-full overflow-hidden rounded-full bg-black/10">
    <div class="h-full bg-brand-green transition-[width] duration-500" style={`width:${Math.min(100, Math.max(0, value))}%`}></div>
  </div>
  <div class="mt-1 text-sm text-gray-700">{value}%</div>
</div>
