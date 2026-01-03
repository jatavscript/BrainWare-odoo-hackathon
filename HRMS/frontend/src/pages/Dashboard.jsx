import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics/overview').then((res) => setData(res.data.data));
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  const kpi = data.kpis;
  const deptData = data.deptDistribution.map((d, i) => ({ name: d.department || 'Unassigned', value: d.count }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div className="card p-4" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <div className="text-gray-500 text-sm">Total Employees</div>
          <div className="text-2xl font-semibold">{kpi.totalEmployees}</div>
        </motion.div>
        <motion.div className="card p-4" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
          <div className="text-gray-500 text-sm">Pending Leaves</div>
          <div className="text-2xl font-semibold">{kpi.pendingLeaves}</div>
        </motion.div>
        <motion.div className="card p-4" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
          <div className="text-gray-500 text-sm">Attendance Records (Mo.)</div>
          <div className="text-2xl font-semibold">{kpi.attendanceRecordsThisMonth}</div>
        </motion.div>
        <motion.div className="card p-4" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.15}}>
          <div className="text-gray-500 text-sm">Attrition Risk</div>
          <div className="text-2xl font-semibold">Live</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="font-semibold mb-2">Department Distribution</div>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" label={(e)=>e.name}>
                  {deptData.map((entry, index) => (
                    <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <div className="font-semibold mb-2">Attendance (Sample)</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={[{name:'Week 1', hours: 120},{name:'Week 2', hours:135},{name:'Week 3', hours:128},{name:'Week 4', hours:142}]}> 
                <XAxis dataKey="name" /><YAxis /><Tooltip />
                <Bar dataKey="hours" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
