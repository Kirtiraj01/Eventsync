import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";
import { IconCode, IconLock, IconArrowRight } from "../icons/Icons";

export default function MemberLogin() {
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      await login(form.email, form.password);
      navigate(from);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  const handleQuickLogin = async (email, password) => {
    setForm({ email, password });
    setError(null);
    try {
      await login(email, password);
      navigate(from);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0814] font-body flex items-center justify-center px-6 py-12 relative overflow-hidden text-text-main">
      {/* Background violet aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7C5CFC]/15 rounded-full blur-[120px] pointer-events-none" />

      <PageTransition className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-7">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.span
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#9E7FFF] text-white flex items-center justify-center shadow-glow-sm"
            >
              <IconCode width={22} height={22} />
            </motion.span>
            <span className="font-heading font-extrabold text-2xl text-white tracking-tight group-hover:text-brand-lavender transition-colors">
              EventSync.
            </span>
          </Link>
        </div>

        <div className="card rounded-3xl p-8 sm:p-9 bg-[#15102A] border border-[#261E4E] shadow-card-dark">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white text-center mb-2 tracking-tight">
            Member Portal
          </h1>
          <p className="text-xs sm:text-sm text-text-muted text-center mb-8 font-medium">
            Sign in with your campus club's administrator credentials
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Club email</label>
              <input
                required
                type="email"
                placeholder="club@clubhub.app"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-modern"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-modern"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs sm:text-sm font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-2xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary font-bold rounded-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm disabled:opacity-60 shadow-glow-sm cursor-pointer"
            >
              {authLoading ? "Authenticating…" : "Sign In to Dashboard"} <IconArrowRight width={16} height={16} />
            </button>
          </form>

          <div className="flex items-start gap-2.5 text-xs text-text-dim font-medium mt-7 pt-6 border-t border-[#1F193B]">
            <IconLock className="text-[#7C5CFC] shrink-0 mt-0.5" width={15} height={15} />
            <span>Clubs are provisioned by EventSync administrators — no public registration.</span>
          </div>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="card rounded-3xl p-5 mt-6 bg-[#130E28] border border-[#261E4E] text-center shadow-card-dark">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">1-Click Demo Access</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin("robotics@clubhub.app", "robotics123")}
              className="text-xs font-bold text-brand-lavender bg-[#201942] hover:bg-[#2B2158] border border-[#3E2F77] px-4 py-2.5 rounded-full transition-all w-full sm:w-auto text-center cursor-pointer shadow-2xs"
            >
              🤖 Robotics Club
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("coding@clubhub.app", "coding123")}
              className="text-xs font-bold text-brand-lavender bg-[#201942] hover:bg-[#2B2158] border border-[#3E2F77] px-4 py-2.5 rounded-full transition-all w-full sm:w-auto text-center cursor-pointer shadow-2xs"
            >
              💻 Coding Society
            </button>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
