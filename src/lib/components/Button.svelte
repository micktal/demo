<script lang="ts">
  export let variant: 'primary' | 'ghost' = 'primary';
  export let href: string | undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  let classes = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
</script>

{#if href}
  <a class={classes} href={href}><slot /></a>
{:else}
  <button class={classes} type={type}><slot /></button>
{/if}
