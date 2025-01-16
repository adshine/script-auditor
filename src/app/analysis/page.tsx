'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RootLayout } from '@/components/layout/root-layout';
import { ScriptInputCard } from '@/components/features/script-analysis/script-input-card';
import { ScriptAnalysisCard } from '@/components/features/script-analysis/script-analysis-card';
import { RewrittenScriptCard } from '@/components/features/script-analysis/rewritten-script-card';
import { availableModels } from '@/lib/models';
import type { ScriptAnalysis } from '@/lib/api';
import { Button } from '@/components/ui/button';

async function analyzeScriptAPI(script: string, model: string): Promise<ScriptAnalysis> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script, model }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        details: data.details || 'No additional details provided'
      });
      throw new Error(data.details || `Analysis failed: ${response.statusText}`);
    }

    if (!data || typeof data !== 'object') {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid API response structure');
    }

    if (!data.analysis || !data.rewrittenScript) {
      console.error('Missing required fields in API response:', data);
      throw new Error('API response missing required fields');
    }

    return data;
  } catch (error) {
    console.error('Error analyzing script:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

export default function AnalysisPage() {
  const router = useRouter();
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [noAnalysisFound, setNoAnalysisFound] = useState(false);

  // Load script and analysis from localStorage on mount
  useEffect(() => {
    const pendingScript = localStorage.getItem('pendingScript');
    const pendingAnalysis = localStorage.getItem('pendingAnalysis');
    const savedModel = localStorage.getItem('selectedModel');
    
    console.log('Loading analysis data:', { pendingScript, pendingAnalysis, savedModel });
    
    if (pendingScript && pendingAnalysis && savedModel) {
      try {
        const analysisData = JSON.parse(pendingAnalysis);
        console.log('Parsed analysis data:', analysisData);
        
        // Validate the analysis data structure
        if (!analysisData.analysis || !analysisData.analysis.analysis || !analysisData.analysis.rewrittenScript) {
          console.error('Invalid analysis data structure:', analysisData);
          throw new Error('Invalid analysis data structure');
        }
        
        setScript(pendingScript);
        setAnalysis(analysisData.analysis);
        setSelectedModel(savedModel);
        setNoAnalysisFound(false);
        
        console.log('Set analysis state:', analysisData.analysis);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
        setNoAnalysisFound(true);
        toast.error('Failed to load analysis data. Please try analyzing again.');
      }
    } else {
      setNoAnalysisFound(true);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to analyze');
      return;
    }
    
    setLoading(true);
    try {
      const result = await analyzeScriptAPI(script, selectedModel);
      console.log('Analysis result:', result);
      
      // Store the new analysis
      const analysisData = {
        script,
        analysis: result,
        model: selectedModel,
        timestamp: new Date().toISOString()
      };
      
      console.log('Storing analysis data:', analysisData);
      localStorage.setItem('pendingScript', script);
      localStorage.setItem('pendingAnalysis', JSON.stringify(analysisData));
      localStorage.setItem('selectedModel', selectedModel);
      
      setAnalysis(result);
      setNoAnalysisFound(false);
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
      <div className="h-full flex flex-col">
        <nav className="flex-none px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                ← Back
              </Button>
              <h1 className="text-xl font-bold">Script Auditor</h1>
            </div>
          </div>
        </nav>
        
        {noAnalysisFound ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">No Analysis Found</h2>
            <p className="text-muted-foreground mb-8">
              There is no analysis to display. Please analyze a script first.
            </p>
            <Button
              onClick={() => router.push('/')}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Go Back to Analyze
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden p-[0px !important]">
            <div className="w-[32%] flex flex-col gap-4 overflow-hidden border-r border-border">
              <div className="flex-none">
                <ScriptInputCard
                  script={script}
                  onScriptChange={setScript}
                  onAnalyze={handleAnalyze}
                  loading={loading}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  showFreeOnly={showFreeOnly}
                  onShowFreeOnlyChange={setShowFreeOnly}
                />
              </div>

              {analysis && (
                <div className="flex-1 overflow-auto">
                  <div className="border-t border-border w-full" />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-6">Analysis</h2>
                    <ScriptAnalysisCard analysis={analysis.analysis} />
                  </div>
                </div>
              )}
            </div>

            {analysis && (
              <div className="flex-1 h-full overflow-hidden">
                <div className="p-6 overflow-auto h-[calc(100%-4rem)]">
                  <RewrittenScriptCard rewrittenScript={analysis.rewrittenScript} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </RootLayout>
  );
}
