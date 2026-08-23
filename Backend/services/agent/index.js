import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";



dotenv.config();

const PORT = process.env.PORT
const app = express();
app.use(express.json());

app.use("/" , router)

// console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
    console.log(`Agnet is started on PORT ${PORT}`);
    connectDb();
})