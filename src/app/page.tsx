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
import { LanguageSelector } from '@/components/features/script-analysis/language-selector';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/constants';
import { Logo } from '@/components/ui/logo';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  if (hour >= 22 || hour < 5) return 'Good Night';
  return 'Good Night'; // fallback, should never reach here
};

async function analyzeScriptAPI(script: string, model: string, language: string): Promise<ScriptAnalysis> {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  // Validate script length before sending
  if (script.length > 100000) {
    throw new Error('Script is too long. Please reduce the length and try again.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Sending request with model ${model} and language ${language}`);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: script.trim(),
          model,
          language 
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
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language].ui;
  
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
      toast.error(t.input.placeholder);
      return;
    }

    setIsAnalyzing(true);
    try {
      toast.loading(t.input.analyzing || 'Analyzing your script...', { id: 'analyze' });
      const result = await analyzeScriptAPI(script, selectedModel, language);
      toast.success(t.input.analysisComplete || 'Analysis completed successfully', { id: 'analyze' });
      localStorage.setItem('scriptAnalysis', JSON.stringify(result));
      router.push('/analyze');
    } catch (error) {
      console.error('Error analyzing script:', error);
      const errorMessage = error instanceof Error ? error.message : t.input.analysisFailed || 'Failed to analyze script. Please try again.';
      
      if (errorMessage.toLowerCase().includes('rate limit')) {
        toast.error(
          <div className="flex flex-col gap-2">
            <p>{t.input.rateLimitExceeded || 'Rate limit exceeded. Please wait a moment before trying again.'}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              {t.input.reload || 'Reload Page'}
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
      <div className="flex flex-col items-center justify-center min-h-[100%] w-full max-w-2xl mx-auto px-4 -mt-20">
        <div className="text-center mb-6">
          <Logo />
          <p className="text-lg text-gray-600 mt-6 mb-2">
            {t.home.welcome}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 mb-2 min-w-full text-balance font-nunito">
            {t.home.title}
            <br />
            {t.home.subtitle}
          </h1>
        </div>
        
        <div className="w-full bg-white rounded-2xl shadow-none border border-gray-100 overflow-hidden">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder={t.input.placeholder}
            className="w-full max-h-[200px] p-3 pb-12 text-base rounded-2xl bg-white border border-gray-100 resize-none focus:outline-none placeholder:text-gray-500"
          />
          
          <div className="w-full bg-gray-50 px-[12px] py-[4px] pr-[6px] flex items-between justify-between gap-4 -mt-5 pt-4 items-center">
            <div className="flex gap-2">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={setLanguage}
              />
            </div>
        
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !script.trim()}
              className="bg-green-200 hover:bg-green-300 text-green-800 px-[16px] py-[1px] rounded-lg disabled:text-gray-500 disabled:border-gray-300 disabled:bg-white disabled:hover:border-gray-300 disabled:cursor-not-allowed disabled:shadow-none shadow-none max-h-[32px] h-[32px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                  {t.input.analyzing}
                </>
              ) : (
                t.input.analyze
              )}
            </Button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default HomePage; 