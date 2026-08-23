import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import "./config/firebase.js"
import connectDb from "./config/db.js";
import authroute from "./routes/auth.route.js"
dotenv.config();

const PORT = process.env.PORT
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.json({
        message: "Hello from from Auth v2 and firebase solve"
    })
})

app.use("/", authroute)
// console.log(process.env.MONGO_URI);
app.listen(PORT, () => {
    console.log(`Auth is is started on PORT ${PORT}`);
    connectDb();
})
