"use client";

import Link from "next/link";
import { 
  Package, ArrowRight, LayoutDashboard, Zap, TableProperties, 
  Lock, Download, Keyboard, Wand2, Settings2, Gauge, MoonStar, Sparkles, Activity, Globe
} from "lucide-react";
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between px-6 py-3 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-sm">
          <Link href="#" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <img src="/favicon.ico" alt="HemTej Co Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              HemTej Co
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="#core-features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Core</Link>
            <Link href="#advanced-features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Advanced</Link>
            <Link href="#performance" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Performance</Link>
            <Link href="#ui-ux" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Design</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!hasSession ? (
              <>
                <Link href="/login">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">Login</span>
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center font-medium text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-full h-10 px-6 transition-all shadow-sm">
                  Get Started
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="inline-flex items-center justify-center font-medium text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-full h-10 px-6 transition-all shadow-sm">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default function LandingClient({ hasSession }: { hasSession: boolean }) {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] selection:bg-blue-500/30 font-sans text-slate-900 dark:text-slate-50">
      <FloatingNavbar hasSession={hasSession} />

      {/* 1. Hero Section */}
      <section id="home" className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden px-4">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              The Modern Logistics Platform
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1]"
            >
              Courier Management.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                Made Exceptionally Fast.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed"
            >
              Streamline your high-volume workflows with spreadsheet-like data entry, real-time analytics, and secure cloud storage. Built for speed and reliability.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href={hasSession ? "/dashboard" : "/login"} className="inline-flex items-center justify-center font-medium h-14 px-8 text-base bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg rounded-full transition-all hover:scale-105">
                {hasSession ? "Enter Dashboard" : "Start For Free"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators */}
      <section className="py-10 border-y border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-6 tracking-wide uppercase">
            Powering thousands of shipments daily for modern logistics teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            {/* Dummy Logos */}
            <div className="flex items-center gap-2 font-bold text-xl"><Package className="w-6 h-6"/> ShipFast</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6"/> GlobalLog</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6"/> ExpressWay</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Activity className="w-6 h-6"/> FlowTrack</div>
          </div>
        </div>
      </section>

      {/* 3. Core Features */}
      <section id="core-features" className="py-24 md:py-32 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to run your operations</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">A complete toolkit designed to handle your courier lifecycle from entry to export securely.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <TableProperties className="h-6 w-6 text-blue-500" />,
                title: "Shipment Data Entry",
                desc: "Record Date, Challan, Sender, Receiver, Weight, Amount, and Status with precision."
              },
              {
                icon: <LayoutDashboard className="h-6 w-6 text-purple-500" />,
                title: "Dashboard Overview",
                desc: "Track total shipments, cash vs. account revenues, and monitor your recent ledger."
              },
              {
                icon: <Download className="h-6 w-6 text-emerald-500" />,
                title: "Excel Data Export",
                desc: "Generate robust .xlsx spreadsheets of your ledger data instantly for accounting."
              },
              {
                icon: <Lock className="h-6 w-6 text-orange-500" />,
                title: "Secure Authentication",
                desc: "Enterprise-grade email and password authentication ensuring your ledger data remains private."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Advanced Features */}
      <section id="advanced-features" className="py-24 md:py-32 px-4 bg-slate-100 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Advanced tools for power users</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">We stripped away the clutter and focused on reducing friction. Enter hundreds of records per day without ever touching your mouse.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2 p-8 md:p-12 rounded-[32px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Keyboard className="w-32 h-32" />
              </div>
              <div className="relative z-10 w-full md:w-2/3">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <Keyboard className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Spreadsheet-Style Editing</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                  Navigate seamlessly with Arrow keys and Enter. Experience inline editing that feels exactly like your favorite spreadsheet software, but backed by a secure relational database.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex-1 p-8 rounded-[32px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Wand2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Autocomplete</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  The system remembers past sender, receiver, and destination names, predicting your entries to save keystrokes.
                </p>
              </div>
              <div className="flex-1 p-8 rounded-[32px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <Settings2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Batch Settings</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Lock in common values (Date, Mode, Destination) so they automatically apply to every newly created row.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. Performance and UI/UX */}
      <section id="performance" className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for uncompromising speed</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Handle massive datasets without breaking a sweat. Our infrastructure is heavily optimized for rendering performance.</p>
                 </div>
                 
                 <div className="flex items-start gap-4">
                    <div className="mt-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                       <Gauge className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">Virtualized DOM Rendering</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Even with 1,000+ rows, the table only renders what is visible on your screen. Navigate your entire ledger with buttery smooth 60fps scrolling and zero lag.
                      </p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="mt-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                       <MoonStar className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">Beautifully Pragmatic Design</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Enjoy full dark mode support, non-intrusive toast notifications, and subtle micro-animations that make daily data entry a joy rather than a chore.
                      </p>
                    </div>
                 </div>
              </div>

              {/* Graphic Representation */}
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 blur-3xl rounded-full" />
                 <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-2 shadow-xl">
                    <div className="bg-slate-50 dark:bg-[#0a0f1c] rounded-[24px] overflow-hidden border border-slate-100 dark:border-slate-800/50">
                       <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2">
                         <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                           <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                           <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                         </div>
                       </div>
                       <div className="p-4 space-y-3">
                         {Array.from({ length: 6 }).map((_, i) => (
                           <div key={i} className="flex gap-3 items-center opacity-70">
                             <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                             <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                             <div className="h-8 flex-1 bg-slate-200 dark:bg-slate-800 rounded-md" />
                             <div className="h-8 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-md" />
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[40px] bg-slate-900 dark:bg-slate-800 p-12 md:p-20 shadow-2xl relative overflow-hidden border border-slate-800 dark:border-slate-700"
          >
            {/* Subtle inner gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 space-y-8">
              <Sparkles className="w-12 h-12 text-blue-400 mx-auto" />
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to transform your<br />workflow?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                Join our platform today and experience the fastest, most reliable courier management system built for scale.
              </p>
              <div className="pt-4">
                <Link href={hasSession ? "/dashboard" : "/register"} className="inline-flex items-center justify-center font-medium h-14 px-8 text-base bg-white text-slate-900 hover:bg-slate-100 shadow-xl rounded-full transition-all hover:scale-105">
                  {hasSession ? "Go to Dashboard" : "Get Started For Free"}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200 dark:border-slate-800/50 bg-white dark:bg-[#0a0a0a] py-12 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="HemTej Co Logo" className="w-6 h-6 object-contain grayscale opacity-80" />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">HemTej Co</span>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            © 2026 HemTej Co Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
