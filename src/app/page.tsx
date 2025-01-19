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
  if (hour >= 22 || hour < 5) return 'Good Night';
  return 'Good Night'; // fallback, should never reach here
};

async function analyzeScriptAPI(script: string, model: string): Promise<ScriptAnalysis> {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  // Validate script length before sending
  if (script.length > 100000) {
    throw new Error('Script is too long. Please reduce the length and try again.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Sending request with model ${model}`);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: script.trim(),
          model 
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

const HomePage = () => {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Welcome');
  const [script, setScript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Sort models by context window size and select the first one
  const sortedModels = [...availableModels].sort((a, b) => b.contextWindow - a.contextWindow);
  const [selectedModel, setSelectedModel] = useState(sortedModels[0].id);

  useEffect(() => {
    // Set initial greeting
    setGreeting(`${getGreeting()}, Adebimpe`);
    
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(`${getGreeting()}, Adebimpe`);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      toast.loading('Analyzing your script...', { id: 'analyze' });
      const result = await analyzeScriptAPI(script, selectedModel);
      toast.success('Analysis completed successfully', { id: 'analyze' });
      // Store the result in localStorage so the analyze page can access it
      localStorage.setItem('scriptAnalysis', JSON.stringify(result));
      router.push('/analyze');
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to analyze script. Please try again.',
        { id: 'analyze' }
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <RootLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-2xl mx-auto px-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
          {greeting}
        </h1>
        
        <Card className="w-full p-6">
          <div className="mb-6">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
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
          </div>
        </Card>
      </div>
    </RootLayout>
  );
};

export default HomePage; 