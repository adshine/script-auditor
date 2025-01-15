import type { RewrittenScript } from '@/lib/api';

interface RewrittenScriptCardProps {
  rewrittenScript: RewrittenScript;
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Learning Objectives</h3>
        <ul className="list-disc pl-5 space-y-2">
          {rewrittenScript.learningObjectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div id="introduction" className="space-y-4">
        <h3 className="text-lg font-semibold">Introduction</h3>
        <div className="whitespace-pre-wrap">{rewrittenScript.introduction}</div>
      </div>

      <div id="main-content" className="space-y-4">
        <h3 className="text-lg font-semibold">Main Content</h3>
        <div className="whitespace-pre-wrap">{rewrittenScript.mainContent}</div>
      </div>

      <div id="conclusion" className="space-y-4">
        <h3 className="text-lg font-semibold">Conclusion</h3>
        <div className="whitespace-pre-wrap">{rewrittenScript.conclusion}</div>
      </div>

      <div id="call-to-action" className="space-y-4">
        <h3 className="text-lg font-semibold">Call to Action</h3>
        <div className="whitespace-pre-wrap">{rewrittenScript.callToAction}</div>
      </div>
    </div>
  );
} 