import mongoose, { Document, Schema } from "mongoose";

export enum Status {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  BUSY = "BUSY",
}
export interface IBycecle {
  slug: string;
  name: string;
  type: string;
  color: string;
  wheel_size: number;
  price: number;
  description: string;
  status: string;
}

export interface IBycecleModel extends IBycecle, Document {}

const BycecleSchema: Schema = new Schema<IBycecle>(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    wheel_size: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "UNAVAILABLE", "BUSY"],
      default: "AVAILABLE",
    },
  },
  {
    versionKey: false,
  }
);
export default mongoose.model<IBycecleModel>("Bycecle", BycecleSchema);
