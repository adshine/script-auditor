export function ScoreIndicator({ score }: { score: number }) {
  let color;
  if (score >= 9) color = "bg-green-100 text-green-800";
  else if (score >= 8) color = "bg-blue-100 text-blue-800";
  else if (score >= 7) color = "bg-yellow-100 text-yellow-800";
  else color = "bg-red-100 text-red-800";

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {score.toFixed(1)}/10
    </div>
  );
} 