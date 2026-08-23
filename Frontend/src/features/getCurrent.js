import api from "../../utils/axios"

const getCurrentUser = async ()=>{
    try {
        const {data} = await api.get("/api/user")
        console.log("get Cureent USer " , data)
        return data ;
        
    } catch (error) {
        console.log(error)
    }
}

export default getCurrentUser