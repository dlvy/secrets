import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as secrets_idl, canisterId as secrets_id } from '../../../../declarations/ic-secrets-backend';
import type { Secret, _SERVICE } from '../../../../declarations/ic-secrets-backend/ic-secrets-backend.did';
import CryptoJS from 'crypto-js';

export async function createActor(): Promise<_SERVICE> {
  const agent = new HttpAgent();
  if (import.meta.env.DEV) await agent.fetchRootKey();
  return Actor.createActor(secrets_idl, {
    agent,
    canisterId: secrets_id,
  }) as _SERVICE;
}

// Get the principal ID for encryption key derivation
export async function getPrincipalId(): Promise<string> {
  const agent = new HttpAgent();
  if (import.meta.env.DEV) await agent.fetchRootKey();
  const principal = await agent.getPrincipal();
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
