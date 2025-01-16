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

  // Load script and analysis from localStorage on mount
  useEffect(() => {
    const pendingScript = localStorage.getItem('pendingScript');
    const pendingAnalysis = localStorage.getItem('pendingAnalysis');
    const savedModel = localStorage.getItem('selectedModel');
    
    if (pendingScript && pendingAnalysis && savedModel) {
      setScript(pendingScript);
      setAnalysis(JSON.parse(pendingAnalysis));
      setSelectedModel(savedModel);
      
      // Clear storage after loading
      localStorage.removeItem('pendingScript');
      localStorage.removeItem('pendingAnalysis');
      localStorage.removeItem('selectedModel');
    } else {
      // If no pending data, go back to home
      router.push('/');
    }
  }, [router]);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to analyze');
      return;
    }
    
    setLoading(true);
    try {
      const result = await analyzeScriptAPI(script, selectedModel);
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
      <div className="h-full flex flex-col">
        <nav className="flex-none px-6 py-4 border-b border-border">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Script Auditor</h1>
          </div>
        </nav>
        
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
      </div>
    </RootLayout>
  );
}
