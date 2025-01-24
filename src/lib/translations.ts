export type SupportedLanguage = 'en' | 'zh' | 'id' | 'hi' | 'es';

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English' },
  zh: { name: 'Chinese', nativeName: '中文' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  es: { name: 'Spanish', nativeName: 'Español' }
} as const;

export interface Translation {
  ui: {
    analysis: {
      title: string;
      overallScore: string;
      prioritizedImprovements: string;
      technicalTerms: string;
      sections: {
        introduction: string;
        mainContent: string;
        conclusion: string;
      };
    };
    rewrittenScript: {
      title: string;
      learningObjectives: string;
      introduction: string;
      mainContent: string;
      conclusion: string;
      callToAction: string;
      copyAll: string;
      copied: string;
    };
    input: {
      title: string;
      placeholder: string;
      analyze: string;
    };
  };
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    ui: {
      analysis: {
        title: 'Analysis',
        overallScore: 'Overall Score',
        prioritizedImprovements: 'Prioritized Improvements',
        technicalTerms: 'Technical Terms',
        sections: {
          introduction: 'Introduction',
          mainContent: 'Main Content',
          conclusion: 'Conclusion'
        }
      },
      rewrittenScript: {
        title: 'Rewritten Script',
        learningObjectives: 'Learning Objectives',
        introduction: 'Introduction',
        mainContent: 'Main Content',
        conclusion: 'Conclusion',
        callToAction: 'Call to Action',
        copyAll: 'Copy All',
        copied: 'Copied!'
      },
      input: {
        title: 'Input Script',
        placeholder: 'Paste your tutorial script here...',
        analyze: 'Analyze'
      }
    }
  },
  zh: {
    ui: {
      analysis: {
        title: '分析',
        overallScore: '总体评分',
        prioritizedImprovements: '优先改进项',
        technicalTerms: '技术术语',
        sections: {
          introduction: '引言',
          mainContent: '主要内容',
          conclusion: '结论'
        }
      },
      rewrittenScript: {
        title: '重写的脚本',
        learningObjectives: '学习目标',
        introduction: '介绍',
        mainContent: '主要内容',
        conclusion: '结论',
        callToAction: '行动号召',
        copyAll: '复制全部',
        copied: '已复制！'
      },
      input: {
        title: '输入脚本',
        placeholder: '在此粘贴您的教程脚本...',
        analyze: '分析'
      }
    }
  },
  id: {
    ui: {
      analysis: {
        title: 'Analisis',
        overallScore: 'Skor Keseluruhan',
        prioritizedImprovements: 'Perbaikan Prioritas',
        technicalTerms: 'Istilah Teknis',
        sections: {
          introduction: 'Pendahuluan',
          mainContent: 'Konten Utama',
          conclusion: 'Kesimpulan'
        }
      },
      rewrittenScript: {
        title: 'Naskah yang Ditulis Ulang',
        learningObjectives: 'Tujuan Pembelajaran',
        introduction: 'Pendahuluan',
        mainContent: 'Konten Utama',
        conclusion: 'Kesimpulan',
        callToAction: 'Ajakan Bertindak',
        copyAll: 'Salin Semua',
        copied: 'Tersalin!'
      },
      input: {
        title: 'Naskah Masukan',
        placeholder: 'Tempel naskah tutorial Anda di sini...',
        analyze: 'Analisis'
      }
    }
  },
  hi: {
    ui: {
      analysis: {
        title: 'विश्लेषण',
        overallScore: 'कुल स्कोर',
        prioritizedImprovements: 'प्राथमिक सुधार',
        technicalTerms: 'तकनीकी शब्द',
        sections: {
          introduction: 'परिचय',
          mainContent: 'मुख्य सामग्री',
          conclusion: 'निष्कर्ष'
        }
      },
      rewrittenScript: {
        title: 'पुनर्लिखित स्क्रिप्ट',
        learningObjectives: 'सीखने के उद्देश्य',
        introduction: 'परिचय',
        mainContent: 'मुख्य सामग्री',
        conclusion: 'निष्कर्ष',
        callToAction: 'कार्रवाई के लिए आह्वान',
        copyAll: 'सभी कॉपी करें',
        copied: 'कॉपी किया गया!'
      },
      input: {
        title: 'इनपुट स्क्रिप्ट',
        placeholder: 'अपनी ट्यूटोरियल स्क्रिप्ट यहाँ पेस्ट करें...',
        analyze: 'विश्लेषण करें'
      }
    }
  },
  es: {
    ui: {
      analysis: {
        title: 'Análisis',
        overallScore: 'Puntuación General',
        prioritizedImprovements: 'Mejoras Prioritarias',
        technicalTerms: 'Términos Técnicos',
        sections: {
          introduction: 'Introducción',
          mainContent: 'Contenido Principal',
          conclusion: 'Conclusión'
        }
      },
      rewrittenScript: {
        title: 'Guión Reescrito',
        learningObjectives: 'Objetivos de Aprendizaje',
        introduction: 'Introducción',
        mainContent: 'Contenido Principal',
        conclusion: 'Conclusión',
        callToAction: 'Llamada a la Acción',
        copyAll: 'Copiar Todo',
        copied: '¡Copiado!'
      },
      input: {
        title: 'Script de Entrada',
        placeholder: 'Pega tu script de tutorial aquí...',
        analyze: 'Analizar'
      }
    }
  }
}; 