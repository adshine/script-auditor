# Prompt 01

As an experienced script writer and instructional designer, analyze and enhance this script that will be performed by the user's trained AI avatar.
DO NOT add any AI introductions - the avatar is already trained with the user's persona.

Evaluate and improve the script based on these key areas:

1. Engagement & Structure:
   - Hook and attention-grabbing opening
   - Clear learning objectives
   - Logical flow and transitions
   - Effective conclusion and call-to-action
   - Knowledge check points

2. Delivery & Pacing:
   - Natural conversational tone
   - Strategic pauses for emphasis
   - Varied sentence lengths
   - Chunked information
   - Clear transitions between topics

3. Visual Integration:
   - Visual cue markers [VISUAL CUE] for demos/graphics
   - Emphasis points for key concepts
   - Opportunities for on-screen text
   - Visual metaphors and examples
   - Data visualization moments
   - **Example**

     > "To illustrate how our product reaches different audiences, let's look at a quick chart of user demographics. [VISUAL CUE: A chart showing user demographics by age group]."
     >
     > This tells your production team (or AI avatar) exactly what to display on screen.

4. Instructional Design:
   - Progressive complexity
   - Real-world examples
   - Practice opportunities
   - Memory retention techniques
   - Active learning prompts

5. Accessibility & Clarity:
   - Simple language for complex concepts
   - Defined technical terms
   - Consistent terminology
   - Cultural sensitivity
   - Inclusive language

For each improvement made, mark it with [IMPLEMENTED] to track progress.

Script to analyze:
${script}

**IMPORTANT**:
1.**Your response must be valid JSON**—no extra text, no markdown formatting, no explanations outside the JSON structure.
2.**Ensure all double quotes inside JSON strings are escaped** (e.g., \\\") to avoid invalid JSON.  
3.**Include all required sections in your JSON** (analysis and rewrittenScript).  
4.The rewritten script should achieve a readability score of at least 8.0 and incorporate all the marked improvements.

Respond in JSON format exactly as follows:

{
  "analysis": {
    "technicalTerms": ["term1", "term2", ...],
    "readabilityScore": 9.0,
    "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2", ...],
    "overallScore": 9.0,
    "prioritizedImprovements": ["improvement1 [IMPLEMENTED]", "improvement2", ...],
    "sections": {
      "introduction": {
        "score": 8.5,
        "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2"],
        "readabilityMetrics": {
          "fleschKincaid": 12.5,
          "wordsPerSentence": 21,
          "technicalTerms": ["term1", "term2"]
        },
        "aiEnhancements": "text with [VISUAL CUE] markers"
      }
    }
  },
  "rewrittenScript": {
    "learningObjectives": ["objective1", "objective2", ...],
    "introduction": "text with [VISUAL CUE] markers (no AI introductions)",
    "mainContent": "text with [VISUAL CUE] markers",
    "conclusion": "text with [VISUAL CUE] markers",
    "callToAction": "text with [VISUAL CUE] markers"
  }
}
