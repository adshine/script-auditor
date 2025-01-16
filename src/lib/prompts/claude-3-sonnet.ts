import { ModelPrompt, baseSystemPrompt, baseUserPromptTemplate, baseModelConfig } from './base-prompt';

const claudeSpecificInstructions = `
You excel at creating clear, engaging educational content. Your strengths include:
1. Breaking down complex topics into understandable chunks
2. Creating natural, conversational flow
3. Maintaining academic rigor while being accessible
4. Providing concrete examples and applications
5. Creating clear learning objectives and outcomes

When rewriting the script:
- Use natural, conversational language
- Include clear transitions between topics
- Break down complex concepts with examples
- Add engagement points and questions
- Keep technical accuracy while improving accessibility`;

export const claudeSonnetPrompt: ModelPrompt = {
  systemPrompt: `${baseSystemPrompt}\n\n${claudeSpecificInstructions}`,
  userPromptTemplate: baseUserPromptTemplate,
  temperature: 0.4, // Slightly higher for more natural language
  maxTokens: 4000,
  topP: 0.3,
  presencePenalty: 0.1, // Encourage more varied language
  frequencyPenalty: 0.1
}; 