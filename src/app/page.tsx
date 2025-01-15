'use client';

import { useState } from 'react';
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

    // Validate response structure
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

export default function Home() {
  // Sort models by context window size and select the first one
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

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
        Script Auditor
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
