'use client';

import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { RootLayout } from '@/components/layout/root-layout';
import { ScriptInputCard } from '@/components/features/script-analysis/script-input-card';
import { ScriptAnalysisCard } from '@/components/features/script-analysis/script-analysis-card';
import { RewrittenScriptCard } from '@/components/features/script-analysis/rewritten-script-card';
import { availableModels } from '@/lib/models';
import type { ScriptAnalysis } from '@/lib/api';
import { FileSearch, FileText, Copy } from 'lucide-react';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useToast } from '@/hooks/use-toast';

async function analyzeScriptAPI(script: string, model: string, language: string): Promise<ScriptAnalysis> {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  // Validate script length before sending
  if (script.length > 100000) {
    throw new Error('Script is too long. Please reduce the length and try again.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Sending request with model ${model} and language ${language}`);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: script.trim(),
          model,
          language
        }),
      });

      let data;
      try {
        const textResponse = await response.text();
        console.log(`Attempt ${attempt}: Raw response:`, textResponse);
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error(`Attempt ${attempt}: Failed to parse response:`, parseError);
        if (attempt === maxRetries) {
          throw new Error('Failed to parse API response. Please try again.');
        }
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        continue;
      }

      // Check if the response has the expected structure
      if (!response.ok || !data || typeof data !== 'object') {
        console.error(`Attempt ${attempt}: Invalid response:`, {
          status: response.status,
          ok: response.ok,
          data
        });
        
        if (attempt === maxRetries) {
          throw new Error(data?.details || data?.error || `Analysis failed: ${response.statusText}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        continue;
      }

      // Validate the response structure
      const { analysis, rewrittenScript } = data;
      if (!analysis || !rewrittenScript) {
        console.error(`Attempt ${attempt}: Missing required fields:`, {
          hasAnalysis: !!analysis,
          hasRewrittenScript: !!rewrittenScript,
          data
        });
        
        if (attempt === maxRetries) {
          throw new Error('Invalid API response structure: Missing required fields');
        }
        
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        continue;
      }

      console.log('Analysis completed successfully');
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
    }
  }

  throw new Error('Failed to analyze script after all retries');
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
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: t.input.placeholder,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      toast({
        title: "Analyzing",
        description: t.input.analyzing || 'Analyzing your script...',
        variant: "default"
      });
      
      const result = await analyzeScriptAPI(script, selectedModel, language);
      setAnalysis(result);
      
      toast({
        title: "Success",
        description: t.input.analysisComplete || 'Analysis completed successfully',
        variant: "default"
      });
    } catch (error) {
      console.error('Error analyzing script:', error);
      const errorMessage = error instanceof Error ? error.message : t.input.analysisFailed || 'Failed to analyze script. Please try again.';
      
      if (errorMessage.toLowerCase().includes('rate limit')) {
        toast({
          title: "Error",
          description: (
            <div className="flex flex-col gap-2">
              <p>{t.input.rateLimitExceeded || 'Rate limit exceeded. Please wait a moment before trying again.'}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                {t.input.reload || 'Reload Page'}
              </Button>
            </div>
          ),
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (analysis?.rewrittenScript) {
    try {
      const fullScript = `${analysis.rewrittenScript.introduction}\n\n${analysis.rewrittenScript.mainContent}\n\n${analysis.rewrittenScript.conclusion}\n\n${analysis.rewrittenScript.callToAction}`;
      await navigator.clipboard.writeText(fullScript);
      
      toast({
          title: "Copied successfully!",
        description: "Rewritten script has been copied to clipboard",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: t.rewrittenScript.copyError,
          description: t.rewrittenScript.copyError,
          variant: "destructive"
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
                    className="flex items-center gap-2"
                  >
                    <FileSearch className="h-4 w-4" />
                    {t.analysis.title}
                  </Button>
                )}
                {analysis && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {t.rewrittenScript.copyAll}
                  </Button>
                )}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-[calc(100%-2.5rem)] flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm space-y-4">
              <div className="animate-spin">
                <FileText className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">{t.input.analyzing}</p>
                <p className="text-sm text-muted-foreground">{t.input.placeholder}</p>
              </div>
            </div>
          ) : (
            <RewrittenScriptCard rewrittenScript={analysis?.rewrittenScript} />
          )}
        </div>

        {/* Floating Input Card */}
        <div className="absolute bottom-4 left-4 right-4 md:w-[367px] bg-background rounded-2xl shadow-lg border">
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
