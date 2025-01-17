import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModelSelector } from './model-selector';
import { availableModels } from '@/lib/models';

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
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4">
          <CardTitle>Input Script</CardTitle>
          <div className="w-full sm:w-64">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange}
              showFreeOnly={showFreeOnly}
              onShowFreeOnlyChange={onShowFreeOnlyChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
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
      </CardContent>
    </Card>
  );
} 