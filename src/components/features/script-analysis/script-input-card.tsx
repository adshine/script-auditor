import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModelSelector } from './model-selector';
import { LanguageSelector } from './language-selector';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';

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
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language].ui.input;

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold ml-[-6px]">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder={t.placeholder}
          className="min-h-[100px] resize-none rounded-t-xl bg-[#f0faf0] border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex items-center justify-between px-4 py-2 bg-[#f0faf0] rounded-b-xl gap-2">
          <div className="flex-1 flex items-center gap-4">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
          <Button
            onClick={onAnalyze}
            disabled={loading || !script.trim()}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-sm rounded-lg px-6"
            variant="default"
          >
            {loading && (
              <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t.analyze}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 