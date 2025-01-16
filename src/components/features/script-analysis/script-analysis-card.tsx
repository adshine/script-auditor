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

export function ScriptAnalysisCard({ analysis }: { analysis: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-2">Score</h4>
        <p className="text-4xl font-bold">{analysis?.overallScore?.toFixed(1) || 'N/A'}</p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Technical Terms</h4>
        <div className="flex flex-wrap gap-2">
          {analysis?.technicalTerms?.map((term: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted rounded-md text-sm"
            >
              {term}
            </span>
          )) || 'No technical terms found'}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Readability Score</h4>
        <p className="text-4xl font-bold">{analysis?.readabilityScore?.toFixed(1) || 'N/A'}</p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Suggestions</h4>
        <ul className="list-disc pl-4 space-y-2">
          {analysis?.suggestions?.map((suggestion: string, index: number) => (
            <li key={index}>{suggestion}</li>
          )) || <li>No suggestions available</li>}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">Prioritized Improvements</h4>
        <ul className="list-disc pl-4 space-y-2">
          {analysis?.prioritizedImprovements?.map((improvement: string, index: number) => (
            <li key={index}>{improvement}</li>
          )) || <li>No improvements suggested</li>}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">Section Analysis</h4>
        <div className="space-y-4">
          {Object.entries(analysis?.sections || {}).map(([sectionName, section]: [string, any]) => (
            <div key={sectionName} className="border rounded-lg p-4">
              <div>
                <h4 className="font-medium mb-2">{sectionName}</h4>
                <p className="text-4xl font-bold">{section?.score?.toFixed(1) || 'N/A'}</p>
              </div>

              {section?.suggestions && section.suggestions.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Section Suggestions</h5>
                  <ul className="list-disc pl-4 space-y-2">
                    {section.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {section?.readabilityMetrics && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Readability Metrics</h5>
                  <div className="space-y-2">
                    <p>Flesch-Kincaid: {section.readabilityMetrics.fleschKincaid || 'N/A'}</p>
                    <p>Words per Sentence: {section.readabilityMetrics.wordsPerSentence || 'N/A'}</p>
                    {section.readabilityMetrics.technicalTerms && section.readabilityMetrics.technicalTerms.length > 0 && (
                      <div>
                        <p className="mb-1">Technical Terms:</p>
                        <div className="flex flex-wrap gap-2">
                          {section.readabilityMetrics.technicalTerms.map((term: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-muted rounded-md text-sm"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 