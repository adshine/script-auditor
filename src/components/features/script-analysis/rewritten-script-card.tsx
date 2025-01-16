import { Button } from "@/components/ui/button";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface RewrittenScriptCardProps {
  rewrittenScript: {
    learningObjectives: string[];
    introduction: string;
    mainContent: string;
    conclusion: string;
    callToAction: string;
  };
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  const handleCopy = () => {
    const fullScript = `Learning Objectives:
${rewrittenScript.learningObjectives.map(obj => `- ${obj}`).join('\n')}

Introduction:
${rewrittenScript.introduction}

Main Content:
${rewrittenScript.mainContent}

Conclusion:
${rewrittenScript.conclusion}

Call to Action:
${rewrittenScript.callToAction}`;

    navigator.clipboard.writeText(fullScript).then(() => {
      toast.success('Script copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy script');
    });
  };

  return (
    <div className="space-y-8">
      <div className="sticky top-0 bg-background z-10 border-b border-border px-6 py-3 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Rewritten Script</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          Copy
        </Button>
      </div>

      <div id="learning-objectives" className="space-y-2">
        <h3 className="text-xl font-semibold">Learning Objectives</h3>
        <ul className="list-disc pl-6 space-y-2 text-base">
          {rewrittenScript.learningObjectives.map((objective, index) => (
            <li key={index} className="text-base">{objective}</li>
          ))}
        </ul>
      </div>

      <div id="introduction" className="space-y-2">
        <h3 className="text-xl font-semibold">Introduction</h3>
        <p className="text-base whitespace-pre-wrap">{rewrittenScript.introduction}</p>
      </div>

      <div id="main-content" className="space-y-2">
        <h3 className="text-xl font-semibold">Main Content</h3>
        <p className="text-base whitespace-pre-wrap">{rewrittenScript.mainContent}</p>
      </div>

      <div id="conclusion" className="space-y-2">
        <h3 className="text-xl font-semibold">Conclusion</h3>
        <p className="text-base whitespace-pre-wrap">{rewrittenScript.conclusion}</p>
      </div>

      <div id="call-to-action" className="space-y-2">
        <h3 className="text-xl font-semibold">Call to Action</h3>
        <p className="text-base whitespace-pre-wrap">{rewrittenScript.callToAction}</p>
      </div>
    </div>
  );
} 