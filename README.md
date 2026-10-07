# ⚡ Stellar Contracts Registry

> **Discover. Explore. Understand. Build on Stellar.**

A developer-focused **smart contract registry and explorer for the Stellar network**, built to make Soroban smart contracts easier to discover, search, inspect, and understand.

Stellar Contracts Registry brings contract discovery, metadata, function exploration, wallet address scanning, and Stellar wallet connectivity into one clean developer experience.

---

## ✨ Why Stellar Contracts Registry?

Finding and understanding smart contracts shouldn't require digging through repositories, explorers, or raw blockchain data.

**Stellar Contracts Registry** provides a dedicated place to discover and explore contracts deployed on Stellar.

Whether you're a developer looking for an existing contract, a builder researching Soroban patterns, or someone inspecting a Stellar wallet, the goal is simple:

> **Make Stellar smart contracts easier to find and easier to understand.**

---

## 🚀 Features

### 🔎 Smart Contract Discovery

Browse and search registered Stellar smart contracts through a developer-friendly interface.

* Search contracts
* Browse contract categories
* View contract metadata
* Explore deployed contracts
* Inspect contract functions
* View contract addresses

### 📜 Contract Explorer

Dive into individual smart contracts and understand what they do.

Explore:

* Contract information
* Contract address
* Network
* Available functions
* Contract categories
* Function inputs and outputs
* Deployment information

### 👛 Wallet Address Scanner

Inspect Stellar wallet addresses directly from the application.

Enter a Stellar address to explore relevant on-chain information and quickly understand the wallet you're working with.

### 🔐 Stellar Wallet Integration

Connect your Stellar wallet directly to the application.

Designed around the Stellar ecosystem and compatible with wallet providers such as **Freighter**.

### 🧩 Soroban Smart Contracts

The project includes real Soroban smart contracts demonstrating common programmable-money primitives:

* **Escrow**
* **Timelock**
* **Vesting**

These contracts provide practical examples of how programmable assets can be implemented on Stellar.

### 🌐 Stellar Testnet

The project currently focuses on the **Stellar Testnet**, allowing development and experimentation without risking real assets.

---

## 🎨 Design

Stellar Contracts Registry is designed as a modern developer platform rather than a traditional blockchain explorer.

The interface uses:

* 🌑 Dark navy / black foundation
* ⚡ Electric blue accents
* 🟣 Purple gradients
* 🩵 Cyan highlights
* ✨ Glassmorphism
* 🌐 Subtle grid effects
* 💫 Smooth Framer Motion animations
* 📱 Responsive layouts

The goal is a visual experience that feels like a **developer control center for the Stellar ecosystem**.

---

## 🏗️ Architecture

```text
stellar-contracts/
│
├── contracts/
│   ├── src/
│   │   ├── escrow.rs
│   │   ├── timelock.rs
│   │   ├── vesting.rs
│   │   └── lib.rs
│   │
│   ├── test/
│   ├── Cargo.toml
│   └── Cargo.lock
│
└── frontend/
    ├── src/
    ├── components/
    ├── pages/
    └── ...
```

The project is split into two primary layers:

### Frontend

Responsible for:

* Contract discovery
* Contract exploration
* Wallet connection
* Address scanning
* UI interactions
* Animations
* Responsive experience

### Soroban Contracts

Contains the project's Rust-based smart contracts built for the Stellar ecosystem.

---

## 🛠️ Tech Stack

### Frontend

| Technology    | Purpose                        |
| ------------- | ------------------------------ |
| React         | Application UI                 |
| Tailwind CSS  | Styling                        |
| Framer Motion | Animations                     |
| Stellar SDK   | Stellar blockchain interaction |
| Freighter API | Wallet integration             |

### Smart Contracts

| Technology  | Purpose                         |
| ----------- | ------------------------------- |
| Rust        | Smart contract development      |
| Soroban     | Stellar smart contract platform |
| Stellar SDK | Stellar ecosystem interaction   |

---

## 📦 Smart Contracts

### 🔒 Escrow

A programmable escrow primitive designed to hold funds until predefined conditions are satisfied.

Useful for concepts such as:

* Peer-to-peer payments
* Marketplace transactions
* Conditional payments
* Trustless agreements

### ⏳ Timelock

A contract primitive that restricts access to funds until a predefined time.

Useful for:

* Scheduled payments
* Locked allocations
* Delayed transfers
* Time-based financial agreements

### 🌱 Vesting

A programmable vesting primitive for releasing funds according to a schedule.

Useful for:

* Token allocations
* Team incentives
* Grants
* Contributor rewards
* Long-term distributions

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Rust
* Cargo
* Stellar CLI / Soroban tooling
* Freighter wallet

### Clone the repository

```bash
git clone https://github.com/doctorlight0/stellar-contracts-.git

cd stellar-contracts-
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

### Start the development server

```bash
npm run dev
```

---

## 🦀 Smart Contract Development

Navigate to the contracts directory:

```bash
cd contracts
```

Check the Rust project:

```bash
cargo check
```

Run the test suite:

```bash
cargo test
```

Build the contracts:

```bash
cargo build
```

> Build artifacts generated under `target/` are intentionally excluded from Git.

---

## 🌐 Network

The project currently targets:

```text
Network: Stellar Testnet
```

This allows the application and contracts to be developed and tested without interacting with production assets.

---

## 🧠 Project Philosophy

Stellar has powerful smart-contract capabilities, but developers still need good tools for discovering and understanding what has already been built.

Stellar Contracts Registry is built around three principles:

### 01 — Discoverability

Smart contracts should be easy to find.

### 02 — Understandability

Developers should be able to quickly understand what a contract does and how its functions work.

### 03 — Accessibility

Interacting with Stellar should feel approachable whether you're an experienced blockchain developer or just getting started with Soroban.

---

## 🗺️ Roadmap

### ✅ Phase 1 — Foundation

* [x] React frontend
* [x] Stellar integration
* [x] Wallet connection
* [x] Dark developer UI
* [x] Soroban contract foundation
* [x] Escrow contract
* [x] Timelock contract
* [x] Vesting contract

### 🚧 Phase 2 — Registry

* [x] Contract discovery UI
* [x] Contract categories
* [x] Contract explorer
* [x] Wallet address scanner
* [ ] Contract registration flow
* [ ] Contract metadata persistence
* [ ] Contract verification

### 🔭 Phase 3 — Developer Platform

* [ ] Advanced contract search
* [ ] Function interaction interface
* [ ] Contract activity
* [ ] Contract reputation / trust signals
* [ ] Developer profiles
* [ ] API access
* [ ] Mainnet support

---

## 🤝 Contributing

Contributions are welcome.

If you find a bug, have an idea, or want to improve the project:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "feat: add your feature"
```

5. Push your branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 🔐 Disclaimer

This project is currently intended for **development and experimentation on Stellar Testnet**.

Do not use testnet contracts or assets as production infrastructure.

Always review and audit smart contracts before using them with real assets.

---

## ⚡ Built for Stellar

Stellar Contracts Registry is an open-source experiment focused on making the **Soroban smart-contract ecosystem more discoverable and developer-friendly**.

Built with:

**React · Rust · Soroban · Stellar · Tailwind CSS · Framer Motion**

---

<p align="center">

### ⚡ Discover contracts. Understand Soroban. Build on Stellar.

</p>
