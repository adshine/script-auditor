import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScriptAnalysis as ScriptAnalysisType, Section } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ScriptAnalysisProps {
  analysis: ScriptAnalysisType;
}

const ScoreIndicator = ({ score }: { score: number }) => {
  const Icon = score >= 9 ? CheckCircleIcon : score >= 8 ? ExclamationTriangleIcon : XCircleIcon;
  const color = score >= 9 ? 'text-green-500' : score >= 8 ? 'text-blue-500' : 'text-red-500';
  
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className="h-5 w-5" />
      <span className="font-semibold">{score.toFixed(1)}/10</span>
    </div>
  );
};

const Suggestion = ({ text }: { text: string }) => {
  const isImplemented = text.includes('[IMPLEMENTED]');
  const cleanText = text.replace('[IMPLEMENTED]', '').trim();
  
  return (
    <li className={cn(
      "text-sm flex items-start gap-2",
      isImplemented ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
    )}>
      {isImplemented && <Badge variant="default" className="mt-0.5 bg-green-500 hover:bg-green-600">Implemented</Badge>}
      <span>{cleanText}</span>
    </li>
  );
};

export default function ScriptAnalysis({ analysis }: ScriptAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-muted-foreground">Overall Score:</span>
            <ScoreIndicator score={analysis.analysis.overallScore} />
          </div>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="improvements">
              <AccordionTrigger>Priority Improvements</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {analysis.analysis.prioritizedImprovements.map((improvement: string, index: number) => (
                    <Suggestion key={index} text={improvement} />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {Object.entries(analysis.analysis.sections).map(([sectionName, section]: [string, Section]) => (
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
                <ul className="space-y-2">
                  {section.suggestions.map((suggestion: string, index: number) => (
                    <Suggestion key={index} text={suggestion} />
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
                        {section.readabilityMetrics.technicalTerms.map((term: string, index: number) => (
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