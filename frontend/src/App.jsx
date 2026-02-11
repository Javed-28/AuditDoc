import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import Footer from "./components/Footer";
import AIInsights from "./components/AIInsights";
import RippleBackground from "./components/RippleBackground";
import { applyTheme, getSavedTheme } from "./theme";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getSavedTheme());
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <RippleBackground />

      <div className="relative z-10">
        <Navbar theme={theme} setTheme={setTheme} />

        <motion.main
          className="p-6 max-w-5xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* ✅ Upload card ONLY when no result */}
          {!result && (
            <UploadCard
              key={resetKey}
              setResult={setResult}
              setLoading={setLoading}
            />
          )}

          {!result && !loading && <AIInsights />}

          {loading && (
            <div className="mt-6 text-indigo-600 dark:text-indigo-400">
              Processing document…
            </div>
          )}

          <AnimatePresence>
            {result && (
              <ResultCard
                data={result[0]}
                onReset={() => {
                  setResult(null);
                  setResetKey((k) => k + 1);
                }}
              />
            )}
          </AnimatePresence>
        </motion.main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
