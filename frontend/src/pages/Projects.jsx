import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectModal from "../components/ProjectModal";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Plus, Trash2, Users, ArrowRight, Layers } from "lucide-react";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try { const { data } = await api.get("/projects"); setProjects(data); }
    catch (err) { toast.error("Failed to load projects"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm("Initiate deletion sequence? All associated tasks will be destroyed.")) return;
    try { await api.delete(`/projects/${id}`); toast.success("Project eliminated"); fetchProjects(); }
    catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-end mb-8 border-b border-[#27272a] pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Active Projects</h1>
          </div>
          <p className="text-gray-400">Manage and monitor your team's initiatives.</p>
        </motion.div>

        {user?.role === "Admin" && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)} 
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-colors"
          >
            <Plus className="w-5 h-5" /> New Project
          </motion.button>
        )}
      </div>

      {projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-16 flex flex-col items-center justify-center text-center border-dashed border-[#3f3f46]"
        >
          <div className="w-20 h-20 bg-[#18181b] rounded-full flex items-center justify-center mb-6 border border-[#27272a]">
            <Layers className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No active projects</h3>
          <p className="text-gray-400 max-w-md">
            {user?.role === "Admin" 
              ? "Initialize a new project to start organizing tasks." 
              : "No projects have been assigned to you yet."}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((p, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.05 }}
                key={p._id} 
                className="group relative"
              >
                <Link to={`/projects/${p._id}`} className="block h-full">
                  <div className="glass-card p-6 h-full flex flex-col border border-[#27272a] hover:border-primary/50 transition-colors relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                    
                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-[30px] group-hover:bg-primary/20 transition-colors" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center border border-[#27272a] group-hover:border-primary/30 transition-colors">
                          <Layers className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{p.name}</h3>
                      </div>
                      
                      {user?.role === "Admin" && (
                        <button 
                          onClick={(e) => handleDelete(p._id, e)} 
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors z-20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                      {p.description || "No mission brief provided."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#27272a] group-hover:border-[#3f3f46] transition-colors relative z-10">
                      <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#18181b] px-3 py-1.5 rounded-full border border-[#27272a]">
                        <Users className="w-4 h-4 text-neon" />
                        <span className="font-medium text-gray-300">{p.members?.length || 0}</span> Operatives
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        Enter <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && <ProjectModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchProjects(); }} />}
      </AnimatePresence>
    </div>
  );
}
