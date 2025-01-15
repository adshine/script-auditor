import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TechnicalTerms } from './technical-terms';
import { Badge } from '@/components/ui/badge';
import type { ScriptAnalysis } from '@/lib/api';

interface ScriptAnalysisCardProps {
  analysis: ScriptAnalysis['analysis'];
}

export function ScriptAnalysisCard({ analysis }: ScriptAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Technical Terms</h3>
          <TechnicalTerms terms={analysis.technicalTerms} />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Readability Score</h3>
          <Badge variant={analysis.readabilityScore >= 8 ? 'default' : 'secondary'}>
            {analysis.readabilityScore.toFixed(1)}/10
          </Badge>
        </div>

        <div>
          <h3 className="font-medium mb-2">Suggestions</h3>
          <ul className="list-disc pl-4 space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 