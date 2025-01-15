import type { ScriptAnalysis } from '@/lib/api';

interface ScriptAnalysisCardProps {
  analysis: ScriptAnalysis['analysis'];
}

export function ScriptAnalysisCard({ analysis }: ScriptAnalysisCardProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Overall Score</h3>
        <div className="text-4xl font-bold">{analysis.overallScore.toFixed(1)}</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Technical Terms</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.technicalTerms.map((term, index) => (
            <span key={index} className="px-2 py-1 bg-muted rounded-md text-sm">
              {term}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suggestions</h3>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Prioritized Improvements</h3>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.prioritizedImprovements.map((improvement, index) => (
            <li key={index}>{improvement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 