import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const insights = [
  { icon: "📄", text: "Detecting tractor model…" },
  { icon: "🏷️", text: "Extracting dealer name…" },
  { icon: "🏦", text: "Verifying bank details…" },
  { icon: "🖊️", text: "Scanning signatures…" },
  { icon: "🧠", text: "Computing confidence score…" },
];

export default function AIInsights() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % insights.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="mt-10 p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg border dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-semibold text-lg mb-4">
        🧠 AI Insight Engine
      </h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 text-slate-700 dark:text-slate-200"
        >
          <span className="text-xl">{insights[index].icon}</span>
          <span>{insights[index].text}</span>
        </motion.div>
      </AnimatePresence>

      {/* confidence bar */}
      <div className="mt-4">
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: ["40%", "85%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
        <p className="text-xs mt-2 text-slate-500">
          Confidence adapting to document quality
        </p>
      </div>
    </motion.div>
  );
}
