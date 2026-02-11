export default function JsonViewer({ json }) {
  const highlight = (jsonStr) => {
    return jsonStr.replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?)/g,
      (match) => {
        let cls = "text-blue-600"; // number

        if (/^"/.test(match)) {
          cls = /:$/.test(match)
            ? "text-red-600 font-medium" // key
            : "text-green-600"; // string
        } else if (/true|false/.test(match)) {
          cls = "text-purple-600";
        } else if (/null/.test(match)) {
          cls = "text-gray-500";
        }

        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  const formatted = JSON.stringify(json, null, 2);
  const highlighted = highlight(formatted);

  return (
    <pre
      className="text-sm"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
