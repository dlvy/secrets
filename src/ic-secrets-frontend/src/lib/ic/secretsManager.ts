import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as secrets_idl, canisterId as secrets_id } from '../../../../declarations/ic-secrets-backend/index.js';
import type { Secret, SharedSecret, _SERVICE } from '../../../../declarations/ic-secrets-backend/ic-secrets-backend.did';
import CryptoJS from 'crypto-js';
import { getAuthenticatedActor, initAuth } from '../auth';

export async function createActor(): Promise<_SERVICE> {
  return getAuthenticatedActor(
    (canisterId: string, options: any) => Actor.createActor(secrets_idl, {
      canisterId,
      ...options,
    }),
    secrets_id
  ) as Promise<_SERVICE>;
}

// Get the principal ID for encryption key derivation
export async function getPrincipalId(): Promise<string> {
  const authClient = await initAuth();
  
  if (!(await authClient.isAuthenticated())) {
    throw new Error('Cannot store secrets with anonymous principal. Please authenticate first.');
  }
  
  const identity = authClient.getIdentity();
  const principal = identity.getPrincipal();
  
  // Check if we have an anonymous principal (which would indicate no authentication)
  if (principal.isAnonymous()) {
    throw new Error('Cannot store secrets with anonymous principal. Please authenticate first.');
  }
  
  return principal.toString();
}

// Derive encryption key from principal ID
function deriveEncryptionKey(principalId: string): string {
  // Use SHA256 to create a consistent key from the principal ID
  return CryptoJS.SHA256(principalId).toString();
}

// Encrypt data using AES with principal-derived key
export async function encryptData(data: string): Promise<string> {
  try {
    const principalId = await getPrincipalId();
    const key = deriveEncryptionKey(principalId);
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data using AES with principal-derived key
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const principalId = await getPrincipalId();
    const key = deriveEncryptionKey(principalId);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const originalData = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!originalData) {
      throw new Error('Invalid encrypted data or wrong key');
    }
    
    return originalData;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Store secret with client-side encryption
export async function storeEncryptedSecret(name: string, plainTextValue: string): Promise<string> {
  const actor = await createActor();
  const encryptedValue = await encryptData(plainTextValue);
  return await actor.storeSecret(name, encryptedValue);
}

// Get secrets and decrypt them client-side
export async function getDecryptedSecrets(): Promise<Array<{name: string, decrypted: string, encrypted: string}>> {
  const actor = await createActor();
  const secrets = await actor.getSecrets();
  
  const decryptedSecrets = await Promise.all(
    secrets.map(async (secret: Secret) => {
      try {
        const decrypted = await decryptData(secret.encrypted);
        return {
          name: secret.name,
          decrypted: decrypted,
          encrypted: secret.encrypted
        };
      } catch (error) {
        console.error(`Failed to decrypt secret "${secret.name}":`, error);
        return {
          name: secret.name,
          decrypted: '[Decryption Failed]',
          encrypted: secret.encrypted
        };
      }
    })
  );
  
  return decryptedSecrets;
}

// Encrypt data for a specific principal (for sharing)
export async function encryptDataForPrincipal(data: string, recipientPrincipalId: string): Promise<string> {
  try {
    const key = CryptoJS.SHA256(recipientPrincipalId).toString();
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption for recipient failed:', error);
    throw new Error('Failed to encrypt data for recipient');
  }
}

// Share a secret with another principal
export async function shareSecretWithPrincipal(secretName: string, plainTextValue: string, recipientPrincipalId: string): Promise<string> {
  const actor = await createActor();
  const encryptedForRecipient = await encryptDataForPrincipal(plainTextValue, recipientPrincipalId);
  const recipientPrincipal = Principal.fromText(recipientPrincipalId);
  return await actor.shareSecret(secretName, encryptedForRecipient, recipientPrincipal);
}

// Get shared secrets and decrypt them client-side
export async function getDecryptedSharedSecrets(): Promise<Array<{name: string, decrypted: string, encrypted: string, sharedBy: string}>> {
  const actor = await createActor();
  const sharedSecrets = await actor.getSharedSecrets();
  
  const decryptedSharedSecrets = await Promise.all(
    sharedSecrets.map(async (secret: SharedSecret) => {
      try {
        const decrypted = await decryptData(secret.encrypted);
        return {
          name: secret.name,
          decrypted: decrypted,
          encrypted: secret.encrypted,
          sharedBy: secret.sharedBy.toString()
        };
      } catch (error) {
        console.error(`Failed to decrypt shared secret "${secret.name}":`, error);
        return {
          name: secret.name,
          decrypted: '[Decryption Failed]',
          encrypted: secret.encrypted,
          sharedBy: secret.sharedBy.toString()
        };
      }
    })
  );
  
  return decryptedSharedSecrets;
}

// Clear shared secrets
export async function clearSharedSecrets(): Promise<string> {
  const actor = await createActor();
  return await actor.clearSharedSecrets();
}
