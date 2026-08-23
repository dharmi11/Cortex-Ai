import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);
const connectDb = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo database conneted");
    } catch (error) {
        console.log(`Database erro ${error}`);
        console.error("Database Error:");
        console.error(error); // Full error object
        console.error(error.stack); // Full stack trace
    }
}

export default connectDb;