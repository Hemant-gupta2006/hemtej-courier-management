"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  TableProperties,
  Settings,
  FileSpreadsheet,
  Package,
  List,
} from "lucide-react";
import { motion } from "framer-motion";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "from-blue-500 to-indigo-500",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Courier Entry",
    icon: TableProperties,
    href: "/dashboard/entries",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "All Entries",
    icon: List,
    href: "/dashboard/all-entries",
    color: "from-teal-500 to-cyan-500",
  },
  {
    label: "Reports",
    icon: FileSpreadsheet,
    href: "/dashboard/reports",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "from-orange-500 to-amber-500",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-8 flex flex-col h-full bg-transparent text-slate-800 dark:text-slate-100">
      <div className="px-6 flex-1">
        <Link href="/dashboard" className="flex items-center gap-3 mb-12 group pl-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src="/favicon.ico" alt="HemTej Co Logo" className="w-6 h-6 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400">
            HemTej Co
          </h1>
        </Link>
        <div className="space-y-2">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
            return (
              <Link key={route.href} href={route.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-white/60 dark:bg-white/10 shadow-sm border border-white/50 dark:border-white/5 text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent dark:from-blue-500/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center flex-1 relative z-10">
                    <div className={cn(
                      "p-1.5 rounded-lg mr-3 transition-colors duration-300",
                      isActive ? `bg-gradient-to-br ${route.color} text-white shadow-md` : "group-hover:bg-white dark:group-hover:bg-slate-800"
                    )}>
                      <route.icon className={cn(
                        "h-4 w-4",
                        isActive ? "text-white" : "text-current"
                      )} />
                    </div>
                    {route.label}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
