    import redis from "../../shared/redis/redis.js";

    const protect = async (req, res, next) => {
        try {
            // console.log("Cookies:", req.cookies);
            const sessionId = req.cookies?.sessionId;
            if (!sessionId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const sessionData = await redis.get(`session:${sessionId}`);
            if (!sessionData) {
                return res.status(401).json({
                    message: "Session expired or invalid",
                });
            }
            req.user = JSON.parse(sessionData);
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    export default protect;