import mongoose, { Schema } from "mongoose";

const PrizeSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.models.Prize || mongoose.model("Prize", PrizeSchema);