import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy";
import cors from "cors"
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controller/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";

dotenv.config();
const port = process.env.PORT

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log("Agent URL:", req.method, req.url);
    next();
});
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(morgan("dev"))
app.use("/api/auth" , proxy(process.env.AUTH_SERVICE))
app.use("/api/chat" ,protect ,proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agent" ,protect ,proxyWithHeader(process.env.AGENT_SERVICE))
app.use("/api/billing" ,protect ,proxyWithHeader(process.env.BILLING_SERVICE))




app.use("/api/user" , protect , getCurrentUser);


app.get("/" , (req,res)=>{
    res.send("gateway is working afte Ci/Cd pipeline v1 ")
})

app.listen(port , ()=>{
    console.log(`Gateway is started on ${port} `);
})