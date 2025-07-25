<script lang="ts">
  import { onMount } from 'svelte';
  import { storeEncryptedSecret, getDecryptedSecrets, createActor, shareSecretWithPrincipal, getDecryptedSharedSecrets, clearSharedSecrets } from '$lib/ic/secretsManager';
  import { browser } from '$app/environment';
  import { login, logout, isAuthenticated, principal, initAuth } from '$lib/auth';

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
  let authenticated = false;
  let userPrincipal = '';

  // Subscribe to authentication state
  $: authenticated = $isAuthenticated;
  $: userPrincipal = $principal || '';

  onMount(async () => {
    if (browser) {
      await initAuth();
      if ($isAuthenticated) {
        await loadData();
      }
    }
  });

  async function loadData() {
    if (!$isAuthenticated) return;
    
    try {
      actor = await createActor();
      await loadSecrets();
      await loadSharedSecrets();
    } catch (error) {
      console.error('Failed to load data:', error);
      message = 'Failed to load data. Please try logging in again.';
    }
  }

  async function handleLogin() {
    try {
      const success = await login();
      if (success) {
        message = 'Successfully logged in!';
        await loadData();
      } else {
        message = 'Login failed. Please try again.';
      }
    } catch (error) {
      console.error('Login error:', error);
      message = 'Login failed. Please try again.';
    }
  }

  async function handleLogout() {
    try {
      await logout();
      secrets = [];
      sharedSecrets = [];
      message = 'Successfully logged out!';
    } catch (error) {
      console.error('Logout error:', error);
      message = 'Logout failed.';
    }
  }

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
    if (!$isAuthenticated) {
      message = 'Please log in first';
      return;
    }
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
    if (!$isAuthenticated || !actor) {
      message = 'Please log in first';
      return;
    }
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
    if (!$isAuthenticated) {
      message = 'Please log in first';
      return;
    }
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
    if (!$isAuthenticated) {
      message = 'Please log in first';
      return;
    }
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

{#if !authenticated}
  <div class="auth-section">
    <h2>🔑 Please authenticate to access your secrets</h2>
    <p>You need to log in with Internet Identity to store and access your encrypted secrets.</p>
    <button on:click={handleLogin} class="login-btn">🚀 Login with Internet Identity</button>
  </div>
{:else}
  <div class="user-info">
    <p><strong>🧑‍🚀 Principal:</strong> {userPrincipal}</p>
    <button on:click={handleLogout} class="logout-btn">🚪 Logout</button>
  </div>

  <h2>💾 Store New Secret</h2>
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
{/if}

<style>
  .auth-section {
    text-align: center;
    padding: 2rem;
    border: 2px dashed #ccc;
    border-radius: 8px;
    margin: 2rem 0;
  }
  
  .login-btn {
    background: #007AFF;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .login-btn:hover {
    background: #0056b3;
  }
  
  .user-info {
    background: #f0f8ff;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logout-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .logout-btn:hover {
    background: #c82333;
  }
</style>
