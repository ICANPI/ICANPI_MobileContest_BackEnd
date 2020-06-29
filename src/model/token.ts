import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import User from "./user";
const tokenSchema = new Schema({
  createdTime: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  revoked: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});
export interface IToken extends Document {
  createdTime: string;
  expirationTime: string;
  type: number;
  owner: string;
  revoked: boolean;
  token: string;
}
export interface Result {
  mes: string;
  success: boolean;
}
export interface TokenDocument extends Document, IToken {}
export interface ITokenDocument extends Model<TokenDocument> {
  create();
}
tokenSchema.statics.create = function (
  email: string,
  type: string = "accessToken"
): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      let Time = moment();

      if (type == "accessToken") {
        // accessToken 발급
        let accessToken = await jwt.sign(
          {
            email: email,
          },
          process.env.JWT_SECRET_KEY || "USER_SECRET",
          {
            expiresIn: 604800, //초  7일
          }
        );
        // token DB 저장
        const token: any = new Token({
          createdTime: Time.format("YYYY-MM-DD HH:mm:ss"),
          expirationTime: Time.add(7, "days"),
          type: "accessToken",
          owner: email,
          revoked: false,
          token: accessToken,
        });
        token.save().then((data) => {
          return resolve({
            success: true,
            mes: "저장 성공 하였습니다.",
            token: accessToken,
          });
        });
      } else {
        // refreshToken 발급
        let refreshToken = await jwt.sign(
          {
            email: email,
          },
          process.env.JWT_SECRET_KEY || "USER_SECRET",
          {
            expiresIn: 2592000, //초 30일
          }
        );
        // token DB 저장
        const token: any = new Token({
          createdTime: Time.format("YYYY-MM-DD HH:mm:ss"),
          expirationTime: Time.add(7, "days"),
          type: "refreshToken",
          owner: email,
          revoked: false,
          token: refreshToken,
        });
        token.save().then((data) => {
          return resolve({
            success: true,
            mes: "저장 성공 하였습니다.",
            token: refreshToken,
          });
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const Token: Model<TokenDocument> = model(
  "Token",
  tokenSchema
) as ITokenDocument;
export default Token;
