import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Activity, CheckCircle, Clock, AlertTriangle, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 relative overflow-hidden group hover:border-white/20 transition-all"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 ${color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
    <div className="flex justify-between items-start mb-4">
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-').replace('/20', '')}`} />
    </div>
    <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ tasks: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tasks/my-tasks")
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const { stats, tasks } = data;
  
  const chartData = [
    { name: 'To Do', value: stats.todo || 0, color: '#9ca3af' },
    { name: 'In Progress', value: stats.inProgress || 0, color: '#eab308' },
    { name: 'Done', value: stats.done || 0, color: '#22c55e' },
    { name: 'Overdue', value: stats.overdue || 0, color: '#ef4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-gray-400">Welcome back, {user?.name}. Here's your mission status.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard delay={0.1} label="Total Tasks" value={stats.total || 0} icon={Layers} color="bg-primary" />
        <StatCard delay={0.2} label="To Do" value={stats.todo || 0} icon={Clock} color="bg-gray-400" />
        <StatCard delay={0.3} label="In Progress" value={stats.inProgress || 0} icon={Activity} color="bg-yellow-500" />
        <StatCard delay={0.4} label="Done" value={stats.done || 0} icon={CheckCircle} color="bg-green-500" />
        <StatCard delay={0.5} label="Overdue" value={stats.overdue || 0} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Active Assignments</h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mb-3 text-gray-600" />
              <p>No active tasks assigned to you.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#27272a] text-gray-400 text-sm">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {tasks.map((t, i) => {
                    const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done";
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (i * 0.05) }}
                        key={t._id} 
                        className="border-b border-[#27272a]/50 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 font-medium text-gray-200">{t.title}</td>
                        <td className="py-4 text-gray-500">{t.project?.name}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                            t.priority === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : 
                            "bg-green-500/10 text-green-400 border border-green-500/20"
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">{t.status}</td>
                        <td className={`py-4 ${overdue ? "text-red-400 font-semibold flex items-center gap-1" : "text-gray-500"}`}>
                          {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                          {overdue && <AlertTriangle className="w-3 h-3" />}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 flex flex-col"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Task Distribution</h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
