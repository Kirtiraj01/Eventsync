import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="border-t border-[#1F193B] mt-28 bg-[#0B0814]"
    >
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C5CFC] shadow-glow-sm animate-pulse" />
          <p className="font-medium text-text-main">
            © 2026 <span className="font-bold text-brand-lavender">EventSync.</span> Built for campus events everywhere.
          </p>
        </div>
        <p className="text-xs text-text-dim font-medium">
          Instant QR Tickets • Verified PDF Certificates • Multi-Tenant
        </p>
      </div>
    </motion.footer>
  );
}
