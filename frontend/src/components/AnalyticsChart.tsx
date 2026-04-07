"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const predictionData = [
  { name: 'Jan', current: 424, predicted: 424 },
  { name: 'Feb', current: 424.2, predicted: 424.5 },
  { name: 'Mar', current: 424.5, predicted: 425.1 },
  { name: 'Apr', current: 424.8, predicted: 425.8 },
  { name: 'May', predicted: 426.5 },
  { name: 'Jun', predicted: 427.2 },
  { name: 'Jul', predicted: 428.1 },
];

export default function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={450} debounce={100} minWidth={0} minHeight={0}>
      <AreaChart data={predictionData}>
        <defs>
          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(20px)', padding: '12px' }}
          itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
          cursor={{ stroke: '#ffffff10', strokeWidth: 1 }}
        />
        <Area type="monotone" dataKey="current" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrent)" animationDuration={2000} />
        <Area type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} strokeDasharray="8 8" fillOpacity={1} fill="url(#colorPredicted)" animationDuration={3000} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
