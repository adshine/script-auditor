type Translation = {
  welcome: string;
  heading: {
    line1: string;
    line2: string;
  };
  placeholder: string;
  analyze: string;
  analyzing: string;
};

export const translations: Record<string, Translation> = {
  en: {
    welcome: "Hi there! Welcome to Script Auditor",
    heading: {
      line1: "Analyze and enhance",
      line2: "your scripts with AI"
    },
    placeholder: "Type or paste your script here",
    analyze: "Analyze",
    analyzing: "Analyzing..."
  },
  id: {
    welcome: "Halo! Selamat datang di Script Auditor",
    heading: {
      line1: "Analisis dan tingkatkan",
      line2: "skrip Anda dengan AI"
    },
    placeholder: "Ketik atau tempel skrip Anda di sini",
    analyze: "Analisis",
    analyzing: "Menganalisis..."
  },
  zh: {
    welcome: "你好！欢迎使用脚本审核工具",
    heading: {
      line1: "使用AI分析和增强",
      line2: "您的脚本"
    },
    placeholder: "在此输入或粘贴您的脚本",
    analyze: "分析",
    analyzing: "分析中..."
  },
  hi: {
    welcome: "नमस्ते! स्क्रिप्ट ऑडिटर में आपका स्वागत है",
    heading: {
      line1: "एआई के साथ अपनी स्क्रिप्ट का",
      line2: "विश्लेषण और सुधार करें"
    },
    placeholder: "अपनी स्क्रिप्ट यहां टाइप करें या पेस्ट करें",
    analyze: "विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है..."
  },
  es: {
    welcome: "¡Hola! Bienvenido a Script Auditor",
    heading: {
      line1: "Analiza y mejora",
      line2: "tus scripts con IA"
    },
    placeholder: "Escribe o pega tu script aquí",
    analyze: "Analizar",
    analyzing: "Analizando..."
  }
}; 