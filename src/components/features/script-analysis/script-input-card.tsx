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
    <Card className="shadow-none border-none bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-[#666C7E]">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder={t.placeholder}
          className="min-h-[100px] resize-none rounded-2xl bg-white border border-[#E5E7EB] text-[#666C7E] placeholder:text-[#666C7E]/60 focus-visible:ring-1 focus-visible:ring-[#E5E7EB] focus-visible:border-[#E5E7EB]"
        />
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
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
            className="bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#666C7E] text-sm font-medium rounded-xl w-full transition-colors"
            variant="ghost"
          >
            {loading && (
              <ArrowPathIcon className="mr-4 h-4 w-4 animate-spin" />
            )}
            {t.analyze}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 