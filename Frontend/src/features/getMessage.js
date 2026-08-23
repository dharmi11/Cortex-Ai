import api from "../../utils/axios"

 export const getMessage = async (id) =>{
    try {
        const {data} = await api.get(`/api/chat/get-message/${id}`) ;
        console.log("get conversation by Id " , data)
        return data ;

    } catch (error) {
        console.log(`get message id error ${error}`)   
        return []
    }
 }