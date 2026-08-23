import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent = async (state) => {
    try {
        const result = await searchTool.invoke({
            query: state.prompt
        })

                await deductCredits(state.userId , "search")

        return {
            ...state,

            // Sirf top 2 search results
            searchResult:
                result.results?.slice(0, 2).map((r) => ({
                    title: r.title,
                    content: r.content?.slice(0, 200), // sirf first 200 characters
                    url: r.url,
                })) || [],

            // Sirf 2 images
            images:
                result.images?.slice(0, 4).map((img) => ({
                    url: img.url,
                })) || [],
        };
    } catch (error) {
        console.error("Search Agent Error");
        console.error(error.response?.data || error.message);

        return {
            ...state,
            searchResult: [],
            images: [],
        };
    }
}