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
      localStorage.setItem('scriptAnalysis', JSON.stringify(result));
      router.push('/analyze');
    } catch (error) {
      console.error('Error analyzing script:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze script. Please try again.';
      
      if (errorMessage.toLowerCase().includes('rate limit')) {
        toast.error(
          <div className="flex flex-col gap-2">
            <p>Rate limit exceeded. Please wait a moment before trying again.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>,
          { 
            id: 'analyze',
            duration: 5000
          }
        );
      } else {
        toast.error(errorMessage, { id: 'analyze' });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <RootLayout>
      <div className="flex flex-col items-center justify-center min-h-screen max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-12">
          {greeting}
        </h1>
        
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Type or paste your script here"
            className="w-full min-h-[200px] p-6 text-base rounded-t-2xl bg-transparent resize-none focus:outline-none placeholder:text-gray-500"
          />
          
          <div className="w-full bg-gray-50 rounded-b-2xl px-[12px] py-[4px] pr-[6px] flex items-center justify-between gap-4">
            <div className="flex-1">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>
            
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !script.trim()}
              className="bg-[#4CD964] hover:bg-[#44c258] text-white px-[16px] py-[10px] rounded-lg disabled:text-gray-500 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default HomePage; 