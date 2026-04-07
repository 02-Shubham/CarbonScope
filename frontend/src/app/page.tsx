"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { 
  Activity, Wind, Thermometer, TrendingUp, Layers, MousePointer2, 
  ArrowUpRight, Zap, Target, Gauge 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}

const FloatingPoint = ({ top, left, color, colorGlow, label }: any) => (
  <motion.div 
    style={{ top, left }} 
    className="absolute z-10 group"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1 }}
  >
    <div className={`w-3 h-3 rounded-full ${color} neon-glow-${colorGlow} relative`}>
      <div className={`absolute -inset-2 rounded-full border border-white/20 animate-ping opacity-20`} />
    </div>
    <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap glass-pill px-3 py-1 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </div>
  </motion.div>
);

const StatBentoCard = ({ icon, label, value, sub }: any) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="glass-ultra p-8 flex flex-col justify-between border-white/5"
  >
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-2xl bg-white/5">{icon}</div>
      <ArrowUpRight className="text-white/20 w-5 h-5" />
    </div>
    <div>
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-4xl font-black tracking-tighter leading-none mb-2">{value}</div>
      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sub}</div>
    </div>
  </motion.div>
);

const FeatureCard = ({ title, desc, icon }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-ultra p-10 border-white/5 hover:border-accent/30 transition-all cursor-default"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8">{icon}</div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-white/40 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);
