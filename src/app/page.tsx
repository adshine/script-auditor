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

export default function Home() {
  const router = useRouter();
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [script, setScript] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
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
      localStorage.setItem('pendingScript', script);
      localStorage.setItem('pendingAnalysis', JSON.stringify(result));
      localStorage.setItem('selectedModel', selectedModel);
      router.push('/analysis');
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze script. Please try again.');
    }
  };

  return (
    <RootLayout>
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-4xl font-bold text-center">
            {greeting}, Adebimpe
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
            <Button 
              onClick={handleAnalyze}
              disabled={!script.trim() || loading}
              className="w-full bg-green-500 hover:bg-green-600"
              size="lg"
            >
              {loading ? 'Analyzing...' : 'Analyze Script'}
            </Button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
} 