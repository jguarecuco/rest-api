import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import "../auth/passportHandler";
import { IUser, User } from '../models/user';
import { JWT_SECRET } from "../util/secrets";

function validateUser(hash: string, password: string) {
  console.log("hash", hash, "password", password);

  return bcrypt
    .compareSync(password, hash)

}

export class UserController {

  public async registerUser(req: Request, res: Response): Promise<void> {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    await User.create({
      username: req.body.username.toLowerCase(),
      password: req.body.password,
    });

    const token = jwt.sign({ username: req.body.username, scope: req.body.scope }, JWT_SECRET);
    res.status(200).send({ token: token });
  }
  public authenticateUser(req: Request, res: Response, next: NextFunction) {
    console.log("Esto esta llegando aca");
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    User.findOne({ username: req.body.username.toLowerCase() }, (err, user: any) => {
      if (err) {
        return res.status(401).json({ status: "error", code: "unauthorized1" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: `username ${req.body.username} not found.` });
      }

      const result = validateUser(user.password, req.body.password);

      if (result) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        res.status(200).send({ token: token });
      } else {
        return res.status(401).json({
          status: "error", code: "unauthorized"
        })
      }
 
    });

  }


}