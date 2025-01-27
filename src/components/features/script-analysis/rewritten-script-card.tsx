import { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';
import { Copy, Check, FileText } from 'lucide-react';
import { SideTab } from '@/components/ui/side-tab';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ScriptAnalysis } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface RewrittenScriptCardProps {
  rewrittenScript?: {
    learningObjectives: string[];
    introduction: string;
    mainContent: string;
    conclusion: string;
    callToAction: string;
  };
}

interface ScriptAnalysisCardProps {
  analysis: ScriptAnalysis['analysis'];
  onCopy?: () => void;
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("learning-objectives");
  const [copied, setCopied] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language].ui.rewrittenScript;
  const { toast } = useToast();

  const sections = useMemo(() => [
    { id: "learning-objectives", label: t.learningObjectives },
    { id: "introduction", label: t.introduction },
    { id: "main-content", label: t.mainContent },
    { id: "conclusion", label: t.conclusion },
    { id: "call-to-action", label: t.callToAction }
  ], [t]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleCopy = async () => {
    try {
      const fullScript = `${rewrittenScript?.introduction}\n\n${rewrittenScript?.mainContent}\n\n${rewrittenScript?.conclusion}\n\n${rewrittenScript?.callToAction}`;
      await navigator.clipboard.writeText(fullScript);
      
      toast({
        title: "Copied successfully",
        description: "The script has been copied to your clipboard",
        action: (
          <ToastAction altText="Close">Close</ToastAction>
        ),
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try copying the script again.",
        action: (
          <ToastAction altText="Try again" onClick={handleCopy}>Try again</ToastAction>
        ),
      });
    }
  };

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      let nearestSection = sections[0].id;
      let minDistance = Infinity;

      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - viewportHeight * 0.3);
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestSection = section.id;
          }
        }
      });

      setActiveSection(nearestSection);
    };

    const scrollContainer = container.parentElement;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      window.addEventListener('resize', handleScroll, { passive: true });

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [sections]);

  return (
    <div className="relative p-0">
      <div className="flex h-10 items-center justify-between px-4 border-b">
        <h2 className="text-l font-semibold">Rewritten Script</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copy All</span>
        </Button>
      </div>
      {rewrittenScript ? (
        <div className="flex gap-6">
          {/* Navigation Sidebar - Desktop Only */}
          <div className="w-56 flex-shrink-0 hidden lg:block px-4">
            <div className="sticky top-24 space-y-1 pr-2">
              {sections.map((section) => (
                <SideTab
                  key={section.id}
                  label={section.label}
                  active={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div ref={contentRef} className="flex-1 min-w-0 space-y-6 px-12">
            {/* Learning Objectives */}
            <section id="learning-objectives" className="pt-4 scroll-mt-32">
              <h3 className="font-medium text-foreground mb-2">{t.learningObjectives}</h3>
              <ul className="list-disc pl-6 space-y-1">
                {rewrittenScript.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-muted-foreground">{objective}</li>
                ))}
              </ul>
            </section>

            {/* Introduction */}
            <section id="introduction" className="pt-4 scroll-mt-32">
              <h3 className="font-medium text-foreground mb-2">{t.introduction}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.introduction}</p>
            </section>

            {/* Main Content */}
            <section id="main-content" className="pt-4 scroll-mt-32">
              <h3 className="font-medium text-foreground mb-2">{t.mainContent}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.mainContent}</p>
            </section>

            {/* Conclusion */}
            <section id="conclusion" className="pt-4 scroll-mt-32">
              <h3 className="font-medium text-foreground mb-2">{t.conclusion}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.conclusion}</p>
            </section>

            {/* Call to Action */}
            <section id="call-to-action" className="pt-4 scroll-mt-32">
              <h3 className="font-medium text-foreground mb-2">{t.callToAction}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.callToAction}</p>
            </section>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-start pt-20 p-8 text-center text-muted-foreground text-sm space-y-4">
          <FileText className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
          <div className="space-y-1">
            <p>Analysis</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ScriptAnalysisCard({ analysis }: ScriptAnalysisCardProps) {
  const { language } = useLanguageStore();
  const t = translations[language].ui.analysis;

  return (
    <div>
      <div className="sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between py-3 px-4">
          <h2 className="text-l font-semibold">{t.title}</h2>
        </div>
        <hr className="border-t" />
      </div>
      {!analysis && (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm space-y-4">
          <FileText className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
          <div className="space-y-1">
            <p>{t.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}