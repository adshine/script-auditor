import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="w-full bg-white rounded-xl shadow-none border border-gray-100 overflow-hidden">
      <textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        placeholder={t.placeholder}
        className="w-full max-h-[200px] p-3 pb-12 text-base rounded-xl bg-white border border-gray-100 resize-none focus:outline-none placeholder:text-gray-500"
      />
      
      <div className="w-full bg-gray-50 px-[12px] py-[4px] pr-[6px] flex items-between justify-between gap-4 -mt-5 pt-4 items-center">
        <div className="flex gap-2">
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
          className="bg-green-200 hover:bg-green-300 text-green-800 px-2 rounded-lg disabled:text-gray-500 disabled:border-gray-300 disabled:bg-white disabled:hover:border-gray-300 disabled:cursor-not-allowed disabled:shadow-none shadow-none h-8 w-8"
        >
          {loading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
} 