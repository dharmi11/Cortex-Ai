import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import router from "./routes/billing.route.js";



dotenv.config();

const PORT = process.env.PORT
const app = express();
app.use(express.json());

app.use("/" , router)
app.get("/", (req, res) => {
    res.json({
        message: "Hello from Billing"
    })
})


app.listen(PORT, () => {
    console.log(`Billing is started on PORT ${PORT}`);
    connectDb();
})
