# Script Auditor PRD

## 1. Product Overview

**Product Name:** Script Auditor

**Description:**  
Script Auditor is a web-based (or IDE-integrated) tool that allows users to input a course tutorial script. The tool will:

1. Analyze the script against best practices for engaging instructional content.  
2. Provide automated suggestions to enhance clarity, tone, structure, engagement, etc.  
3. Optionally, generate a revised version of the script leveraging the OpenAI API.

**Primary Goal:**  
To help instructional designers quickly refine and improve their tutorial scripts without manually auditing them against lengthy checklists.

---

## 2. Objectives & Success Criteria

1. **Objective:** Automate the process of auditing a script against established best practices (learning objectives, engaging intro, structure, etc.).  
   - **Success Metric:** At least 80% of scripts are enhanced in clarity and engagement based on user feedback.

2. **Objective:** Reduce the time needed for script revisions.  
   - **Success Metric:** Users report saving at least 50% of their usual editing time by using the tool.

3. **Objective:** Provide consistent and reliable script feedback.  
   - **Success Metric:** Fewer than 5% of users report the tool’s suggestions as irrelevant or incorrect.

4. **Objective:** Seamless integration with OpenAI for validations and content improvement.  
   - **Success Metric:** The tool maintains stable operation with minimal errors or timeouts under typical user load.

---

## 3. Scope & Features

### 3.1 In-Scope Features

1. **Script Input**  
   - Users can paste their script into a text box (or directly input if integrated into an IDE like Cursor).  
   - Word count/character limit: Provide immediate feedback on the total script length.

2. **Automated Analysis**  
   - The app will parse the script and check for:
     - Presence of **learning objectives** and clarity of those objectives.  
     - **Intro hook** effectiveness (e.g., question, surprising fact, scenario).  
     - **Content structure** (segmentation, headings, examples).  
     - **Conversational tone** (use of “you,” short sentences, minimal jargon).  
     - **Interactivity** (questions, quizzes, reflection prompts).  
     - **Key takeaways** or summary.  
     - **Closing** that includes a call-to-action.  
   - The app will use a scoring or checklist approach for each category (e.g., “Met,” “Partially Met,” “Not Met”).

3. **Suggestions & Improvements**  
   - Based on the checklist, the system will provide recommendations (e.g., “Add a real-world example in Section 2,” “Rephrase sentence for clarity,” etc.).  
   - The system can call the OpenAI API to propose a revised segment or entire paragraph.

4. **Script Validation via OpenAI API**  
   - The app will use OpenAI’s API to:
     - Check grammar, spelling, and readability.  
     - Suggest alternative wording or structure for better engagement.  
     - Provide short, integrated feedback in-line or at the end of the script.

5. **Revised Script Generation (Optional)**  
   - A button that, when clicked, generates a revised script version incorporating the suggestions.  
   - User can compare the original with the revised version side-by-side.

6. **User Interface (UI)**  
   - Simple layout:
     1. Text Input area (or integrated editor)  
     2. “Analyze Script” button  
     3. Display of results: Checklist, feedback, suggestions  
     4. “Regenerate/Reword with OpenAI” button

### 3.2 Out-of-Scope (for this iteration)

- Complex publishing features (e.g., exporting to LMS formats like SCORM).  
- Advanced analytics beyond simple usage metrics.  
- Collaboration features (multi-user editing).

---

## 4. User Stories & Flows

### 4.1 User Stories

1. **As an instructional designer**, I want to paste my script and instantly see which areas need improvement so that my scripts are more engaging and effective.  
2. **As a course developer**, I want to quickly see suggestions for alternative wordings so that I can reduce my editing time.  
3. **As a reviewer or peer**, I want to verify that a script meets the established best practices before final approval.

### 4.2 Example Workflow

1. **Input Script**  
   - The user opens the Script Auditor page or IDE extension, pastes their script, and clicks “Analyze Script.”
2. **Script Parsing & Analysis**  
   - The app scans for key sections (Objectives, Intro Hook, Structure, Tone, Interactivity, Summary, Closing).  
   - It sends relevant content sections to the OpenAI API for quick grammar and clarity checks.
3. **Feedback Display**  
   - A checklist is shown:  
     - \[✓\] Objectives found, with rating of clarity.  
     - \[✓\] Intro hook present but might need stronger call to action.  
     - \[✗\] Interactivity is lacking.  
   - Each item expands to show suggestions: “Consider adding a reflective question after you introduce the main concept.”
4. **(Optional) Revise with AI**  
   - The user clicks “Revise Script” to accept AI-generated improvements.  
   - The revised script is shown side-by-side with changes highlighted.
5. **User Saves or Exports**  
   - The user copies the revised script, or saves it in the IDE.

---

## 5. Functional Requirements

1. **Script Parsing & Basic Analysis**  
   - Must identify text blocks that resemble the typical sections (Objectives, Intro, etc.).  
   - Must highlight sections that are missing or underdeveloped.

2. **Integration with OpenAI API**  
   - Must handle API requests for grammar checks, rewriting, or suggestion generation.  
   - Must manage API authentication securely (e.g., environment variables for API keys).

3. **Feedback Output**  
   - Must generate a structured checklist with a pass/fail/needs improvement approach.  
   - Must offer suggestions that can be accepted or declined by the user.

4. **Revised Script Generation**  
   - Must provide an option to “Regenerate” specific paragraphs or the entire script.  
   - Must maintain version control so the user can revert changes if needed.

5. **UI/UX**  
   - Must have a text editor or input area with syntax highlighting (optional if integrated into Cursor).  
   - Must handle typical script lengths (up to 5,000–10,000 words without performance issues).  
   - Must display feedback in a user-friendly manner (accordion or collapsible panels for each category).

6. **Performance**  
   - The app should load and analyze a medium-length script (1,000–2,000 words) within a few seconds.  
   - The user’s wait time for suggestions from OpenAI should be minimized by efficient handling of multiple requests (if possible, batch them).

---

## 6. Non-Functional Requirements

1. **Security & Data Privacy**  
   - API keys and any user data must be stored securely.  
   - Partial or full script content might be considered sensitive; implement minimal logging and ensure secure transmission (HTTPS).

2. **Scalability**  
   - The solution should handle multiple concurrent users without significant performance degradation.

3. **Usability**  
   - The interface should be intuitive for non-technical users.  
   - Clear instructions: “Paste your script here,” “Analyze,” “Revise,” etc.

4. **Reliability**  
   - The system should gracefully handle OpenAI API timeouts or errors.  
   - Provide helpful error messages if suggestions fail to generate.

5. **Maintainability**  
   - Codebase structured to allow easy updates to the analysis logic or front-end.  
   - Clear documentation on how to modify the checklist or logic for new best practices.

---

## 7. Acceptance Criteria

1. **Checklist Accuracy**  
   - At least 90% of scripts that include recognized best-practice sections are detected and marked as “met.”  
   - The tool appropriately flags missing or incomplete sections.

2. **Suggestion Relevance**  
   - Over 80% of user feedback indicates the provided suggestions are “helpful” or “somewhat helpful.”

3. **OpenAI API Integration**  
   - The system successfully communicates with the API at least 95% of the time without errors.  
   - Sensitive data (e.g., scripts, keys) is never exposed in logs or front-end messages.

4. **UI Clarity**  
   - Users can easily locate and interpret each section of feedback.  
   - The process to generate a revised script is discoverable and functional.

5. **Performance**  
   - Scripts of up to 2,000 words are analyzed within 5 seconds.  
   - The system can handle up to 10 concurrent requests without timing out.

---

## 8. Suggested Technology Stack

The following is a recommended tech stack to build and run Script Auditor. Adjust these suggestions based on your organization’s expertise or constraints:

1. **Front-End**  
   - **Framework:** React or Next.js (if you need server-side rendering and SEO)  
   - **UI Components:** Material UI or Tailwind CSS for rapid UI development  
   - **Integration with IDE (Cursor):** Provide a lightweight plugin/extension or a simple script that can integrate your auditing logic via an API call

2. **Back-End**  
   - **Runtime/Language:** Node.js or Python (Node.js might be simpler if you’re also using React)  
   - **Framework (if using Node.js):** Express or NestJS for building a RESTful API  
   - **AI Integration:** OpenRouter API with Claude 3 models for enhanced script analysis and suggestions
   - **API Management:** Implement request batching and response caching to optimize API usage

3. **Database**  
   - **Type:** PostgreSQL or MongoDB (if you need to store user information or usage logs)  
   - **ORM (optional):** Prisma (for Node.js) or SQLAlchemy (for Python) to simplify data modeling

4. **Authentication & Security**  
   - **API Key Storage:** Use environment variables or a secure vault (e.g., HashiCorp Vault, AWS Secrets Manager)  
   - **User Auth (Optional):** JSON Web Tokens (JWT) or NextAuth.js (if using Next.js)

5. **Infrastructure & Deployment**  
   - **Cloud Provider:** AWS, Azure, or Google Cloud  
   - **Containerization (optional):** Docker to ensure consistency across environments  
   - **Serverless (optional):** AWS Lambda, Azure Functions, or Vercel if you expect intermittent or scalable usage

6. **Testing & QA**  
   - **Unit Tests:** Jest or Mocha (Node.js) / PyTest (Python)  
   - **Integration Tests:** Cypress or Playwright for UI, Supertest for API endpoints  
   - **Continuous Integration (CI):** GitHub Actions, GitLab CI, or Jenkins to automate tests and deployments

### OpenRouter API Configuration

1. **API Setup**  
   - **API Key:** Stored securely in environment variables as `OPENROUTER_API_KEY`
   - **Base URL:** `https://openrouter.ai/api/v1`
   - **Supported Models:** 
     - anthropic/claude-3-opus-20240229 (highest quality)
     - anthropic/claude-3-sonnet-20240229 (balanced)
     - anthropic/claude-3-haiku-20240307 (fastest)

2. **Implementation Details**  
   - Use environment variables for API key storage:
     ```env
     OPENROUTER_API_KEY=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
     ```
   - Implement rate limiting and error handling
   - Cache responses where appropriate to minimize API calls

### Script Processing & Analysis Details

1. **Script Analysis Components**
   - **Structural Analysis**
     ```json
     {
       "sections": {
         "introduction": { "required": true, "minWords": 50 },
         "learningObjectives": { "required": true, "minCount": 2 },
         "mainContent": { "required": true, "minWords": 300 },
         "summary": { "required": true, "minWords": 50 },
         "callToAction": { "required": true }
       }
     }
     ```

   - **Engagement Metrics**
     ```json
     {
       "readabilityScore": { "target": "8th-10th grade" },
       "sentenceLength": { "average": "15-20 words" },
       "interactivityMarkers": ["?", "imagine", "consider", "try", "practice"],
       "transitionWords": ["first", "next", "then", "finally", "however"]
     }
     ```

2. **AI Prompt Templates**
   ```javascript
   const promptTemplates = {
     scriptAnalysis: `Analyze this tutorial script section:
       ###
       {scriptContent}
       ###
       Evaluate:
       1. Clarity (1-10)
       2. Engagement level (1-10)
       3. Technical accuracy
       4. Suggested improvements`,
     
     toneAdjustment: `Rewrite this section to be more conversational:
       ###
       {scriptContent}
       ###
       Requirements:
       - Use "you" and "your"
       - Break long sentences
       - Add relevant examples
       - Maintain technical accuracy`,
     
     interactivityEnhancement: `Add interactive elements to this section:
       ###
       {scriptContent}
       ###
       Add:
       - Reflection questions
       - Practice exercises
       - Real-world scenarios
       - Knowledge checks`
   };
   ```

3. **Response Processing**
   ```typescript
   interface ScriptAnalysis {
     sections: {
       [key: string]: {
         score: number;
         suggestions: string[];
         aiEnhancements: string;
         readabilityMetrics: {
           fleschKincaid: number;
           wordsPerSentence: number;
           technicalTerms: string[];
         }
       }
     };
     overallScore: number;
     prioritizedImprovements: string[];
   }
   ```

4. **Quality Thresholds**
   ```yaml
   minimum_requirements:
     overall_score: 7.5
     section_scores:
       introduction: 8.0
       learning_objectives: 8.5
       main_content: 7.5
       summary: 7.5
     engagement_metrics:
       questions_per_section: 2
       examples_per_concept: 1
       practice_exercises: 1
   ```

5. **Batch Processing Logic**
   ```python
   def process_script(script_content):
       sections = split_into_sections(script_content)
       results = []
       
       # Process in batches of 3 sections
       for batch in chunks(sections, 3):
           batch_results = await asyncio.gather(*[
               analyze_section(section) for section in batch
           ])
           results.extend(batch_results)
           
           # Rate limiting pause
           await asyncio.sleep(0.5)
       
       return combine_results(results)
   ```

6. **Error Handling & Fallbacks**
   ```typescript
   const errorHandling = {
     apiTimeout: {
       maxRetries: 3,
       backoffMs: 1000,
       fallbackAction: 'basic_analysis'
     },
     modelFailure: {
       alternateModels: [
         'claude-3-sonnet',
         'claude-3-haiku',
         'gpt-3.5-turbo'
       ],
       fallbackAction: 'pattern_matching'
     },
     contentLimits: {
       maxTokensPerRequest: 4000,
       chunkingStrategy: 'semantic_sections'
     }
   };
   ```

---

## 9. Implementation Roadmap (High-Level)

1. **Phase 1: Prototype**  
   - Build a minimal UI to paste a script.  
   - Integrate with OpenAI to return grammar suggestions.  
   - Return basic text-based feedback (no advanced parsing).

2. **Phase 2: Core Feature Development**  
   - Implement the script parsing logic to detect best-practice sections.  
   - Implement a user-friendly feedback display (checklist with collapsible detail).  
   - Add “Revise with AI” functionality.

3. **Phase 3: Enhancements & UI Polish**  
   - Add side-by-side script comparison.  
   - Improve performance (caching if necessary).  
   - Refine suggestions logic (contextual suggestions vs. generic).

4. **Phase 4: Testing & QA**  
   - Beta test with a small group of instructional designers.  
   - Collect feedback, fix bugs, refine suggestions.  
   - Ensure performance and reliability metrics are met.

5. **Phase 5: Launch & Iteration**  
   - Release MVP to the wider user base.  
   - Implement analytics to track usage, gather user satisfaction data.  
   - Continuous iteration and improvement based on user feedback.

---

## 10. Open Questions / Future Considerations

- **Localization:** Will the app support scripts in multiple languages (beyond English)?  
- **Advanced Analytics:** Should we track which suggestions are accepted most frequently to improve ML models?  
- **Collaboration Features:** Do we need multi-user editing or reviewer/approval workflows in future versions?

---

##End of Document
