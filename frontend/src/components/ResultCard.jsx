import { motion } from "framer-motion";
import { tactileButton } from "../animations";
import ConfidenceBar from "./ConfidenceBar";
import OutputPanel from "./OutputPanel";
import { useParallax } from "../useParallax";

export default function ResultCard({ data, onReset }) {
  const parallax = useParallax(18);

  return (
    <motion.div
      style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
      className="
        bg-white dark:bg-slate-900
        ring-1 ring-slate-200/60 dark:ring-slate-700/60
        mt-6 p-6 rounded-xl shadow
        text-slate-900 dark:text-slate-100
      "
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
    >
      <h3 className="text-lg font-bold mb-3">
        Extracted Summary
      </h3>

      <p><b>Dealer:</b> {data.dealer_name}</p>
      <p><b>Model:</b> {data.model_name}</p>
      <p><b>HP:</b> {data.horse_power}</p>
      <p><b>Cost:</b> ₹{data.asset_cost}</p>

      <ConfidenceBar value={data.confidence} />
      <OutputPanel data={data} />

      <motion.button
        {...tactileButton}
        onClick={onReset}
        className="
          mt-6 px-4 py-2 rounded
          bg-slate-200 dark:bg-slate-700
          text-slate-800 dark:text-slate-100
        "
      >
        Upload Another Document
      </motion.button>
    </motion.div>
  );
}
