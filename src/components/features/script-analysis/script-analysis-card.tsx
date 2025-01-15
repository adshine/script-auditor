import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ScriptAnalysis } from '@/lib/api';

interface ScriptAnalysisCardProps {
  analysis: ScriptAnalysis;
}

const ScoreIndicator = ({ score }: { score: number }) => {
  const Icon = score >= 8 ? CheckCircleIcon : score >= 6 ? ExclamationTriangleIcon : XCircleIcon;
  const colorClass = score >= 8 
    ? 'text-primary' 
    : score >= 6 
    ? 'text-yellow-500 dark:text-yellow-400' 
    : 'text-destructive';
  
  return (
    <div className={cn('flex items-center gap-2', colorClass)}>
      <Icon className="h-5 w-5" />
      <span className="font-semibold">{score.toFixed(1)}/10</span>
    </div>
  );
};

export function ScriptAnalysisCard({ analysis }: ScriptAnalysisCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-muted-foreground">Overall Score:</span>
            <ScoreIndicator score={analysis.overallScore} />
          </div>
          
          <h3 className="font-medium text-foreground mb-2">Priority Improvements:</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {analysis.prioritizedImprovements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {Object.entries(analysis.sections).map(([sectionName, section]) => (
        <Card key={sectionName}>
          <CardHeader>
            <CardTitle className="capitalize">
              {sectionName.replace(/([A-Z])/g, ' $1').trim()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-muted-foreground">Section Score:</span>
              <ScoreIndicator score={section.score} />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Suggestions:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {section.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Readability Metrics:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Flesch-Kincaid Grade Level: {section.readabilityMetrics.fleschKincaid.toFixed(1)}</p>
                  <p>Average Words per Sentence: {section.readabilityMetrics.wordsPerSentence.toFixed(1)}</p>
                  {section.readabilityMetrics.technicalTerms.length > 0 && (
                    <div>
                      <p>Technical Terms Used:</p>
                      <ul className="list-disc list-inside ml-4">
                        {section.readabilityMetrics.technicalTerms.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {section.aiEnhancements && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">AI-Suggested Improvements:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{section.aiEnhancements}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 