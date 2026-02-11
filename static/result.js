let isJSON = true;
let collapsed = false;

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  showJSON();

  // Success fade-in
  setTimeout(() => {
    const box = document.getElementById("successBox");
    if (box) box.classList.add("show");
  }, 100);
});

/* ================= SIZE (BULLETPROOF) ================= */
/*
  - Always calculate from the SAME Blob that will be downloaded
  - Show KB for small files, MB for larger ones
*/
function formatSizeFromBlob(blob) {
  const bytes = blob.size;

  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

/* ================= VIEW SWITCH ================= */
function showJSON() {
  isJSON = true;
  collapsed = false;

  // RAW JSON (never read from rendered HTML)
  const raw = jsonData.textContent;

  renderJSONWithLines(raw);

  const blob = new Blob([raw], {
    type: "application/json;charset=utf-8"
  });

  const sizeLabel = formatSizeFromBlob(blob);

  downloadData.value = raw;
  downloadForm.action = "/download/json";
  downloadBtn.innerText = `Download .json (${sizeLabel})`;
  downloadBtn.title = "Downloads current JSON output";

  collapseBtn.style.display = "inline-block";
  collapseBtn.innerText = "Collapse JSON";
}

function showTXT() {
  isJSON = false;
  collapsed = false;

  const raw = txtData.textContent;

  renderPlainText(raw);

  const blob = new Blob([raw], {
    type: "text/plain;charset=utf-8"
  });

  const sizeLabel = formatSizeFromBlob(blob);

  downloadData.value = raw;
  downloadForm.action = "/download/txt";
  downloadBtn.innerText = `Download .txt (${sizeLabel})`;
  downloadBtn.title = "Downloads current text output";

  collapseBtn.style.display = "none";
}

/* ================= COLLAPSE / EXPAND ================= */
function toggleCollapse() {
  if (!isJSON) return;

  collapsed = !collapsed;

  if (collapsed) {
    const compact = JSON.stringify(
      JSON.parse(jsonData.textContent)
    );
    renderPlainText(compact);
    collapseBtn.innerText = "Expand JSON";
  } else {
    renderJSONWithLines(jsonData.textContent);
    collapseBtn.innerText = "Collapse JSON";
  }
}

/* ================= COPY ================= */
function copyOutput() {
  navigator.clipboard.writeText(outputBox.innerText);

  const feedback = document.getElementById("copyFeedback");

  copyBtn.classList.add("copied");
  feedback.classList.add("show");

  setTimeout(() => {
    feedback.classList.remove("show");
    copyBtn.classList.remove("copied");
  }, 1200);
}


/* ================= RENDER HELPERS ================= */
function renderJSONWithLines(raw) {
  const lines = raw.split("\n");
  const numbers = lines.map((_, i) => i + 1).join("\n");
  const highlighted = highlightJSON(raw);

  outputBox.innerHTML = `
    <div class="json-container">
      <pre class="json-lines">${numbers}</pre>
      <pre class="json-content">${highlighted}</pre>
    </div>
  `;
}

function renderPlainText(raw) {
  outputBox.innerText = raw;
}

/* ================= JSON SYNTAX HIGHLIGHT ================= */
function highlightJSON(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+)/g,
    match => {
      let cls = "json-number";

      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }

      return `<span class="${cls}">${match}</span>`;
    }
  );
}
