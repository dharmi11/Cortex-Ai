import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import router from "./routes/chat.route.js";

dotenv.config();

const PORT = process.env.PORT
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.json({
        message: "Hello from Chat"
    })
})

app.use("/" , router)


// console.log(process.env.MONGO_URI);
app.listen(PORT, () => {
    console.log(`chat is started on PORT ${PORT}`);
    connectDb();
})