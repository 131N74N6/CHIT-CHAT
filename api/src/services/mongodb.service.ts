import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const mongodb = mongoose.connect(`${process.env.MONGODB_URL}`)
.then(res => {
    if (res) console.log("Database connected ✔️");
})
.catch(err => {
    console.log(`❌ Connection failed : ${err}`);
});