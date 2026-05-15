import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X, FolderKanban, Users, AlignLeft, Check } from "lucide-react";

export default function ProjectModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "", members: [] });
  const [users, setUsers] = useState([]);
  
  useEffect(() => { api.get("/auth/users").then(({ data }) => setUsers(data)); }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post("/projects", form); toast.success("Project initialized"); onSuccess(); }
    catch (err) { toast.error(err.response?.data?.message || "Initialization failed"); }
  };
  
  const toggleMember = (id) => {
    setForm((f) => ({ ...f, members: f.members.includes(id) ? f.members.filter((m) => m !== id) : [...f.members, id] }));
  };
  
  return (
    <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#27272a] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <FolderKanban className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">New Project</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project Designation</label>
            <div className="relative">
              <FolderKanban className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="e.g. Operation Apollo" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-600" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mission Brief (Optional)</label>
            <div className="relative">
              <AlignLeft className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
              <textarea 
                placeholder="Outline the project objectives..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-600 resize-none" 
                rows={3} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> Assign Operatives
            </label>
            <div className="max-h-40 overflow-y-auto custom-scrollbar border border-[#27272a] bg-[#18181b] rounded-xl p-2 space-y-1">
              {users.map((u) => {
                const isSelected = form.members.includes(u._id);
                return (
                  <label 
                    key={u._id} 
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                      isSelected ? "bg-primary/10 border-primary/30" : "hover:bg-[#27272a] border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-primary text-white" : "bg-[#27272a] text-gray-400"
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-300"}`}>{u.name}</span>
                        <span className="text-[10px] text-gray-500">{u.email}</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? "bg-primary border-primary" : "border-[#3f3f46]"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={isSelected} 
                      onChange={() => toggleMember(u._id)} 
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#27272a]">
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
              Initialize Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
