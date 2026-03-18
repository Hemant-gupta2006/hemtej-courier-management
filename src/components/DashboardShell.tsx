"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen relative z-10 p-2 md:p-4 gap-4">
      {/* Floating Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ width: 0, opacity: 0, marginRight: -16 }}
            animate={{ width: 280, opacity: 1, marginRight: 0 }}
            exit={{ width: 0, opacity: 0, marginRight: -16 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden md:flex md:flex-col h-full rounded-[24px] overflow-hidden backdrop-blur-3xl bg-white/60 dark:bg-[#111827]/70 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] shrink-0"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.main
        layout
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col h-full rounded-[24px] overflow-hidden backdrop-blur-3xl bg-white/40 dark:bg-[#111827]/40 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] relative min-w-0"
      >
        <Navbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
