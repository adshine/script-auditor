import type { RewrittenScript } from '@/lib/api';

interface RewrittenScriptCardProps {
  rewrittenScript: RewrittenScript;
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Rewritten Script</h2>
      </div>
      <div className="space-y-6">
        {/* Learning Objectives */}
        <div>
          <h3 className="font-medium text-foreground mb-2">Learning Objectives</h3>
          <ul className="list-disc pl-6 space-y-1">
            {rewrittenScript.learningObjectives.map((objective, index) => (
              <li key={index} className="text-muted-foreground">{objective}</li>
            ))}
          </ul>
        </div>

        {/* Introduction */}
        <div>
          <h3 className="font-medium text-foreground mb-2">Introduction</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.introduction}</p>
        </div>

        {/* Main Content */}
        <div>
          <h3 className="font-medium text-foreground mb-2">Main Content</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.mainContent}</p>
        </div>

        {/* Conclusion */}
        <div>
          <h3 className="font-medium text-foreground mb-2">Conclusion</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.conclusion}</p>
        </div>

        {/* Call to Action */}
        <div>
          <h3 className="font-medium text-foreground mb-2">Call to Action</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.callToAction}</p>
        </div>
      </div>
    </div>
  );
} 