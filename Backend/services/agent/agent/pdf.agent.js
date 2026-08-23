import getModels from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";


export const pdfAgent = async (state) => {
    try {
        const llm = await getModels("pdf");

        const prompt = `
You are an expert document writer.

Return ONLY a valid JSON object.

Do NOT return:
- Markdown
- code fences
- explanations
- extra text

Use exactly this structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

Requirements:

- Generate 4-8 sections.
- Each section must have a unique heading.
- Each section must contain 3-5 concise and informative points.
- Keep the content professional and easy to understand.
- Make the content suitable for a PDF document.

Topic:
${state.prompt}
`;

        const res = await llm.invoke(prompt);

        const data = JSON.parse(String(res.content));
                await deductCredits(state.userId , "pdf")

        
        const pdfBuffer = await generatePdf(data);

        const filename = `pdf-${Date.now()}.pdf`

        await uploadToS3(filename, pdfBuffer, "application/pdf");


        const downloadUrl = await getFromS3(filename, 24 * 60);



        return {
            ...state,
            aiResponse: `
# PDF Generated
**${data.title}**
[Download PDF](${downloadUrl})
`
        }

    } catch (error) {
        console.error("PDF AGENT ERROR:", error);

        return {
            ...state,
            aiResponse: "Failed to generate PDF.",

        };
    }
};