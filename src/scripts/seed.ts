import mongoose from "mongoose";
import Prize from "@/models/Prize";
import connectDB from "@/lib/mongodb";

async function seed() {
  await connectDB();

  await Prize.deleteMany();

  await Prize.insertMany([
    { name: "Taça Acrilico", quantity: 3 },
    { name: "Chaveiro abridor de garrafa", quantity: 5 },
    { name: "Copo ecolabel", quantity: 2 },
    { name: "Tente outra vez", quantity: -1 },
    { name: "Mochila saco", quantity: 4 },
    { name: "Garrafa térmica", quantity: 1 },
  ]);

  console.log("Banco populado!");
  mongoose.connection.close();
}

seed();