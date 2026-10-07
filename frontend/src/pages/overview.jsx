import { Link } from "react-router-dom";
import {
  motion,
  fadeUp,
  staggerContainer,
} from "../components/motion";

import {
  ArrowRight,
  Code2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

const infoCards = [
  {
    title: "What is Stellar?",
    description:
      "Stellar is an open blockchain network built for fast, low-cost digital asset and payment transactions.",
    icon: Sparkles,
  },
  {
    title: "What is Soroban?",
    description:
      "Soroban is Stellar's smart contract platform for building programmable applications with Rust.",
    icon: Code2,
  },
  {
    title: "Why this registry?",
    description:
      "Discover small, reusable smart contracts with accessible source code and automated tests.",
    icon: Terminal,
  },
  {
    title: 'What does "Verified" mean?',
    description:
      "A contract is marked verified when its automated test suite passes successfully.",
    icon: ShieldCheck,
  },
];

const contracts = [
  {
    id: "escrow",
    name: "Escrow",
    description:
      "Secure two-party fund escrow with controlled release conditions.",
    category: "Payments",
  },
  {
    id: "vesting",
    name: "Vesting",
    description:
      "Release funds gradually according to a predefined schedule.",
    category: "Token Management",
  },
  {
    id: "timelock",
    name: "Timelock",
    description:
      "Restrict contract actions or funds until a specified time.",
    category: "Security",
  },
];

function Overview() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-[-20%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute right-[-10%] top-[20%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-12 sm:px-10 lg:px-14 lg:py-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-violet-500/[0.08]" />

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="relative max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-medium text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              Soroban Smart Contract Registry
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              Discover.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Reuse. Build.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Discover reusable Soroban smart contracts built for the Stellar
              ecosystem. Inspect the source, explore the tests, and use proven
              building blocks in your own projects.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contracts"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                Explore Contracts

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/check-contract"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/[0.07] hover:text-cyan-300"
              >
                Check a Contract
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Info cards */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {infoCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                variants={fadeUp}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
                className="group cursor-default rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-colors duration-300 hover:border-cyan-400/20 hover:bg-white/[0.04]"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={17} />
                </div>

                <h2 className="text-sm font-semibold text-white">
                  {card.title}
                </h2>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </motion.section>

        {/* Popular contracts */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400">
                Registry
              </p>

              <h2 className="text-2xl font-semibold tracking-tight">
                Available Contracts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Reusable Soroban building blocks.
              </p>
            </div>

            <Link
              to="/contracts"
              className="hidden cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-cyan-300 sm:flex"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {contracts.map((contract) => (
              <motion.div
                key={contract.id}
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
              >
                <Link
                  to={`/contracts/${contract.id}`}
                  className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080c1c] p-6 transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)]"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/[0.05] blur-3xl transition-all duration-500 group-hover:bg-blue-500/10" />

                  <div className="relative">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.06]">
                        <Code2
                          size={19}
                          className="text-cyan-300 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium text-slate-500">
                        {contract.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold transition-colors group-hover:text-cyan-300">
                      {contract.name}
                    </h3>

                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                      {contract.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Rust</span>

                        <span className="h-1 w-1 rounded-full bg-slate-700" />

                        <span>Soroban</span>
                      </div>

                      <span className="flex items-center gap-1 text-xs font-medium text-cyan-300">
                        View Contract

                        <ExternalLink
                          size={12}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile view all */}
          <Link
            to="/contracts"
            className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] py-3 text-xs font-medium text-slate-400 transition-all hover:border-cyan-400/20 hover:text-cyan-300 sm:hidden"
          >
            View all contracts
            <ArrowRight size={14} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built for the Stellar developer ecosystem.
          </span>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-slate-300"
            >
              <Code2 size={13} />
              GitHub
            </a>

            <a
              href="#"
              className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-slate-300"
            >
              Stellar Docs
              <ExternalLink size={12} />
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Overview;