import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import * as moment from "moment";
const commentSchema = new Schema({
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
  likeUsers: {
    type: Array,
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  host_email: {
    type: String,
    required: true,
  },
});

export interface IComment extends Document {
  title: string;
  text: string;
  like: number;
  likeUsers: string[];
  createdTime: string;
  host_email: string;
}
export interface Result {
  mes: string;
  success: boolean;
}
export interface CommentDocument extends Document, IComment {}
export interface ICommentDocument extends Model<CommentDocument> {}

const Comment: Model<CommentDocument> = model(
  "Comment",
  commentSchema
) as ICommentDocument;
export default Comment;
