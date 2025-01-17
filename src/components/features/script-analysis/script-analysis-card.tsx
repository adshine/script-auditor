import { Badge } from '@/components/ui/badge';
import type { ScriptAnalysis } from '@/lib/api';
import { Check, Circle } from "lucide-react";

interface ScriptAnalysisCardProps {
  analysis: ScriptAnalysis['analysis'];
}

function ScoreIndicator({ score }: { score: number }) {
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

function Suggestion({ text }: { text: string }) {
  const isImplemented = text.includes("[IMPLEMENTED]");
  const cleanText = text.replace("[IMPLEMENTED]", "").trim();
  
  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-shrink-0 w-5 h-5 mt-0.5">
        {isImplemented ? (
          <div className="rounded-full bg-green-50 p-1">
            <Check className="h-3 w-3 text-green-600" />
          </div>
        ) : (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
      </div>
      <span className={isImplemented ? "text-gray-700" : "text-gray-600"}>
        {cleanText}
      </span>
    </div>
  );
}

export function ScriptAnalysisCard({ analysis }: ScriptAnalysisCardProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Analysis</h2>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Overall Score</h3>
          <ScoreIndicator score={analysis.overallScore} />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Prioritized Improvements</h3>
          <div className="space-y-2">
            {analysis.prioritizedImprovements.map((improvement, index) => (
              <Suggestion key={index} text={improvement} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Technical Terms</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.technicalTerms.map((term, index) => (
              <Badge key={index} variant="secondary">
                {term}
              </Badge>
            ))}
          </div>
        </div>

        {Object.entries(analysis.sections).map(([sectionName, section]) => (
          <div key={sectionName}>
            <h3 className="font-semibold mb-2 capitalize">{sectionName}</h3>
            <div className="space-y-2">
              {section.suggestions.map((suggestion, index) => (
                <Suggestion key={index} text={suggestion} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 