import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import * as moment from "moment";
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    required: true,
  },
  like_users: {
    type: Array,
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  host_id: {
    type: String,
    required: true,
  },
});
export interface IPost extends Document {
  title: string;
  text: string;
  like: number;
  like_users: string[];
  createdTime: string;
  host_id: string;
}
export interface Result {
  mes: string;
  success: boolean;
}
export interface PostDocument extends Document, IPost {}
export interface IPostDocument extends Model<PostDocument> {}

const User: Model<PostDocument> = model("User", postSchema) as IPostDocument;
export default User;
