import getModels from "../config/llmModels.js";


// ============================================================
// FILE PARSER
// ============================================================

const parseGeneratedFiles = (content = "") => {
  const files = [];

  const regex =
    /<<<FILE:([\w.-]+)>>>\s*([\s\S]*?)\s*<<<END_FILE>>>/g;

  let match;

  while ((match = regex.exec(content)) !== null) {
    const name = match[1].trim();
    const fileContent = match[2].trim();

    if (!name) continue;

    files.push({
      name,
      content: fileContent,
    });
  }

  return files;
};


// ============================================================
// CODING AGENT
// ============================================================

export const codingAgent = async (state) => {

  // ----------------------------------------------------------
  // Models
  // ----------------------------------------------------------

  const intentLlm = await getModels("intent");
  const llm = await getModels("coding");


  // ==========================================================
  // 1. INTENT DETECTION
  // ==========================================================

  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY ONE value:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSATION
DOCUMENTATION

User Request:
${state.prompt}
`);

  const intent = String(intentRes.content).trim();

  console.log("USER INTENT:", intent);



  if (intent === "CODE_GENERATION") {

    const prompt = 
`You are CodexAI, a professional software engineer and modern UI developer.

Generate a complete, runnable solution for the user's request.

USER REQUEST:
${state.prompt}

1. CHOOSE THE TECHNOLOGY


Choose the technology based on the user's request.

Website / landing page / UI:
- HTML
- CSS
- JavaScript

React request:
- React

Node.js request:
- Node.js

C++ request:
- C++

Python request:
- Python

Java request:
- Java

SQL request:
- SQL

Do not generate web files for non-web programming requests.

==================================================
2. WEBSITE QUALITY
==================================================

When the request is for a website, create a polished, modern, production-quality UI.

The result must NOT look like a basic HTML demo.

Use:
- Strong visual hierarchy
- Modern typography
- Consistent spacing
- CSS variables
- Flexbox and/or Grid
- Responsive design
- Cards and sections where appropriate
- Clear navigation
- Attractive buttons
- Hover and active states
- Smooth transitions
- Subtle animations when useful
- Proper borders, shadows and backgrounds
- Realistic content
- Good desktop and mobile layouts

Match the requested theme closely.

If the user asks for a specific brand/style/layout, prioritize that request over generic design choices.

==================================================
3. FUNCTIONALITY
==================================================

Make the generated UI actually work.

Use JavaScript for interactions such as:
- Buttons
- Navigation
- Menus
- Tabs
- Search
- Filters
- Modals
- Add to cart
- Cart count
- Forms
- Toggle states
- Simple UI interactions

Do not create fake backend functionality.

If a real backend is not requested, implement only frontend behavior that can work in the browser.

==================================================
4. IMAGES
==================================================

When images are needed:

- Use valid remote Unsplash image URLs.
- Use multiple relevant images when appropriate.
- Choose images matching the requested content.
- Never create image files.
- Never invent broken local image paths.
- Make images responsive with CSS.
- Use appropriate object-fit behavior.
- Do not let images break the layout.

==================================================
5. WEB FILES
==================================================

For a normal website generate exactly:

index.html
style.css
script.js

index.html MUST correctly reference:

<link rel="stylesheet" href="style.css">

and:

<script src="script.js"></script>

All three files must work together without modification.

==================================================
6. CODE QUALITY
==================================================

Write complete, clean and maintainable code.

Use semantic HTML.

Keep CSS organized and consistent.

Avoid unnecessary dependencies.

Do not use external libraries unless specifically requested or genuinely necessary.

Do not leave placeholders such as:
- "add code here"
- "..."
- "implement this"
- "coming soon"

Do not truncate code.

Generate the complete solution.

==================================================
7. OUTPUT FORMAT
==================================================

Return ONLY file blocks.

DO NOT return:
- JSON
- Markdown
- explanations
- introductions
- code fences
- comments outside files

Use exactly this format:

<<<FILE:index.html>>>
complete HTML
<<<END_FILE>>>

<<<FILE:style.css>>>
complete CSS
<<<END_FILE>>>

<<<FILE:script.js>>>
complete JavaScript
<<<END_FILE>>>

For other programming languages use the correct filename.

Example:

<<<FILE:main.cpp>>>
complete C++ code
<<<END_FILE>>>

==================================================
8. FINAL CHECK
==================================================

Before returning the answer, internally verify:

- Every requested feature is implemented.
- HTML references the correct CSS and JS files.
- CSS is actually used by the HTML.
- JavaScript selectors match the HTML.
- Image URLs are valid-looking remote URLs.
- No file is incomplete.
- Every file starts with <<<FILE:filename>>>.
- Every file ends with <<<END_FILE>>>.
- Return only the file blocks.
`
;


    // ========================================================
    // CALL CODING MODEL
    // ========================================================

    const res = await llm.invoke(prompt);

    const rawContent = String(res.content || "");


    const files = parseGeneratedFiles(rawContent);




    if (files.length === 0) {

      console.error(
        "❌ Coding model did not return valid file blocks."
      );

      return {
        ...state,

        aiResponse:
          "I couldn't generate the code correctly. Please try again.",

        artifacts: [],
      };
    }

console.log(
  "🔥 FINAL ARTIFACT:",
  JSON.stringify(
    {
      id: Date.now(),
      type: "code",
      title: state.prompt,
      files: files,
    },
    null,
    2
  )
);

    return {

      ...state,

      aiResponse: "Code Generated",

      artifacts: [
        {
          id: Date.now(),

          type: "code",

          title: state.prompt,

          files: files,
        },
      ],
    };
  }


  // ==========================================================
  // 3. NON-CODING REQUESTS
  // ==========================================================

  const res = await llm.invoke(`
You are CodexAI.

User intent:
${intent}

User request:
${state.prompt}

Provide a concise and useful response.

Use Markdown when appropriate.

Do not generate project files unless the user explicitly requests code.
`);


  return {

    ...state,

    aiResponse: res.content,

    artifacts: [],
  };
};