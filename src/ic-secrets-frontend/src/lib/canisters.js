import { createActor, canisterId } from 'declarations/ic-secrets-backend';
import { getAuthenticatedActor } from './auth';
import { building } from '$app/environment';

function dummyActor() {
    return new Proxy({}, { get() { throw new Error("Canister invoked while building"); } });
}

const buildingOrTesting = building || process.env.NODE_ENV === "test";

export const getBackend = async () => {
    if (buildingOrTesting) {
        return dummyActor();
    }
    return await getAuthenticatedActor(createActor, canisterId);
};
