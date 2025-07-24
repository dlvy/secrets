import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as secrets_idl, canisterId as secrets_id } from '../../../declarations/ic_secrets_backend';

export async function createActor() {
  const agent = new HttpAgent();
  if (import.meta.env.DEV) await agent.fetchRootKey();
  return Actor.createActor(secrets_idl, {
    agent,
    canisterId: secrets_id,
  });
}
