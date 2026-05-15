import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Lock, Shield } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await register(form); toast.success("Account created!"); navigate("/"); }
    catch (err) { toast.error(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden px-4">
      {/* Animated background effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-neon/10 rounded-xl border border-neon/20">
            <UserPlus className="w-8 h-8 text-neon" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Request Access</h2>
        <p className="text-center text-gray-400 mb-8">Join the operational grid</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-neon focus:border-transparent outline-none transition-all placeholder:text-gray-600" 
              required 
            />
          </div>
          
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-neon focus:border-transparent outline-none transition-all placeholder:text-gray-600" 
              required 
            />
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="password" 
              placeholder="Password (min 6 chars)" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-neon focus:border-transparent outline-none transition-all placeholder:text-gray-600" 
              minLength={6} 
              required 
            />
          </div>

          <div className="relative">
            <Shield className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
              value={form.role} 
              onChange={(e) => setForm({ ...form, role: e.target.value })} 
              className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] text-white rounded-xl focus:ring-2 focus:ring-neon focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="Member">Operative (Member)</option>
              <option value="Admin">Commander (Admin)</option>
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 bg-neon hover:bg-neon/90 text-[#09090b] font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            {loading ? "Establishing..." : "Initialize Profile"}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already cleared? <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Authenticate</Link>
        </p>
      </motion.div>
    </div>
  );
}
