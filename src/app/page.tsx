'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RootLayout } from '@/components/layout/root-layout';
import { ScriptInputCard } from '@/components/features/script-analysis/script-input-card';
import { ScriptAnalysisCard } from '@/components/features/script-analysis/script-analysis-card';
import { analyzeScript } from '@/lib/api';
import { availableModels } from '@/lib/models';
import type { ScriptAnalysis } from '@/lib/api';

export default function Home() {
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(availableModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const handleAnalyze = async () => {
    if (!script.trim()) return;
    
    setLoading(true);
    try {
      const result = await analyzeScript(script, selectedModel);
      setAnalysis(result);
      toast.success('Script analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error('Failed to analyze script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Script Auditor
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScriptInputCard
          script={script}
          onScriptChange={setScript}
          onAnalyze={handleAnalyze}
          loading={loading}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          showFreeOnly={showFreeOnly}
        />

        <div className="space-y-6">
          {analysis && <ScriptAnalysisCard analysis={analysis} />}
        </div>
      </div>
    </RootLayout>
  );
}
