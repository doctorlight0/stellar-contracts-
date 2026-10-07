import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Code2,
  LayoutDashboard,
  Menu,
  Puzzle,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Contracts",
    path: "/contracts",
    icon: Code2,
  },
  {
    name: "Check Contract",
    path: "/check-contract",
    icon: ScanSearch,
  },
];

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((previous) => !previous)}
        className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#070a18]/90 text-slate-300 shadow-xl backdrop-blur-xl lg:hidden"
        aria-label="Toggle sidebar"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? 0 : undefined,
        }}
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[250px]
          flex-col border-r border-white/[0.06]
          bg-[#050816]/95 px-4 py-5 backdrop-blur-xl
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 px-3"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(34,211,238,0.15)",
              }}
              transition={{ duration: 0.2 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06]"
            >
              <Sparkles
                size={17}
                className="relative z-10 text-cyan-300"
              />

              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-md" />
            </motion.div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Stellar
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Contract Registry
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main navigation */}
        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-400/[0.08] text-cyan-300"
                        : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]"
                        />
                      )}

                      <Icon size={17} />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Extensions */}
        <div className="mt-9">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Extensions
          </p>

          <div className="space-y-1">
            <ExtensionItem icon={Puzzle} label="Plugins" />
            <ExtensionItem icon={ScanSearch} label="Scan Wallet" />
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <a
            href="#"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-slate-600 transition-all duration-200 hover:bg-white/[0.025] hover:text-slate-300"
          >
            <Code2 size={15} />
            GitHub
          </a>

          <a
            href="#"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-slate-600 transition-all duration-200 hover:bg-white/[0.025] hover:text-slate-300"
          >
            <BookOpen size={15} />
            Soroban Docs
          </a>
        </div>
      </motion.aside>
    </>
  );
}

function ExtensionItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600">
      <div className="flex items-center gap-3">
        <Icon size={16} />
        <span>{label}</span>
      </div>

      <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-slate-600">
        Soon
      </span>
    </div>
  );
}

export default Sidebar;