"use client";

import React from "react";
import Link from "next/link";
import { Activity, Map as MapIcon, BarChart3, Info, Search, Menu } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="glass-ultra px-8 py-4 flex items-center justify-between border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center neon-glow-accent transition-transform group-hover:scale-110">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/40">
              CARBONTRACK
            </span>
            <span className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase -mt-1 ml-0.5">Dashboard</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <NavLink href="/" icon={<MapIcon className="w-4 h-4" />} label="Explorer" active />
          <NavLink href="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          <NavLink href="/about" icon={<Info className="w-4 h-4" />} label="Insights" />
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 p-2 px-4 glass-pill hover:bg-white/10 transition-all text-xs font-bold text-white/70">
            <Search className="w-4 h-4" />
            <span className="opacity-60">Search Region</span>
          </button>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
             <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border border-white/20">
                <Menu className="w-4 h-4 text-white/50" />
             </div>
             <span className="hidden lg:block text-xs font-bold tracking-tight text-white/80">Guest User</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) => (
  <Link 
    href={href} 
    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:text-white group ${active ? 'text-white' : 'text-white/40'}`}
  >
    <span className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-accent/20 text-accent' : 'bg-white/5 group-hover:bg-white/10'}`}>
      {icon}
    </span>
    {label}
  </Link>
);
