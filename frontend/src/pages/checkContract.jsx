import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { motion } from "../components/motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  ExternalLink,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  FileCode2,
  Layers3,
  Activity,
} from "lucide-react";

const horizonServer = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

const sorobanServer = new StellarSdk.rpc.Server(
  "https://soroban-testnet.stellar.org"
);

function detectInputType(value) {
  const input = value.trim();

  if (input.startsWith("G")) return "wallet";
  if (input.startsWith("C")) return "contract";

  return null;
}

function CheckContract() {
  const [contractId, setContractId] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async (event) => {
    event.preventDefault();

    const input = contractId.trim();

    if (!input) return;

    const type = detectInputType(input);

    if (!type) {
      setError(
        "Enter a valid Stellar wallet address or Soroban contract ID."
      );
      setResult(null);
      return;
    }

    setError("");
    setChecking(true);
    setResult(null);

    try {
      if (type === "wallet") {
        await scanWallet(input);
      }

      if (type === "contract") {
        await scanContract(input);
      }
    } catch (error) {
      console.error("Scanner error:", error);

      setError(
        type === "wallet"
          ? "Could not find this wallet on Stellar Testnet."
          : "Could not find this contract on Stellar Testnet."
      );
    } finally {
      setChecking(false);
    }
  };

  const scanWallet = async (address) => {
    const account = await horizonServer.loadAccount(address);

    const nativeBalance = account.balances.find(
      (balance) => balance.asset_type === "native"
    );

    const assets = account.balances.filter(
      (balance) => balance.asset_type !== "native"
    );

    const transactions = await horizonServer
      .transactions()
      .forAccount(address)
      .order("desc")
      .limit(10)
      .call();

    setResult({
      type: "wallet",
      id: address,
      network: "Stellar Testnet",
      balance: nativeBalance?.balance ?? "0",
      assets,
      transactionCount: transactions.records.length,
      transactions: transactions.records,
      sequence: account.sequence,
    });
  };

  const scanContract = async (address) => {
    const instance = await sorobanServer.getContractInstance(address);

    let wasmSize = null;

    try {
      const wasm = await sorobanServer.getContractWasmByContractId(
        address
      );

      wasmSize = wasm.length;
    } catch {
      // Built-in Stellar Asset Contracts do not have Wasm bytecode.
      wasmSize = null;
    }

    let methods = [];

    try {
      methods = await sorobanServer.getContractMethods(address);
    } catch {
      methods = [];
    }

    setResult({
      type: "contract",
      id: address,
      network: "Stellar Testnet",
      executableType: instance.executable.type,
      wasmSize,
      methods,
    });
  };

  const handleClear = () => {
    setContractId("");
    setResult(null);
    setError("");
  };

  const isWallet = result?.type === "wallet";
  const isContract = result?.type === "contract";

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-lg shadow-cyan-500/10">
            <Search size={26} className="text-cyan-300" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
            <Sparkles size={13} className="text-cyan-400" />
            Stellar Testnet Scanner
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Scan Stellar
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Enter a Stellar wallet address or Soroban contract ID to inspect
            its live on-chain details.
          </p>
        </motion.section>

        {/* Search */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.45,
          }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <form onSubmit={handleCheck}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={contractId}
                    onChange={(event) => {
                      setContractId(event.target.value);
                      setError("");
                    }}
                    placeholder="Paste wallet address or contract ID..."
                    className="h-12 w-full rounded-xl border border-transparent bg-black/20 pl-11 pr-4 font-mono text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/20 focus:bg-black/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!contractId.trim() || checking}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  {checking ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Scanning
                    </>
                  ) : (
                    <>
                      Scan
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error ? (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-red-400">
              <span>{error}</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-600">
              <Code2 size={13} />
              Stellar Testnet only
            </div>
          )}
        </motion.section>

        {/* Empty state */}
        {!result && !checking && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3"
          >
            <InfoCard
              icon={<Wallet size={18} />}
              title="1. Enter Address"
              description="Paste a Stellar wallet address or Soroban contract ID."
            />

            <InfoCard
              icon={<Search size={18} />}
              title="2. Scan"
              description="We identify the address type and inspect the Testnet."
            />

            <InfoCard
              icon={<CheckCircle2 size={18} />}
              title="3. Explore"
              description="View live information retrieved from Stellar."
            />
          </motion.section>
        )}

        {/* Loading */}
        {checking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            </div>

            <h2 className="mt-5 font-semibold text-white">
              Scanning Stellar...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Looking up live data on Stellar Testnet.
            </p>
          </motion.div>
        )}

        {/* Result */}
        {result && !checking && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-10 max-w-3xl"
          >
            {/* Result banner */}
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 shadow-lg shadow-cyan-500/5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                    {isWallet ? (
                      <Wallet size={25} className="text-cyan-400" />
                    ) : (
                      <FileCode2 size={25} className="text-cyan-400" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-400/70">
                      Scan result
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-white">
                      {isWallet ? "Wallet Found" : "Contract Found"}
                    </h2>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {isWallet ? "Wallet" : "Soroban Contract"}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {isWallet ? "Wallet Details" : "Contract Details"}
                </h3>

                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  Scan another
                </button>
              </div>

              {/* Address */}
              <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="mb-2 text-xs text-slate-600">
                  {isWallet ? "Wallet Address" : "Contract ID"}
                </p>

                <p className="break-all font-mono text-xs leading-6 text-slate-300">
                  {result.id}
                </p>
              </div>

              {/* General information */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Network"
                  value={result.network}
                />

                <DetailItem
                  label="Type"
                  value={isWallet ? "Stellar Account" : "Soroban Contract"}
                />
              </div>

              {/* Wallet data */}
              {isWallet && (
                <>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <DetailItem
                      label="XLM Balance"
                      value={`${result.balance} XLM`}
                    />

                    <DetailItem
                      label="Recent Transactions"
                      value={result.transactionCount}
                    />

                    <DetailItem
                      label="Assets"
                      value={result.assets.length}
                    />

                    <DetailItem
                      label="Sequence"
                      value={result.sequence}
                    />
                  </div>

                  {/* Assets */}
                  {result.assets.length > 0 && (
                    <div className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Layers3
                          size={15}
                          className="text-cyan-400"
                        />

                        <h4 className="text-sm font-medium text-white">
                          Assets
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {result.assets.map((asset, index) => (
                          <div
                            key={`${asset.asset_code}-${asset.asset_issuer}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">
                                {asset.asset_code}
                              </p>

                              <p className="mt-1 break-all font-mono text-[10px] text-slate-600">
                                {asset.asset_issuer}
                              </p>
                            </div>

                            <p className="font-mono text-sm text-slate-300">
                              {asset.balance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent transactions */}
                  {result.transactions.length > 0 && (
                    <div className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Activity
                          size={15}
                          className="text-cyan-400"
                        />

                        <h4 className="text-sm font-medium text-white">
                          Recent Activity
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {result.transactions.slice(0, 5).map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-300">
                                Transaction
                              </p>

                              <p className="mt-1 truncate font-mono text-[10px] text-slate-600">
                                {transaction.hash}
                              </p>
                            </div>

                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${transaction.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 text-slate-500 transition hover:text-cyan-400"
                              aria-label="View transaction"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Contract data */}
              {isContract && (
                <>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <DetailItem
                      label="Platform"
                      value="Soroban"
                    />

                    <DetailItem
                      label="Executable"
                      value={formatExecutableType(
                        result.executableType
                      )}
                    />

                    <DetailItem
                      label="WASM Size"
                      value={
                        result.wasmSize
                          ? `${formatNumber(result.wasmSize)} bytes`
                          : "Built-in / unavailable"
                      }
                    />

                    <DetailItem
                      label="Contract Methods"
                      value={result.methods.length}
                    />
                  </div>

                  {/* Methods */}
                  {result.methods.length > 0 && (
                    <div className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Code2
                          size={15}
                          className="text-cyan-400"
                        />

                        <h4 className="text-sm font-medium text-white">
                          Contract Methods
                        </h4>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {result.methods.map((method) => (
                          <div
                            key={method.name}
                            className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                          >
                            <p className="font-mono text-sm text-cyan-300">
                              {method.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-600">
                              {method.inputs?.length ?? 0} input
                              {method.inputs?.length === 1 ? "" : "s"} ·{" "}
                              {method.outputs?.length ?? 0} output
                              {method.outputs?.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={
                  isWallet
                    ? `https://stellar.expert/explorer/testnet/account/${result.id}`
                    : `https://stellar.expert/explorer/testnet/contract/${result.id}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    View on Stellar
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Open this address on the Testnet explorer
                  </p>
                </div>

                <ExternalLink
                  size={16}
                  className="text-slate-500"
                />
              </a>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    Scan Another
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Inspect another wallet or Soroban contract
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-500"
                />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-5 flex gap-3 rounded-xl border border-white/5 bg-white/[0.015] p-4">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-slate-500"
              />

              <p className="text-xs leading-5 text-slate-600">
                This scanner displays information retrieved from Stellar
                Testnet. Finding an address or contract does not constitute a
                security audit or guarantee that the contract is safe.
              </p>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}

function formatExecutableType(type) {
  if (!type) return "Unknown";

  if (typeof type === "string") {
    return type
      .replace(/^contract_executable_type_/, "")
      .replaceAll("_", " ");
  }

  return "Wasm";
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-medium text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs text-slate-600">{label}</p>

      <p className="mt-1.5 break-all text-sm font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}

export default CheckContract;
