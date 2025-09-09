<script lang="ts">
  export let as: 'div' | 'section' | 'article' = 'div';
  export let className = '';
</script>

<svelte:element this={as} class={`card ${className}`}>
  <slot />
</svelte:element>
