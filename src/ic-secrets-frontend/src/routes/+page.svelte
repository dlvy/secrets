<script lang="ts">
  import { onMount } from 'svelte';
  import { storeEncryptedSecret, getDecryptedSecrets, createActor } from '$lib/ic/secretsManager';
  import { browser } from '$app/environment';

  let secrets = [];
  let name = '';
  let value = '';
  let message = '';

  let actor;
  onMount(async () => {
    if (browser) {
      actor = await createActor();
      await loadSecrets();
    }
  });

  async function loadSecrets() {
    try {
      secrets = await getDecryptedSecrets();
    } catch (error) {
      console.error('Failed to load secrets:', error);
      message = 'Failed to load secrets: ' + error.message;
    }
  }

  async function storeSecret() {
    if (!actor) return;
    try {
      const response = await storeEncryptedSecret(name, value);
      await loadSecrets();
      message = response;
      name = '';
      value = '';
    } catch (error) {
      console.error('Failed to store secret:', error);
      message = 'Failed to store secret: ' + error.message;
    }
  }

  async function clearSecrets() {
    if (!actor) return;
    try {
      await actor.clearSecrets();
      secrets = [];
      message = 'All secrets cleared';
    } catch (error) {
      console.error('Failed to clear secrets:', error);
      message = 'Failed to clear secrets: ' + error.message;
    }
  }
</script>

<h1>🔐 ICP Secrets Vault</h1>

<form on:submit|preventDefault={storeSecret}>
  <input placeholder="Secret name" bind:value={name} required />
  <input placeholder="Secret value (will be encrypted)" type="password" bind:value={value} required />
  <button>Save Secret</button>
</form>

{#if message}
  <p><strong>{message}</strong></p>
{/if}

<h2>Your Secrets (Decrypted)</h2>
<ul>
  {#each secrets as secret}
    <li><strong>{secret.name}:</strong> {secret.decrypted}</li>
  {/each}
</ul>

<button on:click={clearSecrets}>Clear All</button>
