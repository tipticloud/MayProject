import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskModal from "../components/TaskModal";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Plus, Calendar, User, AlignLeft, GripVertical, Trash2, Edit2, ShieldAlert } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchAll = async () => {
    try {
      const [p, t] = await Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?project=${id}`)]);
      setProject(p.data); setTasks(t.data);
    } catch (err) { toast.error("Failed to load"); }
  };
  useEffect(() => { fetchAll(); }, [id]);

  const updateStatus = async (taskId, status) => {
    try { await api.put(`/tasks/${taskId}`, { status }); toast.success("Status updated"); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Terminate this task?")) return;
    try { await api.delete(`/tasks/${taskId}`); toast.success("Task eliminated"); fetchAll(); }
    catch (err) { toast.error("Failed"); }
  };

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const columns = ["Todo", "In Progress", "Done"];

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-gray-400 mt-1 max-w-2xl">{project.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex -space-x-2">
                {project.members?.slice(0, 5).map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#18181b] bg-[#27272a] flex items-center justify-center text-xs font-medium text-gray-300 shadow-sm" title={m.name}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {project.members?.length > 5 && (
                  <div className="w-8 h-8 rounded-full border-2 border-[#18181b] bg-[#27272a] flex items-center justify-center text-xs font-medium text-gray-300 shadow-sm">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">{project.members?.length || 0} Operatives Assigned</span>
            </div>
          </div>
        </div>

        {user?.role === "Admin" && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditTask(null); setShowModal(true); }} 
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-colors relative z-10 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> New Task
          </motion.button>
        )}
      </motion.div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start min-h-[600px]">
        {columns.map((col, colIndex) => {
          const colTasks = tasks.filter((t) => t.status === col);
          const isTodo = col === "Todo";
          const isProgress = col === "In Progress";
          const isDone = col === "Done";
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              key={col} 
              className="glass-card flex-1 min-w-[320px] max-w-[400px] flex flex-col bg-[#18181b]/50 border-[#27272a]"
            >
              <div className={`p-4 border-b border-[#27272a] flex justify-between items-center ${isTodo ? 'border-t-2 border-t-gray-500 rounded-t-2xl' : isProgress ? 'border-t-2 border-t-yellow-500 rounded-t-2xl' : 'border-t-2 border-t-green-500 rounded-t-2xl'}`}>
                <h3 className="font-semibold text-white tracking-wide flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isTodo ? 'bg-gray-500' : isProgress ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  {col}
                </h3>
                <span className="bg-[#27272a] text-gray-300 px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#3f3f46]">
                  {colTasks.length}
                </span>
              </div>
              
              <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {colTasks.map((t, i) => {
                    const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done";
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={t._id} 
                        className="bg-[#27272a]/50 p-4 rounded-xl border border-[#3f3f46] hover:border-primary/50 transition-colors group relative hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="font-medium text-gray-100 leading-tight">{t.title}</h4>
                          <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border ${
                            t.priority === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                            t.priority === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                            "bg-green-500/10 text-green-400 border-green-500/20"
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        
                        {t.description && (
                          <div className="flex items-start gap-2 text-gray-400 text-xs mb-4">
                            <AlignLeft className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <p className="line-clamp-2 leading-relaxed">{t.description}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs mt-4 pt-3 border-t border-[#3f3f46]">
                          <div className="flex items-center gap-1.5 text-gray-400 bg-[#18181b] px-2 py-1 rounded-md border border-[#3f3f46]">
                            <User className="w-3 h-3 text-neon" />
                            <span className="truncate max-w-[100px]">{t.assignedTo?.name || "Unassigned"}</span>
                          </div>
                          
                          {t.dueDate && (
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
                              overdue 
                                ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                : "bg-[#18181b] text-gray-400 border-[#3f3f46]"
                            }`}>
                              {overdue ? <ShieldAlert className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                              <span>{new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative flex-1">
                            <select 
                              value={t.status} 
                              onChange={(e) => updateStatus(t._id, e.target.value)} 
                              className="w-full text-xs bg-[#18181b] border border-primary/30 text-white rounded px-2 py-1.5 appearance-none focus:outline-none focus:border-primary cursor-pointer"
                            >
                              {columns.map((c) => <option key={c} value={c}>Move to {c}</option>)}
                            </select>
                            <GripVertical className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          </div>
                          
                          {user?.role === "Admin" && (
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => { setEditTask(t); setShowModal(true); }} className="p-1.5 bg-[#18181b] hover:bg-primary/20 text-gray-400 hover:text-primary rounded border border-[#3f3f46] hover:border-primary/30 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteTask(t._id)} className="p-1.5 bg-[#18181b] hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded border border-[#3f3f46] hover:border-red-500/30 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {colTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-center p-4 border-2 border-dashed border-[#27272a] rounded-xl text-gray-500 text-sm">
                    No tasks in {col}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <TaskModal projectId={id} task={editTask} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchAll(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
