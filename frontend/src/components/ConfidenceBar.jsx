export default function ConfidenceBar({ value }) {
  let confidence = Number(value);

  if (Number.isNaN(confidence)) confidence = 0;

  // Handle percentage values (e.g. 87)
  if (confidence > 1) confidence = confidence / 100;

  const percent = Math.round(confidence * 100);

  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-1">
        Confidence: {percent}%
      </p>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-500 h-3 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
