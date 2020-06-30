import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import User from "./user";
const achievementsSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  successNumber: {
    type: Number,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
});
export interface IAchievements extends Document {
  owner: string;
  successNumber: number;
  list: Array<any>;
}
export interface Result {
  mes: string;
  success: boolean;
}
export interface AchievementsDocument extends Document, IAchievements {}
export interface IAchievementsDocument extends Model<AchievementsDocument> {
  create();
  get();
  update();
}
achievementsSchema.statics.create = function (email: string): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      const achievements: any = new Achievements({
        owner: email,
        successNumber: 0,
        list: [
          {
            category: "수면 시간",
            data: [
              {
                date: 2,
                hours: 7,
                title: "2일 연속 7시간 이상 수면",
                value: false,
              },
              {
                date: 4,
                hours: 7,
                title: "4일 연속 7시간 이상 수면",
                value: false,
              },
              {
                date: 6,
                hours: 7,
                title: "6일 연속 7시간 이상 수면",
                value: false,
              },
              {
                date: 8,
                hours: 7,
                title: "8일 연속 7시간 이상 수면",
                value: false,
              },
              {
                date: 10,
                hours: 7,
                title: "10일 연속 7시간 이상 수면",
                value: false,
              },
              {
                date: 12,
                hours: 7,
                title: "12일 연속 7시간 이상 수면",
                value: false,
              },
              {
                date: 14,
                hours: 7,
                title: "14일 연속 7시간 이상 수면",
                value: false,
              },
            ],
          },
        ],
      });
      achievements.save().then((data) => {
        console.log("데이터 생성", data);
        return resolve({
          success: true,
          mes: "업적을 생성 하였습니다",
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
//전체 출력
achievementsSchema.statics.get = function (email: string): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      //이메일에 해당되는 업적 전체를 가져오면 됨
      return resolve({
        success: true,
        mes: "성공적으로 호출 하였습니다",
      });
    } catch (e) {
      reject(e);
    }
  });
};

achievementsSchema.statics.update = function (
  category: string,
  title: string,
  email: string,
  state: boolean = true
): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      //해당되는 업적의 이름을 통해 그 업적을 업데이트 시키면 됨
      console.log("잘들어옴", category, title, email, state);
      Achievements.findOne({ owner: email }, async (err, result) => {
        if (err) throw err;
        if (result != null) {
          result.list.forEach((element, index1) => {
            if (element.category == category) {
              console.log("카테고리 찾음");
              element.data.forEach((element, index2) => {
                console.log("for문 들어감", element);
                if (element.title == title) {
                  console.log("찾음", result.list[index1].data[index2]);
                  result.list[index1].data[index2].value = state;
                  console.log(
                    "바뀜",
                    result.list[index1].data[index2].title,
                    result.list[index1].data[index2].value
                  );
                }
              });
            }
          });
          console.log("데이터 Save", result.list[0].data);

          await result.save();
          Achievements.findOneAndUpdate(
            { owner: email },
            {
              $set: {
                list: result.list,
              },
            },
            { new: true }
          ).exec(function (err, r) {
            console.log(r);
          });

          return resolve({
            success: true,
            mes: "업데이트를 성공 하였습니다",
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
const Achievements: Model<IAchievementsDocument> = model(
  "Achievements",
  achievementsSchema
) as IAchievementsDocument;
export default Achievements;
