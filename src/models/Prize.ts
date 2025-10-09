import mongoose, { Schema, models } from "mongoose";

const prizeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  angleMin: { type: Number, required: true, default: 0 },
  angleMax: { type: Number, required: true, default: 0 },
});

const Prize = models.Prize || mongoose.model("Prize", prizeSchema);
export default Prize;