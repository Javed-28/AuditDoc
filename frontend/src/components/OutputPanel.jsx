import { useState } from "react";
import { motion } from "framer-motion";
import JsonViewer from "./JsonViewer";
import { tactileButton } from "../animations";

export default function OutputPanel({ data }) {
  const [mode, setMode] = useState("json");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const jsonText = JSON.stringify(data, null, 2);

  const txtText = `
Dealer Name   : ${data.dealer_name}
Model Name    : ${data.model_name}
Horse Power   : ${data.horse_power}
Asset Cost    : ${data.asset_cost}
Confidence    : ${data.confidence}
`.trim();

  const activeText = mode === "json" ? jsonText : txtText;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    const blob = new Blob([activeText]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = mode === "json" ? "result.json" : "result.txt";
    a.click();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1200);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-3">
        <motion.button
          {...tactileButton}
          onClick={() => setMode(m => (m === "json" ? "txt" : "json"))}
          className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Switch to {mode === "json" ? "TXT" : "JSON"}
        </motion.button>

        <motion.button
          {...tactileButton}
          onClick={handleCopy}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {copied ? "✓ Copied" : "Copy"}
        </motion.button>

        <motion.button
          {...tactileButton}
          onClick={handleDownload}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {downloaded ? "✓ Downloaded" : "Download"}
        </motion.button>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-100 dark:bg-slate-900 border rounded p-4 max-h-96 overflow-auto font-mono"
      >
        {mode === "json" ? (
          <JsonViewer json={data} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{txtText}</pre>
        )}
      </motion.div>
    </div>
  );
}
