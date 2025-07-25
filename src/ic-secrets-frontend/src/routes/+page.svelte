<script lang="ts">
  import { onMount } from 'svelte';
  import { storeEncryptedSecret, getDecryptedSecrets, createActor, shareSecretWithPrincipal, getDecryptedSharedSecrets, clearSharedSecrets } from '$lib/ic/secretsManager';
  import { browser } from '$app/environment';

  /** @type {Array<{name: string, decrypted: string, encrypted: string}>} */
  let secrets = [];
  /** @type {Array<{name: string, decrypted: string, encrypted: string, sharedBy: string}>} */
  let sharedSecrets = [];
  let name = '';
  let value = '';
  let message = '';
  
  // Sharing form variables
  let shareSecretName = '';
  let shareSecretValue = '';
  let recipientPrincipal = '';
  let shareMessage = '';

  let actor;
  onMount(async () => {
    if (browser) {
      actor = await createActor();
      await loadSecrets();
      await loadSharedSecrets();
    }
  });

  async function loadSecrets() {
    try {
      secrets = await getDecryptedSecrets();      } catch (error) {
        console.error('Failed to load secrets:', error);
        message = 'Failed to load secrets';
      }
  }

  async function loadSharedSecrets() {
    try {
      sharedSecrets = await getDecryptedSharedSecrets();
    } catch (error) {
      console.error('Failed to load shared secrets:', error);
      message = 'Failed to load shared secrets';
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
      message = 'Failed to store secret';
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
      message = 'Failed to clear secrets';
    }
  }

  async function shareSecret() {
    if (!actor) return;
    try {
      const response = await shareSecretWithPrincipal(shareSecretName, shareSecretValue, recipientPrincipal);
      await loadSharedSecrets();
      shareMessage = response;
      shareSecretName = '';
      shareSecretValue = '';
      recipientPrincipal = '';
    } catch (error) {
      console.error('Failed to share secret:', error);
      shareMessage = 'Failed to share secret';
    }
  }

  async function clearSharedSecretsHandler() {
    if (!actor) return;
    try {
      await clearSharedSecrets();
      sharedSecrets = [];
      message = 'All shared secrets cleared';
    } catch (error) {
      console.error('Failed to clear shared secrets:', error);
      message = 'Failed to clear shared secrets';
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

<hr />

<h2>🤝 Share Secret</h2>
<form on:submit|preventDefault={shareSecret}>
  <input placeholder="Secret name" bind:value={shareSecretName} required />
  <input placeholder="Secret value (will be encrypted)" type="password" bind:value={shareSecretValue} required />
  <input placeholder="Recipient principal ID" bind:value={recipientPrincipal} required />
  <button>Share Secret</button>
</form>

{#if shareMessage}
  <p><strong>{shareMessage}</strong></p>
{/if}

<h2>🔗 Secrets Shared With You</h2>
<ul>
  {#each sharedSecrets as secret}
    <li><strong>{secret.name}:</strong> {secret.decrypted} <em>(shared by {secret.sharedBy})</em></li>
  {/each}
</ul>

<button on:click={clearSharedSecretsHandler}>Clear Shared Secrets</button>
