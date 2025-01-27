'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RootLayout } from '@/components/layout/root-layout';
import { ScriptInputCard } from '@/components/features/script-analysis/script-input-card';
import { ScriptAnalysisCard } from '@/components/features/script-analysis/script-analysis-card';
import { RewrittenScriptCard } from '@/components/features/script-analysis/rewritten-script-card';
import { availableModels } from '@/lib/models';
import type { ScriptAnalysis } from '@/lib/api';
import { FileSearch, FileText, Copy } from 'lucide-react';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';

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
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language].ui;
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      toast.error(t.analysis.title);
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

  const handleCopy = async () => {
    if (analysis?.rewrittenScript) {
      try {
        const fullScript = `${analysis.rewrittenScript.introduction}\n\n${analysis.rewrittenScript.mainContent}\n\n${analysis.rewrittenScript.conclusion}\n\n${analysis.rewrittenScript.callToAction}`;
        await navigator.clipboard.writeText(fullScript);
        
        toast(t.rewrittenScript.copied, {
          description: t.rewrittenScript.copyAll
        });
      } catch (error) {
        toast.error(t.rewrittenScript.copyError, {
          description: t.rewrittenScript.copyError
        });
      }
    }
  };

  return (
    <RootLayout>
      <div className="relative flex h-screen overflow-hidden">
        {/* Analysis Section - Hidden on Mobile */}
        <div className="hidden md:flex w-[400px] border-r flex-col">
          <div className="flex-1 overflow-auto">
            {analysis ? (
              <ScriptAnalysisCard analysis={analysis.analysis} />
            ) : (
              <div className="h-full flex flex-col">
                <div className="sticky top-0 bg-background z-10">
                  <div className="flex h-10 items-center justify-between px-4 border-b">
                    <h2 className="text-l font-semibold">{t.analysis.title}</h2>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm space-y-4">
                  <FileSearch className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
                  <div className="space-y-1">
                    <p>{t.analysis.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rewritten Script - Full Width on Mobile */}
        <div className="flex-1 overflow-auto pb-32">
          <div className="sticky top-0 bg-background z-10">
            <div className="flex h-10 items-center justify-between px-4 border-b">
              <h2 className="text-l font-semibold">{t.rewrittenScript.title}</h2>
              <div className="flex items-center gap-2">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnalysisModal(true)}
                  >
                    View Analysis
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="px-3"
                  disabled={!analysis}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {analysis ? (
            <RewrittenScriptCard rewrittenScript={analysis.rewrittenScript} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm space-y-4">
              <FileText className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
              <div className="space-y-1">
                <p>{t.analysis.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Card */}
        <div className="absolute bottom-4 left-4 right-4 md:w-[367px] bg-background rounded-xl shadow-lg border">
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

      {/* Analysis Modal for Mobile */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="max-w-full sm:max-w-[600px] h-[80vh] overflow-auto">
          {analysis && <ScriptAnalysisCard analysis={analysis.analysis} />}
        </DialogContent>
      </Dialog>
    </RootLayout>
  );
}
