import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "../components/motion";
import { contracts } from "../data/contracts";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileCode2,
  ShieldCheck,
  TestTube2,
  Wallet,
  X,
  Check,
} from "lucide-react";
import { getAddress, requestAccess } from "@stellar/freighter-api";

const escrowSource = `use soroban_sdk::{
    contract,
    contractimpl,
    contracttype,
    token,
    Address,
    Env,
};

#[derive(Clone)]
#[contracttype]
pub struct Escrow {
    pub sender: Address,
    pub receiver: Address,
    pub token: Address,
    pub amount: i128,
    pub deadline: u64,
    pub released: bool,
}

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Escrow(u64),
    NextId,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn create(
        env: Env,
        sender: Address,
        receiver: Address,
        token_address: Address,
        amount: i128,
        deadline: u64,
    ) -> u64 {
        sender.require_auth();

        assert!(amount > 0, "amount must be greater than zero");

        assert!(
            deadline > env.ledger().timestamp(),
            "deadline must be in the future"
        );

        let id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextId)
            .unwrap_or(0);

        let next_id = id + 1;

        let token_client = token::Client::new(&env, &token_address);

        token_client.transfer(
            &sender,
            &env.current_contract_address(),
            &amount,
        );

        let escrow = Escrow {
            sender,
            receiver,
            token: token_address,
            amount,
            deadline,
            released: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Escrow(id), &escrow);

        env.storage()
            .instance()
            .set(&DataKey::NextId, &next_id);

        id
    }

    pub fn release(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);

        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        escrow.receiver.require_auth();

        assert!(!escrow.released, "escrow already completed");

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.receiver,
            &escrow.amount,
        );

        escrow.released = true;

        env.storage()
            .persistent()
            .set(&key, &escrow);
    }

    pub fn refund(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);

        let escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        escrow.sender.require_auth();

        assert!(!escrow.released, "escrow already completed");

        assert!(
            env.ledger().timestamp() >= escrow.deadline,
            "escrow deadline has not passed"
        );

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.sender,
            &escrow.amount,
        );

        env.storage().persistent().remove(&key);
    }

    pub fn get_escrow(env: Env, escrow_id: u64) -> Escrow {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .expect("escrow not found")
    }
}`;

function ContractDetails() {
  const { id } = useParams();
  const contract = contracts[id];

  const [copied, setCopied] = useState("");
  const [showInteraction, setShowInteraction] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");
  const [connecting, setConnecting] = useState(false);

  if (!contract) {
    return (
      <main className="min-h-screen px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/contracts"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to contracts
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <Code2 className="mx-auto mb-4 text-slate-500" size={36} />

            <h1 className="text-2xl font-semibold text-white">
              Contract not found
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              The contract you're looking for isn't available in the registry.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isEscrow = id === "escrow";

  const sourceCode = isEscrow
    ? escrowSource
    : `// ${contract.name} smart contract
//
// Source implementation is available in the registry.
//`;

  const copyToClipboard = async (value, type) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(type);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch {
      setCopied("");
    }
  };

  const connectWallet = async () => {
    setConnecting(true);
    setWalletError("");

    try {
      let result = await getAddress();

      if (result?.error || !result?.address) {
        result = await requestAccess();
      }

      if (result?.error) {
        throw new Error(result.error.message || "Unable to connect wallet");
      }

      if (!result?.address) {
        throw new Error("No wallet address was returned");
      }

      setWalletAddress(result.address);
    } catch (error) {
      setWalletError(
        error?.message || "Unable to connect to Freighter wallet."
      );
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            to="/contracts"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to contracts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  {contract.category}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <CheckCircle2 size={13} />
                  {contract.status}
                </span>

                {contract.network && (
                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
                    {contract.network}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {contract.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                {contract.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {contract.contractId && (
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(contract.contractId, "contract")
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  {copied === "contract" ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} />
                  )}

                  {copied === "contract" ? "Copied" : "Copy ID"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowInteraction((value) => !value)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
              >
                {showInteraction ? <X size={16} /> : <Code2 size={16} />}

                {showInteraction ? "Close Contract" : "Use Contract"}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Contract ID */}
        {contract.contractId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-6 rounded-2xl border border-blue-400/10 bg-blue-400/[0.025] p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Contract ID
                </p>

                <code className="block overflow-x-auto whitespace-nowrap font-mono text-xs text-blue-300 sm:text-sm">
                  {contract.contractId}
                </code>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(contract.contractId, "contract")
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {copied === "contract" ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied === "contract" ? "Copied" : "Copy"}
                </button>

                <a
                  href={`https://lab.stellar.org/r/testnet/contract/${contract.contractId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Stellar Lab
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contract interaction */}
        {showInteraction && (
          <motion.section
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/[0.08] via-white/[0.025] to-violet-500/[0.06] p-6 backdrop-blur-xl sm:p-7"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10">
                    <Wallet size={19} className="text-blue-300" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      Use {contract.name}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Interact with the deployed Soroban contract
                    </p>
                  </div>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-400">
                  Connect your Stellar wallet to interact with this contract
                  on Testnet. Transactions require your wallet to approve and
                  sign them.
                </p>
              </div>

              {!walletAddress ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={connecting}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Wallet size={17} />

                  {connecting ? "Connecting..." : "Connect Freighter"}
                </button>
              ) : (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-emerald-300">
                    <CheckCircle2 size={14} />
                    Wallet Connected
                  </div>

                  <code className="font-mono text-xs text-slate-300">
                    {walletAddress.slice(0, 8)}...
                    {walletAddress.slice(-8)}
                  </code>
                </div>
              )}
            </div>

            {walletError && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                {walletError}
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {contract.functions.map((func) => (
                <div
                  key={func}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <Code2 size={16} className="mb-3 text-cyan-400" />

                  <code className="text-sm font-medium text-white">
                    {func}()
                  </code>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {func === "create" &&
                      "Create a new escrow and lock XLM."}

                    {func === "get_escrow" &&
                      "Read an existing escrow from the contract."}

                    {func === "release" &&
                      "Release escrow funds to the receiver."}

                    {func === "refund" &&
                      "Refund the sender after the deadline."}
                  </p>
                </div>
              ))}
            </div>

            {isEscrow && (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-black/20 p-5">
                <p className="text-sm font-medium text-white">
                  Escrow interaction
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Wallet connection is ready. The transaction forms for
                  creating, viewing, releasing, and refunding an escrow will
                  use the deployed Testnet contract above.
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* Main grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10">
                <FileCode2 size={19} className="text-blue-300" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Contract Overview
                </h2>

                <p className="text-xs text-slate-500">
                  What this contract provides
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-400">
              {contract.longDescription}
            </p>

            <div className="mt-7">
              <h3 className="mb-3 text-sm font-medium text-slate-200">
                Contract functions
              </h3>

              <div className="grid gap-2 sm:grid-cols-2">
                {contract.functions.map((func) => (
                  <div
                    key={func}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-4 py-3"
                  >
                    <Code2 size={15} className="text-cyan-400" />

                    <code className="text-xs text-slate-300">
                      {func}()
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {contract.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Stats */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck size={19} className="text-emerald-400" />

                <span className="text-sm font-medium text-white">
                  Verification
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {contract.tests}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    tests passing
                  </p>
                </div>

                <CheckCircle2 size={30} className="text-emerald-400" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <TestTube2 size={19} className="text-violet-400" />

                <span className="text-sm font-medium text-white">
                  Test Status
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Automated tests
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Passing
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Version
                </span>

                <span className="font-mono text-sm text-white">
                  {contract.version}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Language
                </span>

                <span className="text-sm text-white">
                  Rust
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Platform
                </span>

                <span className="text-sm text-white">
                  Soroban
                </span>
              </div>

              {contract.network && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Network
                  </span>

                  <span className="text-sm text-white">
                    {contract.network}
                  </span>
                </div>
              )}
            </div>
          </motion.aside>
        </div>

        {/* Source */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Code2 size={19} className="text-cyan-400" />

                <h2 className="font-semibold text-white">
                  Source Code
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {isEscrow
                  ? "Actual Soroban Rust implementation deployed on Stellar Testnet."
                  : "Source implementation for this registry contract."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(sourceCode, "source")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                {copied === "source" ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}

                {copied === "source" ? "Copied" : "Copy Source"}
              </button>

              {contract.contractId && (
                <a
                  href={`https://lab.stellar.org/r/testnet/contract/${contract.contractId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  Stellar Lab
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>

          <div
            id="source"
            className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#030611]"
          >
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />

              <span className="ml-2 font-mono">
                {contract.source}
              </span>
            </div>

            <div className="max-h-[600px] overflow-auto p-5">
              <pre className="font-mono text-xs leading-6 text-slate-400">
                <code>{sourceCode}</code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Verification note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex gap-3 rounded-xl border border-blue-400/10 bg-blue-400/[0.03] p-4"
        >
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-blue-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            <span className="font-medium text-slate-300">
              Verification note:
            </span>{" "}
            “Verified” means the contract's automated test suite is passing.
            It does not mean the contract has been independently security
            audited.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default ContractDetails;