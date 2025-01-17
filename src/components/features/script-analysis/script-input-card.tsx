import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ModelSelector } from './model-selector';

interface ScriptInputCardProps {
  script: string;
  onScriptChange: (script: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  showFreeOnly: boolean;
  onShowFreeOnlyChange: (showFree: boolean) => void;
}

export function ScriptInputCard({
  script,
  onScriptChange,
  onAnalyze,
  loading,
  selectedModel,
  onModelChange,
  showFreeOnly,
  onShowFreeOnlyChange
}: ScriptInputCardProps) {
  return (
    <div className="flex flex-col h-full p-0">
      <div className="border-b border-border">
        <div className="px-6 py-3">
          <h2 className="text-2xl font-semibold">Input Script</h2>
        </div>
      </div>
      <div className="px-6 py-3 border-b border-border">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          showFreeOnly={showFreeOnly}
          onShowFreeOnlyChange={onShowFreeOnlyChange}
        />
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <Textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="Paste your tutorial script here..."
            className="min-h-[200px] resize-none"
          />
          <Button
            onClick={onAnalyze}
            disabled={loading || !script.trim()}
            className="w-full"
            variant="default"
          >
            {loading && (
              <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Analyze Script
          </Button>
        </div>
      </div>
    </div>
  );
} 