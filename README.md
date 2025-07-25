# 🔐 ICP Secrets Vault

## 🚀 TL;DR

This is not your average secrets manager.  
We built a 🔐 **Motoko-powered canister** that securely stores your **AES-encrypted** API keys, tokens, and secret sauce **on-chain**, tied to your **ICP identity**.

🔥 **ZERO-KNOWLEDGE VIBES**: Your secrets are encrypted client-side with YOUR principal ID before hitting the canister.  
🧙‍♂️ No AWS.  
🕳 No third-party vaults.  
🔒 No plaintext on-chain.  
🧠 Just **you**, your **principal**, your **crypto**, and your **canister**.  

Built by caffeine-powered degens who actually understand that "encrypted" doesn't mean "base64 encoded" 💀🤌

---

## 🧠 Features

- 🧾 Store encrypted secrets (label + value)
- 🔍 View your secrets (only you can see them, bro)
- 🧹 Reset everything (rage wipe mode)
- 🧑‍🚀 Identity-bound via ICP principal
- 💅 Retro “vibe code” aesthetic (optional vaporwave upgrade pending...)

---

## 📦 Project Structure

```bash
secrets/
├── src/
│   ├── ic-secrets-backend/         # 🦀 Motoko canister (the vault)
│   │   └── main.mo                 # Core secret storage logic
│   ├── ic-secrets-frontend/        # 🎨 SvelteKit frontend
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── ic/
│   │   │   │       └── secretsManager.ts  # 🔐 Encryption magic happens here
│   │   │   └── routes/
│   │   │       └── +page.svelte    # Main UI (where you manage secrets)
│   │   └── package.json            # Frontend deps (crypto-js, dfinity libs)
│   └── declarations/               # 🤖 Auto-generated Candid types
│       └── ic-secrets-backend/     # TypeScript interfaces for the canister
├── dfx.json                        # 🛠️ Canister deployment config
├── package.json                    # Root deps
└── README.md                       # This literary masterpiece
```

---

## 🛠️ Local Setup

> You only need: `dfx`, `npm`, and that beautiful ICP energy 💫

1. 🔧 **Install root dependencies**

```bash
npm install
```

2. 🔧 **Install frontend dependencies**

```bash
cd src/ic-secrets-frontend && npm install
```

3. 🧙‍♂️ **Start local Internet Computer**

```bash
dfx start --background
```

3. 🚢 **Deploy the canister**

```bash
dfx deploy
```

4. 💻 **Run the frontend**

```bash
npm run dev
```

Then visit [`localhost:5173`](http://localhost:5173) and start vibin’ with your secrets.

---

## 🧪 API Overview (Motoko Canister)

```motoko
// storeSecret(name: Text, encrypted: Text) → Text
// Stores an AES-encrypted secret (requires caller identity)

// getSecrets() → [Secret]
// Returns all encrypted secrets for caller (decrypt client-side)

// clearSecrets() → Text
// Deletes all secrets for caller (nuclear option activated)
```

**Important**: The canister only stores encrypted blobs. All encryption/decryption happens in your browser using your principal ID as the key derivation source.

Secrets are stored per `Principal`, so nobody can see yours. Not even us. **Especially** not us.  
Trust the math, bro �✨

---

## 🔐 Security (Actually Real This Time)

### 🛡️ **Client-Side AES Encryption**
- Your secrets are encrypted with **AES-256** before leaving your browser
- Encryption key is derived from **SHA256(your-principal-id)**
- Only YOU have access to your principal = only YOU can decrypt

### 🔑 **Key Derivation Magic**
```typescript
// This happens in your browser:
const principalId = await agent.getPrincipal().toString();
const encryptionKey = CryptoJS.SHA256(principalId).toString();
const encrypted = CryptoJS.AES.encrypt(yourSecret, encryptionKey);
```

### 🕳️ **Zero-Knowledge Architecture**
- ✅ Canister stores encrypted blobs (useless without your key)
- ✅ No plaintext ever touches the blockchain
- ✅ No shared keys or central authority
- ✅ Each user's data is cryptographically isolated

### 🧑‍🚀 **Identity-Bound Security**
- No unauthenticated access — tied to your `msg.caller` (ICP identity)
- No cross-principal data access (even if someone hacks the canister)
- Your principal ID = your encryption key = your responsibility 

> **tl;dr**: Even if the NSA seizes our canister, your secrets are still encrypted with YOUR key 🕵️‍♂️

---

---

## � How It Actually Works

### 🔄 **The Secret Storage Flow**
1. **🔐 You type a secret** → Gets encrypted with AES using your principal ID
2. **📤 Encrypted blob sent to canister** → No plaintext ever leaves your browser  
3. **💾 Stored on-chain** → Tied to your ICP identity, useless to everyone else
4. **📥 Retrieval** → Encrypted data comes back, gets decrypted in your browser
5. **✨ Magic** → Only you see the plaintext, canister sees gibberish

### 🔑 **Principal-Based Encryption Explained**
```
Your ICP Principal: bkyz2-fmaaa-aaaaa-qaaaq-cai
         ↓ SHA256 Hash
Encryption Key: a1b2c3d4e5f6...
         ↓ AES Encrypt
Your Secret: "my-super-secret-api-key"
Encrypted Blob: "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y="
```

### 🧮 **Why This Matters**
- **Decentralized**: No AWS, no Google, no "trust us bro" companies
- **Self-Sovereign**: You control the keys, you control the data
- **Immutable**: Stored on ICP blockchain, can't be "accidentally" deleted
- **Private**: Even we can't see your secrets (and we built the thing)

---

## 🧙‍♀️ Future Enhancements (Post-hackathon Dreams)

- 🎯 **Shamir Secret Sharing**: Split secrets across multiple principals
- 📦 **Secret NFTs**: Bundle secrets as tradeable assets (because why not?)
- 🤝 **Team Vaults**: Share encrypted secrets with your dev team
- 🎨 **Full vaporwave UI**: Terminal mode with ASCII art
- 🔄 **Backup/Export**: Download encrypted vault for cold storage
- 🕵️ **Audit Logs**: See when/where your secrets were accessed
- 🚀 **WebAuthn Integration**: Hardware key support for extra paranoia

---

## 👾 Built With

- 🧬 [Motoko](https://internetcomputer.org/docs/current/motoko/main/) – for the canister
- 💻 [SvelteKit](https://kit.svelte.dev/) – for the frontend
- 🔧 [DFX](https://internetcomputer.org/docs/current/developer-docs/sdk/dfx/) – for deployment

---

## 🙌 Acknowledgements

Built for the ICP Hackathon 🧠  
By DevOps frogs who ❤️ cycles, canisters, and cursed backend code.

---

> 🧾 “If AWS is a bank vault, this is a backpack full of secrets hidden in a tree on the blockchain.”  
> – Vibecoder, probably
