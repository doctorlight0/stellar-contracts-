import { useMemo, useState } from "react";
import { motion } from "../components/motion";
import { contracts } from "../data/contracts";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const contractsArray = Object.values(contracts).map((contract) => ({
  id: contract.name.toLowerCase().replace(/\s+/g, "-"),
  ...contract,
}));

function Contracts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(Object.values(contracts).map((c) => c.category))],
    []
  );

  const filteredContracts = useMemo(() => {
    return contractsArray.filter((contract) => {
      const matchesSearch =
        contract.name.toLowerCase().includes(search.toLowerCase()) ||
        contract.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || contract.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400">
            <Code2 size={13} />
            Registry
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Smart Contracts
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Browse reusable Soroban smart contracts, inspect their
                implementation, and explore the tests behind them.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] px-3 py-2 text-xs text-emerald-300">
              <CheckCircle2 size={14} />
              {contractsArray.length} contracts available
            </div>
          </div>
        </motion.section>

        {/* Search + filters */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3"
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="group flex h-11 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#080c1c] px-3 transition-all duration-200 focus-within:border-cyan-400/25 focus-within:shadow-[0_0_25px_rgba(34,211,238,0.05)]">
              <Search
                size={17}
                className="text-slate-600 transition-colors group-focus-within:text-cyan-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search contracts..."
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-slate-600 transition-colors hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="hidden items-center gap-2 px-2 text-slate-600 sm:flex">
                <SlidersHorizontal size={14} />
                <span className="text-xs">Filter</span>
              </div>

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                    category === item
                      ? "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/10 hover:text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Results */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {filteredContracts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-16 text-center"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                <Search size={18} className="text-slate-600" />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-300">
                No contracts found
              </h2>

              <p className="mt-2 text-xs text-slate-600">
                Try another search term or category.
              </p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function ContractCard({ contract }) {
  return (
    <motion.article
      variants={{
        hidden: {
          opacity: 0,
          y: 18,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080c1c] p-6 transition-colors duration-300 hover:border-cyan-400/20"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/[0.06] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.08]" />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.07]">
            <Code2 size={19} />
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
            <CheckCircle2 size={11} />
            Tests Passing
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {contract.name}
            </h2>

            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-slate-500">
              {contract.category}
            </span>
          </div>

          <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
            {contract.description}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          {contract.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>Rust</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Soroban</span>
          </div>

          <a
            href={`/contracts/${contract.id}`}
            className="group/link flex items-center gap-1.5 text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
          >
            View Contract

            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover/link:translate-x-1"
            />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default Contracts;
