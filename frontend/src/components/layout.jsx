import { motion } from "framer-motion";
import Sidebar from "./sidebar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Sidebar />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen lg:ml-[250px]"
      >
        {children}
      </motion.main>
    </div>
  );
}

export default Layout;