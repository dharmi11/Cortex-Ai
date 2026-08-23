export const getCurrentUser = (req, res) => {
    try {
        return res.status(200).json(req.user)
        console.log("get Cureent USer " , data)
    } catch (error) {
        return res.status(500).json({
            message: `get Current User Error ${error}`
        })
    }
}