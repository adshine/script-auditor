import { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/lib/stores/language-store';
import { translations } from '@/lib/translations';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { SideTab } from '@/components/ui/side-tab';
import { cn } from '@/lib/utils';

interface RewrittenScriptCardProps {
  rewrittenScript: {
    learningObjectives: string[];
    introduction: string;
    mainContent: string;
    conclusion: string;
    callToAction: string;
  };
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("learning-objectives");
  const [copied, setCopied] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language].ui.rewrittenScript;

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
    const fullScript = `${rewrittenScript.introduction}\n\n${rewrittenScript.mainContent}\n\n${rewrittenScript.conclusion}\n\n${rewrittenScript.callToAction}`;
    
    try {
      await navigator.clipboard.writeText(fullScript);
      setCopied(true);
      toast.success(t.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
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
      <div className="flex gap-6 pt-4">
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
        <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
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
    </div>
  );
} 