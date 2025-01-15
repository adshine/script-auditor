import type { RewrittenScript } from '@/lib/api';
import { useState, useEffect } from 'react';

interface RewrittenScriptCardProps {
  rewrittenScript: RewrittenScript;
}

export function RewrittenScriptCard({ rewrittenScript }: RewrittenScriptCardProps) {
  const [activeSection, setActiveSection] = useState('learning-objectives');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: [0.3],
        rootMargin: '-20% 0px -60% 0px'
      }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const sections = [
    { id: 'learning-objectives', title: 'Learning Objectives', content: (
      <ul className="list-disc pl-5 space-y-2">
        {rewrittenScript.learningObjectives.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>
    )},
    { id: 'introduction', title: 'Introduction', content: (
      <div className="whitespace-pre-wrap">{rewrittenScript.introduction}</div>
    )},
    { id: 'main-content', title: 'Main Content', content: (
      <div className="whitespace-pre-wrap">{rewrittenScript.mainContent}</div>
    )},
    { id: 'conclusion', title: 'Conclusion', content: (
      <div className="whitespace-pre-wrap">{rewrittenScript.conclusion}</div>
    )},
    { id: 'call-to-action', title: 'Call to Action', content: (
      <div className="whitespace-pre-wrap">{rewrittenScript.callToAction}</div>
    )}
  ];

  return (
    <div className="flex gap-8">
      <div className="w-48 flex-none">
        <div className="sticky top-0 space-y-2 pt-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveSection(section.id);
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                ${activeSection === section.id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-muted'}`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-12">
        {sections.map(section => (
          <div 
            key={section.id} 
            id={section.id}
            data-section
            className="scroll-mt-16"
          >
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
} 