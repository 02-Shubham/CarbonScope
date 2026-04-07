"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Globe2, ArrowRight, ShieldCheck } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-3 px-5 py-2 rounded-full glass-pill mb-10 text-[10px] font-bold tracking-[0.2em] uppercase text-accent border-accent/20"
      >
        <Sparkles className="w-3 h-3 neon-glow-accent" />
        Next-Gen Climate Intelligence
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white"
      >
        Track the World's <br />
        <span className="bg-clip-text text-transparent bg-linear-to-r from-accent via-emerald-400 to-cyan-400 text-glow">
          Carbon Pulse.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-white/50 max-w-3xl mb-16 leading-relaxed font-medium"
      >
        Experience real-time atmospheric insights with CarbonTrack. 
        Our AI-driven satellite network provides unprecedented visibility 
        into global emissions, helping you make data-backed climate decisions.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-8 mb-8 p-8"
      >
        <button className="bg-accent text-white px-12 py-5 rounded-2xl font-bold flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-accent/40 neon-glow-accent">
          <Globe2 className="w-5 h-5" />
          Launch Global Explorer
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
        <button className="glass-ultra px-12 py-5 rounded-2xl font-bold text-white/90 hover:bg-white/10 transition-all border-white/10">
          View Live Analytics
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="mt-32 flex gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
      >
        <div className="flex items-center gap-2 font-bold text-xs tracking-widest"><ShieldCheck className="w-4 h-4" /> NASA DATA</div>
        <div className="flex items-center gap-2 font-bold text-xs tracking-widest"><ShieldCheck className="w-4 h-4" /> UNFCCC</div>
        <div className="flex items-center gap-2 font-bold text-xs tracking-widest"><ShieldCheck className="w-4 h-4" /> IPCC COMPLIANT</div>
      </motion.div>
    </section>
  );
};
