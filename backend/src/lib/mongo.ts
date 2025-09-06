import mongoose from "mongoose";

export async function connectMongo(uri: string) {
  if (!uri) throw new Error("MONGO_URI no está definido");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}
