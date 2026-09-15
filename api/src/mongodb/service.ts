import { MongoClient } from "mongodb";

const mongodbUrl = import.meta.env.MONGODB_URL!;
const mongodbDbName = import.meta.env.MONGODB_DB_NAME!
export const mongodbClient = new MongoClient(mongodbUrl);

try {
    await mongodbClient.connect();
    console.log("✅ Database connected");
} catch (error) {
    console.error("❎ Database connection failed:", error);
    process.exit(1);
}

export function db() {
    const mongodbConnection = mongodbClient.db(mongodbDbName);
    return mongodbConnection;
}