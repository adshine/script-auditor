'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RootLayout } from '@/components/layout/root-layout';
import { ScriptInputCard } from '@/components/features/script-analysis/script-input-card';
import { ScriptAnalysisCard } from '@/components/features/script-analysis/script-analysis-card';
import { RewrittenScriptCard } from '@/components/features/script-analysis/rewritten-script-card';
import { availableModels } from '@/lib/models';
import type { ScriptAnalysis } from '@/lib/api';
import { FileSearch, FileText } from 'lucide-react';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';

async function analyzeScriptAPI(script: string, model: string, language: string): Promise<ScriptAnalysis> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script, model, language }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || `Analysis failed: ${response.statusText}`);
    }

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid API response structure: Response is not an object');
    }

    const { analysis, rewrittenScript } = data;
    if (!analysis || !rewrittenScript) {
      throw new Error('Invalid API response structure: Missing required fields');
    }

    return data as ScriptAnalysis;
  } catch (error) {
    console.error('Error analyzing script:', error);
    throw error;
  }
}

export default function AnalyzePage() {
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language].ui;

  // Load stored analysis on mount
  useEffect(() => {
    try {
      const storedAnalysis = localStorage.getItem('scriptAnalysis');
      if (storedAnalysis) {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);
        // Clear the stored analysis to prevent showing old results on refresh
        localStorage.removeItem('scriptAnalysis');
      }
    } catch (error) {
      console.error('Error loading stored analysis:', error);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      toast.error(t.input.placeholder);
      return;
    }
    
    setLoading(true);
    try {
      const result = await analyzeScriptAPI(script, selectedModel, language);
      setAnalysis(result);
      toast.success('Script analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Left Side */}
        <div className="w-[400px] border-r flex flex-col">
          {/* Analysis Container */}
          <div className="flex-1 overflow-auto">
            {analysis ? (
              <ScriptAnalysisCard analysis={analysis.analysis} />
            ) : (
              <div className="h-full flex flex-col">
                <div className="sticky top-0 bg-background z-10">
                  <h2 className="text-l font-semibold py-3 px-4">{t.analysis.title}</h2>
                  <hr className="border-t" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm space-y-4">
                  <FileSearch className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
                  <div className="space-y-1">
                    <p>{t.input.placeholder}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Script Input Container - Fixed at bottom */}
          <div className="border-t bg-background">
            <ScriptInputCard
              script={script}
              onScriptChange={setScript}
              onAnalyze={handleAnalyze}
              loading={loading}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        </div>

        {/* Right Side - Rewritten Script */}
        <div className="flex-1 overflow-auto">
          {analysis ? (
            <RewrittenScriptCard rewrittenScript={analysis.rewrittenScript} />
          ) : (
            <div className="h-full flex flex-col">
              <div className="sticky top-0 bg-background z-10">
                <h2 className="text-l font-semibold py-3 px-4">{t.rewrittenScript.title}</h2>
                <hr className="border-t" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm space-y-4">
                <FileText className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
                <div className="space-y-1">
                  <p>{t.rewrittenScript.title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
