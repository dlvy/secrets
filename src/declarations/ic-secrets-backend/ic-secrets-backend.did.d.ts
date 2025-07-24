import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Secret { 'name' : string, 'encrypted' : string }
export interface _SERVICE {
  'clearSecrets' : ActorMethod<[], string>,
  'getSecrets' : ActorMethod<[], Array<Secret>>,
  'storeSecret' : ActorMethod<[string, string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
