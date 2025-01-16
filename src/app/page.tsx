'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RootLayout } from '@/components/layout/root-layout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { availableModels } from '@/lib/models';
import { ModelSelector } from '@/components/features/script-analysis/model-selector';
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
    console.log('API Response:', data); // Log the full response

    if (!response.ok) {
      const errorMessage = data.error || data.message || data.details || response.statusText || 'Analysis failed';
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        data
      });
      throw new Error(errorMessage);
    }

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid API response structure');
    }

    // Check if we have the expected data structure
    if (!data.analysis || !data.rewrittenScript) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response structure from API');
    }

    return {
      analysis: data.analysis,
      rewrittenScript: data.rewrittenScript
    };
  } catch (error) {
    console.error('Error analyzing script:', error);
    throw error;
  }
}

export default function Home() {
  const router = useRouter();
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [script, setScript] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Check if there's a pending analysis
    const pendingAnalysis = localStorage.getItem('pendingAnalysis');
    setHasAnalysis(!!pendingAnalysis);
  }, []);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to analyze');
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeScriptAPI(script, selectedModel);
      
      // Store the data in localStorage
      const analysisData = {
        script,
        analysis: result,
        model: selectedModel,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('pendingScript', script);
      localStorage.setItem('pendingAnalysis', JSON.stringify(analysisData));
      localStorage.setItem('selectedModel', selectedModel);
      setHasAnalysis(true);
      
      // Navigate after ensuring data is stored
      router.push('/analysis');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze script. Please try again.';
      console.error('Analysis error:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-4xl font-bold text-center">
            {greeting}
          </h1>
          
          <div className="space-y-4">
            <div className="px-6 py-3 border-b border-border">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                showFreeOnly={showFreeOnly}
                onShowFreeOnlyChange={setShowFreeOnly}
              />
            </div>
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your tutorial script here..."
              className="min-h-[200px] resize-none text-lg p-4"
            />
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Button 
                  onClick={handleAnalyze}
                  disabled={!script.trim() || loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  size="lg"
                >
                  {loading ? 'Analyzing...' : 'Analyze Script'}
                </Button>
                {hasAnalysis && (
                  <Button
                    onClick={() => router.push('/analysis')}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    View Last Analysis
                  </Button>
                )}
              </div>
              <Button
                onClick={() => router.push('/analysis')}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Go to Results Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
} 