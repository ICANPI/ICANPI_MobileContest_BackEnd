import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import * as moment from "moment";
const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  lastLoginTime: {
    type: String,
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  loginCount: {
    type: Number,
    required: true,
  },
  sleep_time: {
    type: Array,
    required: true,
  },
  achievements: {
    type: Array,
    required: true,
  },
});
export interface IUser extends Document {
  id: string;
  password: string;
  email: string;
  username: string;
  lastLoginTime: string;
  createdTime: string;
  loginCount: string;
  sleep_time: Array<any>;
  achievements: Array<any>;
}
export interface UserCreate {
  id: string;
  password: string;
  email: string;
  username: string;
}
export interface Result {
  mes: string;
  success: boolean;
}
export interface UserDocument extends Document, IUser {
  //methods 등록
}
export interface IUserDocument extends Model<UserDocument> {
  //statics methods 등록
  getToken(): Promise<any>;
  create(): Promise<Result>;
  loginAuthentication();
}
userSchema.statics.getToken = function (data: UserDocument): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      console.log(data.email);
      return resolve(
        jwt.sign(
          {
            email: data.email,
          },
          process.env.JWT_SECRET_KEY || "USER_SECRET",
          {
            expiresIn: 100000000, //초
          }
        )
      );
    } catch (e) {
      reject(e);
    }
  });
};

userSchema.statics.create = async function (data: UserCreate): Promise<Result> {
  return new Promise(async function (resolve, reject) {
    try {
      if (await User.findOne({ email: data.email })) {
        return resolve({ success: false, mes: "이메일 중복" });
      }
      if (await User.findOne({ id: data.id })) {
        return resolve({ success: false, mes: "아이디 중복" });
      }

      console.log("실행");
      let now = moment();
      let createdTime = now.format("YYYY-MM-DD HH:mm:ss");
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        const user: any = new User({
          id: data.id,
          password: hash,
          email: data.email,
          username: data.username,
          lastLoginTime: createdTime,
          createdTime: createdTime,
          loginCount: 0,
          sleep_time: [],
          achievements: [],
        });
        user.save().then((data) => {
          return resolve({ success: true, mes: "회원가입을 성공 하였습니다." });
        });
      });
    } catch (err) {
      return reject({ success: false, mes: "DB 오류." });
    }
  });
};
userSchema.statics.loginAuthentication = async function (data) {
  try {
    let user = await this.findOne({ email: data.email });
    if (!user) {
      return { success: false, mes: "존재하지 않은 계정입니다." };
    } else {
      let now: Date = new Date();
      user.lastLoginTime = now;
      await user.save();
      console.log("인증성공");
      return { success: true, mes: "인증 성공" };
    }
  } catch (err) {
    throw err;
  }
};

const User: Model<UserDocument> = model("User", userSchema) as IUserDocument;
export default User;
