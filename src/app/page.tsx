'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RootLayout } from '@/components/layout/root-layout';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ModelSelector } from '@/components/features/script-analysis/model-selector';
import { availableModels } from '@/lib/models';
import { toast } from 'sonner';
import type { ScriptAnalysis } from '@/lib/api';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Good Night';
};

async function analyzeScriptAPI(script: string, model: string): Promise<ScriptAnalysis> {
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
}

const HomePage = () => {
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [script, setScript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Sort models by context window size and select the first one
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeScriptAPI(script, selectedModel);
      toast.success('Analysis completed successfully');
      // Store the result in localStorage so the analyze page can access it
      localStorage.setItem('scriptAnalysis', JSON.stringify(result));
      router.push('/analyze');
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze script. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <RootLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-2xl mx-auto px-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
          {greeting}, Adebimpe
        </h1>
        
        <Card className="w-full p-6">
          <div className="mb-6">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              showFreeOnly={showFreeOnly}
              onShowFreeOnlyChange={setShowFreeOnly}
            />
          </div>
          
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your script here..."
            className="w-full min-h-[200px] p-4 text-base rounded-[20px] border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          
          <div className="flex gap-4 mt-6">
            <Button 
              className="flex-1"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !script.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Script'
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="w-[140px]"
              onClick={() => router.push('/analyze')}
            >
              See Result Page
            </Button>
          </div>
        </Card>
      </div>
    </RootLayout>
  );
};

export default HomePage; 