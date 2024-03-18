import { Document, Schema, Model, model, Error } from "mongoose";

export interface IProduct extends Document {
  productId: String;
  name: String;
  description: string;
  price: Number;
  quantity: Number;
}

export const productSchema = new Schema({
  productId: {
    type: String, required: true,
    unique: true
  },
  name: String,
  description: String,
  price: Number,
  quantity: Number
});



export const Product: Model<IProduct> = model<IProduct>("Product", productSchema);