import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X, CheckSquare, AlignLeft, User, Activity, AlertCircle, Calendar } from "lucide-react";

export default function TaskModal({ projectId, task, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: task?.title || "", description: task?.description || "",
    assignedTo: task?.assignedTo?._id || "", status: task?.status || "Todo",
    priority: task?.priority || "Medium", dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });
  const [users, setUsers] = useState([]);
  
  useEffect(() => { api.get("/auth/users").then(({ data }) => setUsers(data)); }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) { await api.put(`/tasks/${task._id}`, form); toast.success("Task updated"); }
      else { await api.post("/tasks", { ...form, project: projectId }); toast.success("Task created"); }
      onSuccess();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };
  
  return (
    <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#27272a] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative custom-scrollbar"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <CheckSquare className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{task ? "Edit Task" : "New Task"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
            <div className="relative">
              <CheckSquare className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Task title..." 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-600" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Description</label>
            <div className="relative">
              <AlignLeft className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
              <textarea 
                placeholder="Details..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-600 resize-none" 
                rows={3} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Assign To</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select 
                value={form.assignedTo} 
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</label>
              <div className="relative">
                <Activity className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value })} 
                  className="w-full pl-9 pr-2 py-2 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none text-sm"
                >
                  <option>Todo</option><option>In Progress</option><option>Done</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select 
                  value={form.priority} 
                  onChange={(e) => setForm({ ...form, priority: e.target.value })} 
                  className="w-full pl-9 pr-2 py-2 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none text-sm"
                >
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Deadline</label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="date" 
                value={form.dueDate} 
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] text-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all [color-scheme:dark]" 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#27272a] mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-gray-300 border border-[#27272a] rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
