import api from "../../utils/axios"

export const createConversation = async () =>{
    try {
    
    const {data} = await api.get("/api/chat/create-conversation")
    
            console.log("create conversation " , data);
            return data 
    } catch (error) {
        
        console.log(`create conversation Error ${error}`)
    }

}