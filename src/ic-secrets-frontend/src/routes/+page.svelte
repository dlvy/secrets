<script lang="ts">
  import { onMount } from 'svelte';
  import { createActor } from '$lib/ic/secretsManager';
  import { browser } from '$app/environment';

  let secrets = [];
  let label = '';
  let value = '';
  let message = '';

  let actor;
  onMount(async () => {
    if (browser) {
      actor = await createActor();
      secrets = await actor.getSecrets();
    }
  });

  async function storeSecret() {
    if (!actor) return;
    const response = await actor.storeSecret(label, value);
    secrets = await actor.getSecrets();
    message = response;
    label = '';
    value = '';
  }

  async function clearSecrets() {
    if (!actor) return;
    await actor.clearSecrets();
    secrets = [];
  }
</script>

<h1>🔐 ICP Secrets Vault</h1>

<form on:submit|preventDefault={storeSecret}>
  <input placeholder="Label" bind:value={label} required />
  <input placeholder="Encrypted secret" bind:value={value} required />
  <button>Save Secret</button>
</form>

{#if message}
  <p><strong>{message}</strong></p>
{/if}

<h2>Your Secrets</h2>
<ul>
  {#each secrets as secret}
    <li><strong>{secret.label}:</strong> {secret.encrypted}</li>
  {/each}
</ul>

<button on:click={clearSecrets}>Clear All</button>
