import getModels from "../config/llmModels.js"

export const router = async (state) => {
    if (state.agent && state.agent !== "auto") {
        const directAgent = String(state.agent).trim().toLowerCase();

        console.log("🔥 DIRECT AGENT:", directAgent);

        return {
            ...state,
            agent: directAgent
        };
    }


    const llm = await getModels("router")
    const prompt = `You are an agent router .
    
    available agents :
    - chat,
    - search,
    - coding,
    - pdf,
    - ppt,
    - vision.

    Rules : 
    chat :
    general conversation ,
    explanation of concepts ,
    learning and tutoring ,
    providing information and answering questions ,
    brainstorming and idea generation ,

    search:
    current events and news ,
    fact-checking and verification ,
    research and academic inquiries ,
    product and service information ,
    travel and local information ,

    coding :
    Generating code snippets and examples ,
    debugging and troubleshooting code ,
    build projects and applications ,
    architectural and design guidance ,
    integration with APIs and libraries ,

    pdf :
- Creating and generating PDF documents
- Generating reports and documents
- Creating structured PDF content
- Converting generated content into PDF
- PDF document formatting
- PDF summarization and analysis
- PDF content extraction
    
    ppt :
    questions related to PowerPoint presentations ,

    vision :
    image recognition and classification ,
    object detection and tracking ,
    image generation and manipulation ,
    visual question answering ,
    image captioning and description ,

    return ONLY one word :

    chat 
    search
    coding
    pdf
    ppt
    vision


    User Query:
    ${state.prompt}
    `

    const response = await llm.invoke(prompt)
    // console.log("Router Response : ", response.content.trim().toLowerCase())
    return {
        ...state,
        agent: response.content.trim().toLowerCase()
    }

}