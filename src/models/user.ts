import { Document, Schema, Model, model, Error } from "mongoose";
import bcrypt from "bcrypt-nodejs";

export interface IUser extends Document {
  username: string;
  password: string;
}

export const userSchema: Schema = new Schema({
  username: String,
  password: String,
});


userSchema.pre<IUser>("save", function save(next) {
  const user = this;
console.log("Guardando usuarios")
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(this.password, salt, undefined, (err: Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

 

export const User: Model<IUser> = model<IUser>("User", userSchema);
