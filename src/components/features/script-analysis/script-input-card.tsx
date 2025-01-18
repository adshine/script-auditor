import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModelSelector } from './model-selector';

interface ScriptInputCardProps {
  script: string;
  onScriptChange: (script: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ScriptInputCard({
  script,
  onScriptChange,
  onAnalyze,
  loading,
  selectedModel,
  onModelChange,
}: ScriptInputCardProps) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold ml-[-6px]">Input Script</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
        <Textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="Paste your tutorial script here..."
          className="min-h-[120px] resize-none rounded-xl"
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