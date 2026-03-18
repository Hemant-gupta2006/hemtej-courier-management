"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, Activity, Globe, ShieldCheck, CheckCircle2, LayoutDashboard, Zap, TableProperties } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

const FloatingNavbar = ({ hasSession }: { hasSession: boolean }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
          <Link href="#" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400">
              HemTej Co
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <Link href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
            <Link href="#workflow" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Workflow</Link>
            <Link href="#contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!hasSession ? (
              <>
                <Link href="/login">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">Login</span>
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center font-medium text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl h-10 px-6">
                  Get Started
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="inline-flex items-center justify-center font-medium text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl h-10 px-6">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default function LandingClient({ hasSession }: { hasSession: boolean }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] selection:bg-blue-500/30 font-sans overflow-hidden">
      <FloatingNavbar hasSession={hasSession} />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-7000 delay-1000" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium"
            >
              <Zap className="w-4 h-4 mr-2" />
              The Next Generation Logistics Platform
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl"
            >
              Courier Management System
              <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"> 
                Made Exceptionally Fast.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl"
            >
              Manage and export courier entries easily. Designed for high volume workflows with spreadsheet-like data entry, real-time analytics, and secure cloud storage.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href={hasSession ? "/dashboard" : "/login"} className="inline-flex items-center justify-center font-medium h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-xl transition-all hover:scale-105">
                {hasSession ? "Enter Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>

            {/* Dashboard Preview Graphic */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-5xl mt-16 relative"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl rounded-[32px]" />
              <div className="relative rounded-[24px] border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-[#111827]/60 backdrop-blur-2xl shadow-2xl overflow-hidden p-2">
                <div className="h-[400px] md:h-[600px] w-full rounded-[16px] border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-[#0d1321] overflow-hidden flex flex-col">
                  {/* Fake App header */}
                  <div className="h-12 border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  {/* Fake App body */}
                  <div className="flex flex-1 p-6 gap-6">
                    <div className="w-48 hidden md:flex flex-col gap-3">
                      <div className="h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 w-full" />
                      <div className="h-8 rounded-md bg-slate-200 dark:bg-white/5 w-full" />
                      <div className="h-8 rounded-md bg-slate-200 dark:bg-white/5 w-full" />
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="h-24 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 flex-1 shadow-sm" />
                        <div className="h-24 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 flex-1 shadow-sm" />
                        <div className="h-24 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 flex-1 shadow-sm" />
                      </div>
                      <div className="flex-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm p-4">
                         <div className="h-6 w-32 bg-slate-200 dark:bg-white/10 rounded mb-4" />
                         <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-10 bg-slate-100 dark:bg-white/5 rounded w-full" />
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-[#0d1321] relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Premium Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to run your logistics operations efficiently, packaged in a beautiful interface.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TableProperties className="h-6 w-6 text-blue-500" />,
                title: "Spreadsheet Data Entry",
                desc: "150+ rows per day without touching your mouse. Features inline editing, auto-increment, and smart autocomplete."
              },
              {
                icon: <LayoutDashboard className="h-6 w-6 text-purple-500" />,
                title: "Modern Dashboard",
                desc: "Gain insights with our visually stunning admin dashboard containing floating cards and glowing hover effects."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
                title: "Secure & Reliable",
                desc: "Backed by enterprise-grade security and a deeply reliable SQLite database powered by Prisma."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50 dark:bg-[#0f172a]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Lightning fast bulk operations.
              </h2>
              <ul className="space-y-6">
                {[
                  "Copy columns directly from Excel and paste into the grid.",
                  "Set default batch settings to apply to every new row.",
                  "Smart autocomplete remembers past entries.",
                  "Export filtered records to robust .xlsx files."
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl rounded-full" />
                <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
                   <div className="space-y-4">
                     <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700/50 rounded-md" />
                     <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md" />
                     <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
                     <div className="mt-8 grid grid-cols-2 gap-4">
                       <div className="h-20 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30" />
                       <div className="h-20 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[32px] bg-gradient-to-br from-blue-600 to-purple-700 p-12 md:p-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Ready to transform your workflow?
              </h2>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
                Join our platform today and experience the fastest spreadsheet-like courier management system.
              </p>
              <div className="inline-block pt-4">
                <Link href={hasSession ? "/dashboard" : "/register"} className="inline-flex items-center justify-center font-medium h-14 px-8 text-base bg-white text-blue-700 hover:bg-slate-50 shadow-xl rounded-xl transition-all hover:scale-105">
                  {hasSession ? "Go to Dashboard" : "Get Started For Free"}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f1c] py-12">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">HemTej Co</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © 2026 HemTej Co Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">Terms</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
