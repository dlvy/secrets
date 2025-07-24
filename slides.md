% ICP Secrets Vault
% 🔐 Built for ICP Hackathon
% July 2025

# 👥 Team & Pitch

- 🧠 DevOps frogs, blockchain degenerates
- 🛠 Built for ICP Hackathon
- 😤 Tired of fake "encryption"
- 🔐 Real AES, client-side, on-chain

---

# 😱 The Problem

- Secrets managers today = centralized honeypots  
- Many just use `btoa()` and call it "encryption" 💀  
- Trusting 3rd parties with your API keys?  
- Plaintext vaults? Not in this timeline.

---

# ✅ Our Solution

- 🧑‍🚀 Identity-bound ICP Secrets Vault  
- 🔐 AES-256, encrypted client-side  
- 🛡 Zero-knowledge canister  
- 📦 Fully decentralized and paranoid by design  

---

# 🗺 Roadmap

- ✅ Hackathon MVP (working!)
- 🔄 Shamir Secret Sharing
- 🤝 Team Vaults
- 🔄 Backup/export
- 🎨 Full vaporwave terminal UI
- 🕵️ Audit logs & WebAuthn

---

# 🧠 Features

- 🔐 AES-256 encryption (real crypto, no LARP)
- 🔑 Principal-based keys
- 👀 View secrets (only you)
- 🔄 Rage wipe mode
- 🛡 Zero-knowledge backend
- 💅 TypeScript bindings (auto-generated)

---

# 🚀 TL;DR

> This ain't AWS Secrets Manager.

- Encrypted with **your principal ID**
- Stored **on-chain** in a **Motoko canister**
- Only you can decrypt — math over marketing

---

# 🔧 Local Setup

```bash
npm install
cd src/ic-secrets-frontend && npm install
dfx start --background
dfx deploy
npm run dev
```

Visit `localhost:5173` and vibe 🧘

---

# 🔐 API Overview

```motoko
storeSecret(name, encrypted) // Store encrypted blob
getSecrets()                // Return all secrets for caller
clearSecrets()              // Delete all caller secrets
```

Everything encrypted in browser using `CryptoJS.AES`.

---

# 📦 Project Structure

```bash
secrets/
├── src/ic-secrets-backend/     # 🦀 Motoko canister
├── src/ic-secrets-frontend/    # 🎨 SvelteKit frontend
├── declarations/               # 🤖 TypeScript bindings
├── dfx.json                    # 🔧 Deployment config
└── README.md                   # 🧾 The manifesto
```

---

# 🔐 Security Architecture

### 🛡 Client-Side AES

```ts
const principalId = await agent.getPrincipal().toString();
const key = CryptoJS.SHA256(principalId);
const encrypted = CryptoJS.AES.encrypt(secret, key);
```

---

### 🧠 Zero-Knowledge

- ✅ Canister sees ciphertext only
- ✅ No plaintext ever leaves browser
- ✅ Each user’s secrets = isolated
- ✅ Principal ID is the key

> Not even we can read your secrets.

---

# 🧮 Why This Matters

- 🔓 No AWS
- 🧠 You own your secrets
- ⛓ On-chain = immutable
- 🕵️ No backdoors

---

# 👾 Built With

- 🧬 Motoko – the canister brain
- 💻 SvelteKit – slick frontend
- 🔐 crypto-js – AES magic
- 🔧 DFX – deploy wizardry

---

# 🙌 Acknowledgements

> “If AWS is a vault, this is a secret cache buried in the woods and only you know the coordinates.”

Thanks to:
- 🧠 ICP cycles
- 🧙 Motoko wizards
- ☕ Caffeine + crypto paranoia

---

# 🙏 Thank You

Built for the degens.  
Secured by your principal.  
Encrypted like your life depends on it.

🔥 ICP Hackathon 2025 🔥

