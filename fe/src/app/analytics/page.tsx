"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Activity, TrendingUp, AlertCircle, Info, Zap, Target, Gauge, ArrowUpRight } from "lucide-react";

const AnalyticsChart = dynamic(() => import("@/components/AnalyticsChart"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  )
});



const sectorData = [
  { name: 'Energy', value: 45, color: '#10B981' },
  { name: 'Transport', value: 25, color: '#3B82F6' },
  { name: 'Industry', value: 18, color: '#F59E0B' },
  { name: 'Waste', value: 12, color: '#6B7280' },
];

export default function Analytics() {

  return (
    <main className="min-h-screen pt-44 pb-20 px-6 max-w-7xl mx-auto">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16"
      >
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent neon-glow-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Real-Time Data Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">CLIMATE INSIGHTS</h1>
          <p className="text-white/40 font-medium">Advanced atmospheric analysis and predictive forecasting.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-pill px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Export JSON</button>
          <button className="bg-accent text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-accent/20">Live Sync</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Chart Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass-ultra p-10 border-white/5"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <TrendingUp className="text-accent w-6 h-6" />
                CO₂ CONCENTRATION
              </h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Measured in parts per million (PPM)</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 rounded-lg">7D</button>
              <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">30D</button>
              <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">1Y</button>
            </div>
          </div>
          
          <div className="h-[450px] min-h-[450px] w-full relative">
            <AnalyticsChart />
          </div>
        </motion.div>

        {/* Sidebar Widgets */}
        <div className="flex flex-col gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-ultra p-8 border-accent/20 bg-accent/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-sm tracking-tighter uppercase">AI FORECASTING</h4>
              <Zap className="text-accent w-4 h-4 neon-glow-accent" />
            </div>
            <p className="text-xs text-white/50 leading-relaxed font-medium mb-6">
              Atmospheric pressure shifts in the North Atlantic suggest a <span className="text-accent">4.2%</span> spike in particulate stagnation.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Confidence</span>
              <span className="text-lg font-black text-accent tracking-tighter">94.8%</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-ultra p-8 border-white/5"
          >
            <h4 className="font-black text-sm tracking-tighter uppercase mb-8">EMISSIONS BY SOURCE</h4>
            <div className="space-y-6">
              {sectorData.map((s) => (
                <div key={s.name} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">{s.name}</span>
                    <span>{s.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}40` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-ultra p-8 border-white/5 flex flex-col justify-between"
          >
             <div className="flex items-center justify-between mb-4">
                <Target className="text-cyan-400 w-5 h-5" />
                <ArrowUpRight className="text-white/20 w-4 h-4" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Net Zero 2030</div>
                <div className="text-4xl font-black tracking-tighter">12.5%</div>
                <div className="text-[10px] font-bold text-cyan-400/50 uppercase tracking-widest mt-1">On Track</div>
             </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
