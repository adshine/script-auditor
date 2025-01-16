'use client';

import { useState, useEffect } from 'react';
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
      throw new Error(data.details || `Analysis failed: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error analyzing script:', error);
    throw error;
  }
}

export default function AnalyzePage() {
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

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
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Script Analysis
      </h1>
      
      <div className="space-y-8">
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

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            <div className="lg:col-span-3">
              <ScriptAnalysisCard analysis={analysis.analysis} />
            </div>
            <div className="lg:col-span-7">
              <RewrittenScriptCard rewrittenScript={analysis.rewrittenScript} />
            </div>
          </div>
        )}
      </div>
    </RootLayout>
  );
}
