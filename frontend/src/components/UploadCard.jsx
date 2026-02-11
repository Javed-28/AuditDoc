import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { processDocument } from "../api";
import Toast from "./Toast";
import { tactileButton } from "../animations";
import { useParallax } from "../useParallax";

export default function UploadCard({ setResult, setLoading }) {
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const [shake, setShake] = useState(false);

  const parallax = useParallax(35);

  const showToast = (message, type = "info") => {
    setToast({ message, type });

    if (type === "error") {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }

    setTimeout(() => setToast(null), 1500);
  };

  const handleUpload = async () => {
    if (!file) {
      showToast("Please select a file", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await processDocument(file);
      setResult(res.data);
      showToast("Document processed successfully", "success");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        x: shake ? [-4, 4, -2, 2, 0] : 0,
      }}
      transition={{
        opacity: { duration: 0.4 },
        y: { duration: 0.4 },
        x: { duration: 0.3, ease: "easeOut" },
      }}
      className="
        bg-white dark:bg-slate-900
        ring-1 ring-slate-200/60 dark:ring-slate-700/60
        shadow-xl rounded-xl p-6
        text-slate-900 dark:text-slate-100
      "
    >
      <h2 className="text-xl font-semibold mb-4">
        Upload Tractor Document
      </h2>

      {/* FILE INPUT + LEFT-SHIFTED TOAST */}
      <div className="relative mb-4 inline-block">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setShowPreview(false);
          }}
          className="block text-sm"
        />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute bottom-full mb-2 left-0 z-10"
            >
              <Toast message={toast.message} type={toast.type} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BUTTON ROW */}
      <div className="flex items-center gap-3 mb-4">
        {file && (
          <motion.button
            {...tactileButton}
            onClick={() => setShowPreview(v => !v)}
            className="
              px-3 py-1 rounded
              bg-slate-200 dark:bg-slate-700
              hover:bg-slate-300 dark:hover:bg-slate-600
              text-slate-800 dark:text-slate-100
            "
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </motion.button>
        )}

        <motion.button
          {...tactileButton}
          onClick={handleUpload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Process Document
        </motion.button>
      </div>

      {/* PREVIEW */}
      <AnimatePresence>
        {showPreview && file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded p-3 bg-slate-100 dark:bg-slate-950"
          >
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                className="max-h-80 mx-auto"
                alt="Preview"
              />
            ) : (
              <iframe
                src={URL.createObjectURL(file)}
                className="w-full h-80"
                title="PDF Preview"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
