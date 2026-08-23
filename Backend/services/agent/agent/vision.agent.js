import axios from "axios";
import getModels from "../config/llmModels.js"
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";

export const visionAgent = async (state) => {
    try {


        const llm = await getModels("image");
       const res = await llm.invoke(`
You are an elite AI image prompt engineer.

Convert the user's request into ONE extremely detailed, production-ready prompt
for a photorealistic AI image generator.

Do NOT ask questions.
Do NOT explain anything.
Return ONLY the final image-generation prompt.

The prompt MUST describe:
- Exact subject and action
- Environment and background
- Camera angle
- Camera lens and focal length
- Composition
- Lighting direction and intensity
- Time of day
- Materials and textures
- Realistic anatomy and proportions
- Depth of field
- Natural shadows
- Reflections
- Atmospheric details
- Photorealistic details
- Cinematic color grading
- High dynamic range
- Sharp foreground and realistic background
- Professional photography quality
- Ultra-detailed textures
- High-end commercial photography
- 8K detail

Avoid:
- blurry image
- low resolution
- distorted objects
- bad anatomy
- extra limbs
- duplicate objects
- deformed faces
- unrealistic proportions
- cartoon
- illustration
- oversaturated colors

User request:
${state.prompt}
`);

        const prompt = res.content.trim()

        const imageUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
            `?model=flux` +
            `&width=1024` +
            `&height=1024` +
            `&enhance=true`;


        const imageRes = await axios.get(imageUrl, {
            responseType: "arraybuffer",
        });
        await deductCredits(state.userId , "vission")


        const buffer = Buffer.from(imageRes.data);



        const filename = `image-${Date.now()}.png`

        await uploadToS3(filename, buffer, "image/png")

        const downloadUrl = await getFromS3(filename, 24 * 60 )












        return {
            ...state,
            aiResponse: `
# Image Generated successfully

![Generated Image](${downloadUrl})

[Download Image](${downloadUrl})

Link expires in 24 hours.
`
        }
    } catch (error) {
        return {
            ...state,
            aiResponse: "Failed to generate Image please try again !"
        }
    }
}