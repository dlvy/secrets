import { AuthClient } from '@dfinity/auth-client';
import { canisterId as internetIdentityCanisterId } from '../../../declarations/internet_identity/index.js';
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const principal = writable<string | null>(null);

let authClient: AuthClient | null = null;

export async function initAuth(): Promise<AuthClient> {
  if (!authClient) {
    authClient = await AuthClient.create();
    
    // Check if user is already authenticated
    if (await authClient.isAuthenticated()) {
      const identity = authClient.getIdentity();
      const principalId = identity.getPrincipal().toString();
      
      isAuthenticated.set(true);
      principal.set(principalId);
    }
  }
  
  return authClient;
}

export async function login(): Promise<boolean> {
  const client = await initAuth();
  
  return new Promise((resolve) => {
    client.login({
      identityProvider: `http://localhost:4943/?canisterId=${internetIdentityCanisterId}`,
      onSuccess: async () => {
        const identity = client.getIdentity();
        const principalId = identity.getPrincipal().toString();
        
        isAuthenticated.set(true);
        principal.set(principalId);
        resolve(true);
      },
      onError: (error) => {
        console.error('Authentication failed:', error);
        resolve(false);
      },
    });
  });
}

export async function logout(): Promise<void> {
  const client = await initAuth();
  await client.logout();
  
  isAuthenticated.set(false);
  principal.set(null);
}

export async function getAuthenticatedActor(createActor: Function, canisterId: string) {
  const client = await initAuth();
  
  if (!(await client.isAuthenticated())) {
    throw new Error('User not authenticated');
  }
  
  const identity = client.getIdentity();
  
  return createActor(canisterId, {
    agentOptions: {
      identity,
    }
  });
}
