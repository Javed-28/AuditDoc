import { motion } from "framer-motion";

export default function Toast({ message, type = "info" }) {
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-indigo-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="relative"
    >
      {/* Toast box */}
      <div
        className={`
          ${colors[type]}
          text-white text-sm
          px-4 py-2 rounded-lg
          shadow-lg
          whitespace-nowrap
        `}
      >
        {message}
      </div>

      {/* 🔻 Arrow pointer */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2
          top-full
          w-0.5 h-3
          ${colors[type]}
          rotate-0
        `}
      />
    </motion.div>
  );
}
