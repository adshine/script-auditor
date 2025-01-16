import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Section } from '@/lib/api';

interface ScriptAnalysisCardProps {
  analysis: {
    technicalTerms: string[];
    readabilityScore: number;
    suggestions: string[];
    overallScore: number;
    prioritizedImprovements: string[];
    sections: {
      introduction: Section;
      mainContent?: Section;
      conclusion?: Section;
    };
  };
}

export function ScriptAnalysisCard({ analysis }: ScriptAnalysisCardProps) {
  return (
    <Accordion type="multiple" className="space-y-4">
      <AccordionItem value="score" className="border-b-0">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline">
          Overall Score
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-4xl font-bold">{analysis.overallScore.toFixed(1)}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="terms" className="border-b-0">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline">
          Technical Terms
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {analysis.technicalTerms.map((term, index) => (
              <span key={index} className="px-2 py-1 bg-muted rounded-md text-base">
                {term}
              </span>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="introduction" className="border-b-0">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline">
          Introduction Analysis
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Score</h4>
              <p className="text-4xl font-bold">{analysis.sections.introduction.score.toFixed(1)}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Suggestions</h4>
              <ul className="list-disc pl-6 space-y-2">
                {analysis.sections.introduction.suggestions.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Readability Metrics</h4>
              <div className="space-y-2">
                <p>Flesch-Kincaid: {analysis.sections.introduction.readabilityMetrics.fleschKincaid.toFixed(1)}</p>
                <p>Words per Sentence: {analysis.sections.introduction.readabilityMetrics.wordsPerSentence.toFixed(1)}</p>
              </div>
            </div>
            {analysis.sections.introduction.aiEnhancements && (
              <div>
                <h4 className="font-medium mb-2">AI Enhancements</h4>
                <p className="whitespace-pre-wrap">{analysis.sections.introduction.aiEnhancements}</p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {analysis.sections.mainContent && (
        <AccordionItem value="main-content" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline">
            Main Content Analysis
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Score</h4>
                <p className="text-4xl font-bold">{analysis.sections.mainContent.score.toFixed(1)}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Suggestions</h4>
                <ul className="list-disc pl-6 space-y-2">
                  {analysis.sections.mainContent.suggestions.map((item, index) => (
                    <li key={index} className="text-base">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Readability Metrics</h4>
                <div className="space-y-2">
                  <p>Flesch-Kincaid: {analysis.sections.mainContent.readabilityMetrics.fleschKincaid.toFixed(1)}</p>
                  <p>Words per Sentence: {analysis.sections.mainContent.readabilityMetrics.wordsPerSentence.toFixed(1)}</p>
                </div>
              </div>
              {analysis.sections.mainContent.aiEnhancements && (
                <div>
                  <h4 className="font-medium mb-2">AI Enhancements</h4>
                  <p className="whitespace-pre-wrap">{analysis.sections.mainContent.aiEnhancements}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {analysis.sections.conclusion && (
        <AccordionItem value="conclusion" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline">
            Conclusion Analysis
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Score</h4>
                <p className="text-4xl font-bold">{analysis.sections.conclusion.score.toFixed(1)}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Suggestions</h4>
                <ul className="list-disc pl-6 space-y-2">
                  {analysis.sections.conclusion.suggestions.map((item, index) => (
                    <li key={index} className="text-base">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Readability Metrics</h4>
                <div className="space-y-2">
                  <p>Flesch-Kincaid: {analysis.sections.conclusion.readabilityMetrics.fleschKincaid.toFixed(1)}</p>
                  <p>Words per Sentence: {analysis.sections.conclusion.readabilityMetrics.wordsPerSentence.toFixed(1)}</p>
                </div>
              </div>
              {analysis.sections.conclusion.aiEnhancements && (
                <div>
                  <h4 className="font-medium mb-2">AI Enhancements</h4>
                  <p className="whitespace-pre-wrap">{analysis.sections.conclusion.aiEnhancements}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="suggestions" className="border-b-0">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline">
          Improvement Suggestions
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-6 space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-base">{suggestion}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="priorities" className="border-b-0">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline">
          Prioritized Improvements
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-6 space-y-2">
            {analysis.prioritizedImprovements.map((improvement, index) => (
              <li key={index} className="text-base">{improvement}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 