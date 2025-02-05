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
    home: {
      welcome: string;
      title: string;
      subtitle: string;
    };
    analysis: {
      title: string;
      overallScore: string;
      prioritizedImprovements: string;
      technicalTerms: string;
      scoreFormat: string;
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
      copyError: string;
    };
    input: {
      title: string;
      placeholder: string;
      analyze: string;
      analyzing: string;
      analysisComplete: string;
      analysisFailed: string;
      rateLimitExceeded: string;
      reload: string;
    };
  };
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    ui: {
      home: {
        welcome: 'Hi there! Welcome to Script Auditor',
        title: 'Analyze and enhance',
        subtitle: 'your scripts with AI'
      },
      analysis: {
        title: 'Analysis',
        overallScore: 'Overall Score',
        prioritizedImprovements: 'Prioritized Improvements',
        technicalTerms: 'Technical Terms',
        scoreFormat: '/10',
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
        copied: 'Copied to clipboard!',
        copyError: 'Failed to copy to clipboard'
      },
      input: {
        title: 'Input Script',
        placeholder: 'Type or paste your script here...',
        analyze: 'Analyze',
        analyzing: 'Analyzing...',
        analysisComplete: 'Analysis completed successfully',
        analysisFailed: 'Failed to analyze script. Please try again.',
        rateLimitExceeded: 'Rate limit exceeded. Please wait a moment before trying again.',
        reload: 'Reload Page'
      }
    }
  },
  zh: {
    ui: {
      home: {
        welcome: '您好！欢迎使用脚本审核工具',
        title: '智能分析和优化',
        subtitle: '让AI提升您的脚本质量'
      },
      analysis: {
        title: '分析',
        overallScore: '总体评分',
        prioritizedImprovements: '优先改进项',
        technicalTerms: '技术术语',
        scoreFormat: '/10',
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
        copied: '已复制！',
        copyError: '复制失败'
      },
      input: {
        title: '输入脚本',
        placeholder: '在此输入或粘贴您的脚本...',
        analyze: '分析',
        analyzing: '分析中...',
        analysisComplete: '分析完成',
        analysisFailed: '分析失败，请重试。',
        rateLimitExceeded: '已超出速率限制。请稍后再试。',
        reload: '重新加载页面'
      }
    }
  },
  id: {
    ui: {
      home: {
        welcome: 'Hai! Selamat datang di Script Auditor',
        title: 'Analisis dan tingkatkan',
        subtitle: 'naskah Anda dengan Kecerdasan Buatan'
      },
      analysis: {
        title: 'Analisis',
        overallScore: 'Skor Keseluruhan',
        prioritizedImprovements: 'Perbaikan Prioritas',
        technicalTerms: 'Istilah Teknis',
        scoreFormat: '/10',
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
        copied: 'Tersalin!',
        copyError: 'Gagal menyalin ke clipboard'
      },
      input: {
        title: 'Naskah Masukan',
        placeholder: 'Ketik atau tempel naskah Anda di sini...',
        analyze: 'Analisis',
        analyzing: 'Menganalisis...',
        analysisComplete: 'Analisis berhasil diselesaikan',
        analysisFailed: 'Gagal menganalisis naskah. Silakan coba lagi.',
        rateLimitExceeded: 'Batas kecepatan terlampaui. Harap tunggu sebentar sebelum mencoba lagi.',
        reload: 'Muat Ulang Halaman'
      }
    }
  },
  hi: {
    ui: {
      home: {
        welcome: 'नमस्ते! स्क्रिप्ट ऑडिटर में आपका स्वागत है',
        title: 'विश्लेषण करें और बेहतर बनाएं',
        subtitle: 'एआई के साथ अपनी स्क्रिप्ट को'
      },
      analysis: {
        title: 'विश्लेषण',
        overallScore: 'कुल स्कोर',
        prioritizedImprovements: 'प्राथमिकता वाले सुधार',
        technicalTerms: 'तकनीकी शब्द',
        scoreFormat: '/१०',
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
        copied: 'कॉपी किया गया!',
        copyError: 'क्लिपबोर्ड में कॉपी करने में विफल'
      },
      input: {
        title: 'इनपुट स्क्रिप्ट',
        placeholder: 'अपनी स्क्रिप्ट यहाँ टाइप करें या पेस्ट करें...',
        analyze: 'विश्लेषण करें',
        analyzing: 'विश्लेषण हो रहा है...',
        analysisComplete: 'विश्लेषण सफलतापूर्वक पूरा हुआ',
        analysisFailed: 'विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।',
        rateLimitExceeded: 'दर सीमा पार हो गई। कृपया कुछ देर बाद प्रयास करें।',
        reload: 'पेज रीलोड करें'
      }
    }
  },
  es: {
    ui: {
      home: {
        welcome: '¡Hola! Bienvenido a Script Auditor',
        title: 'Analiza y mejora',
        subtitle: 'tus scripts con Inteligencia Artificial'
      },
      analysis: {
        title: 'Análisis',
        overallScore: 'Puntuación General',
        prioritizedImprovements: 'Mejoras Prioritarias',
        technicalTerms: 'Términos Técnicos',
        scoreFormat: '/10',
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
        copied: '¡Copiado!',
        copyError: 'Error al copiar al portapapeles'
      },
      input: {
        title: 'Script de Entrada',
        placeholder: 'Escribe o pega tu script aquí...',
        analyze: 'Analizar',
        analyzing: 'Analizando...',
        analysisComplete: 'Análisis completado con éxito',
        analysisFailed: 'Error al analizar el script. Por favor, inténtalo de nuevo.',
        rateLimitExceeded: 'Límite de velocidad excedido. Por favor, espera un momento antes de intentarlo de nuevo.',
        reload: 'Recargar Página'
      }
    }
  }
}; 