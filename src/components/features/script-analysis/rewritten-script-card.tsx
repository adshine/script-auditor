import type { RewrittenScript } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewrittenScriptCardProps {
  rewrittenScript: RewrittenScript;
}

function SideTab({ 
  label, 
  active, 
  onClick 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        active && "bg-gray-100 dark:bg-gray-800 font-medium"
      )}
    >
      {label}
    </button>
  );
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("learning-objectives");
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: "learning-objectives", label: "Learning Objectives" },
    { id: "introduction", label: "Introduction" },
    { id: "main-content", label: "Main Content" },
    { id: "conclusion", label: "Conclusion" },
    { id: "call-to-action", label: "Call to Action" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const copyToClipboard = async () => {
    // Combine all content sections
    const content = `Learning Objectives:
${rewrittenScript.learningObjectives.map(obj => `• ${obj}`).join('\n')}

Introduction:
${rewrittenScript.introduction}

Main Content:
${rewrittenScript.mainContent}

Conclusion:
${rewrittenScript.conclusion}

Call to Action:
${rewrittenScript.callToAction}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-100px 0px -50% 0px'
      }
    );

    const elements = sections.map(section => 
      document.getElementById(section.id)
    ).filter(Boolean);

    elements.forEach(element => element && observer.observe(element));

    return () => {
      elements.forEach(element => element && observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative p-0">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-4 border-b">
        <div className="flex justify-between items-center sticky top-0 px-4">
          <h2 className="text-xl font-semibold">Rewritten Script</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy All</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex gap-6 pt-4">
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
        
        <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
          {/* Learning Objectives */}
          <section id="learning-objectives" className="pt-4 scroll-mt-32">
            <h3 className="font-medium text-foreground mb-2">Learning Objectives</h3>
            <ul className="list-disc pl-6 space-y-1">
              {rewrittenScript.learningObjectives.map((objective, index) => (
                <li key={index} className="text-muted-foreground">{objective}</li>
              ))}
            </ul>
          </section>

          {/* Introduction */}
          <section id="introduction" className="pt-4 scroll-mt-32">
            <h3 className="font-medium text-foreground mb-2">Introduction</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.introduction}</p>
          </section>

          {/* Main Content */}
          <section id="main-content" className="pt-4 scroll-mt-32">
            <h3 className="font-medium text-foreground mb-2">Main Content</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.mainContent}</p>
          </section>

          {/* Conclusion */}
          <section id="conclusion" className="pt-4 scroll-mt-32">
            <h3 className="font-medium text-foreground mb-2">Conclusion</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.conclusion}</p>
          </section>

          {/* Call to Action */}
          <section id="call-to-action" className="pt-4 scroll-mt-32">
            <h3 className="font-medium text-foreground mb-2">Call to Action</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{rewrittenScript.callToAction}</p>
          </section>
        </div>
      </div>
    </div>
  );
} 