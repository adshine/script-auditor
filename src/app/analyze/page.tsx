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
      {/* Nav Bar */}
      <nav className="w-full h-12 border-b mb-6">
        <div className="container mx-auto px-4 h-full flex items-center">
          <h1 className="text-xl font-semibold">Script Analysis</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-6rem)]">
          {/* Left Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Analysis Container */}
            <div className="rounded-lg">
              {analysis && <ScriptAnalysisCard analysis={analysis.analysis} />}
            </div>
            
            {/* Script Input Container */}
            <div className="rounded-lg">
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
          </div>

          {/* Right Side - Rewritten Script */}
          <div className="lg:col-span-8 rounded-lg">
            {analysis && <RewrittenScriptCard rewrittenScript={analysis.rewrittenScript} />}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
