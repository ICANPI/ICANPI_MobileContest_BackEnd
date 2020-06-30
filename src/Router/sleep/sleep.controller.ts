import { Request, Response, NextFunction } from "express";
import Controller from "../../lib/controller";
import User from "../../model/user";
import Achievements from "../../model/achievements";

import * as jwt from "jsonwebtoken";
let moment = require("moment"); // require

class AuthController extends Controller {
  constructor() {
    super();
  }
  /**
   * @swagger
   * /sleep/update:
   *   put:
   *     summary: 수면시간을 업데이트합니다.
   *     tags:
   *	     - Sleep
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestSleepUpdate"
   *       - in: header
   *         name: Authorization
   *         type: string
   *         schema:
   *           $ref: "#/definitions/Token"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseSleepUpdate"
   */
  // [{year:"2020",month:"6",day:"20",time:"08:02:32",all:"2020-06-02 date객체"},]
  public UpdateSleepTime(req: Request, res: Response, next: NextFunction) {
    try {
      const { day, time } = req.body;
      let decoded: any = jwt.verify(
        req.headers["authorization"].split("Bearer ")[1],
        process.env.JWT_SECRET_KEY
      );
      console.log(day, time);
      let sleepTime = moment(`${day} ${time}`);
      console.log("체크", sleepTime.format("YYYY-MM-DD"));
      User.findOne({ email: decoded.email }, (err, result) => {
        if (err) throw err;
        if (result != null) {
          let timeArray = [];
          let bol = 0;

          if (result.sleepTime.length > 0) {
            console.log("원래있음");
            timeArray = result.sleepTime.map(function (e) {
              console.log(e.day, sleepTime.format("YYYY-MM-DD"));
              if (e.day == sleepTime.format("YYYY-MM-DD")) {
                console.log("같음");
                return {
                  day: sleepTime.format("YYYY-MM-DD"),
                  data: {
                    year: sleepTime.year(),
                    month: sleepTime.month() + 1,
                    date: sleepTime.date(),
                    hours: sleepTime.hours(),
                    minutes: sleepTime.minutes(),
                    seconds: sleepTime.seconds(),
                  },
                };
              } else {
                console.log("다름");
                bol++;
                return e;
              }
            });
            if (bol == result.sleepTime.length) {
              console.log("중복 날짜가 없었음");
              timeArray.push({
                day: sleepTime.format("YYYY-MM-DD"),
                data: {
                  year: sleepTime.year(),
                  month: sleepTime.month() + 1,
                  date: sleepTime.date(),
                  hours: sleepTime.hours(),
                  minutes: sleepTime.minutes(),
                  seconds: sleepTime.seconds(),
                },
              });
            }
          } else {
            timeArray.push({
              day: sleepTime.format("YYYY-MM-DD"),
              data: {
                year: sleepTime.year(),
                month: sleepTime.month() + 1,
                date: sleepTime.date(),
                hours: sleepTime.hours(),
                minutes: sleepTime.minutes(),
                seconds: sleepTime.seconds(),
              },
            });
          }

          result.sleepTime = timeArray;
          result.save();
          let number: number = 0;
          let nowDay = moment();

          for (let i = 0; i < 14; i++) {
            // 체크하는 범위
            result.sleepTime.forEach((element) => {
              //일을 하나 꺼냄
              console.log(
                element.day,
                nowDay.format("YYYY-MM-DD"),
                element.data.hours
              );
              if (
                i == 0 &&
                element.day == nowDay.format("YYYY-MM-DD") &&
                element.data.hours >= 7
              ) {
                console.log("7이상", nowDay.format("YYYY-MM-DD"));
                number++;
              } else if (
                element.day == nowDay.format("YYYY-MM-DD") &&
                element.data.hours >= 7
              ) {
                console.log("7이상", nowDay.format("YYYY-MM-DD"));
                number++;
              }
            });

            if (i + 1 != number) {
              break;
            }
            nowDay.subtract(1, "days");
          }
          // 갯수를 구했으니 수면시간 업적을 업데이트 해줘야한다

          Achievements.findOne(
            { owner: decoded.email },
            async (err, result) => {
              if (err) throw err;
              if (result != null) {
                console.log("두영이머머리", number);
                if (number >= 2) {
                  await Achievements.update(
                    "수면 시간",
                    "2일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                  console.log("2222");
                }
                if (number >= 4) {
                  await Achievements.update(
                    "수면 시간",
                    "4일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                }
                if (number >= 6) {
                  await Achievements.update(
                    "수면 시간",
                    "6일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                }
                if (number >= 8) {
                  await Achievements.update(
                    "수면 시간",
                    "8일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                }
                if (number >= 10) {
                  await Achievements.update(
                    "수면 시간",
                    "10일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                }
                if (number >= 12) {
                  await Achievements.update(
                    "수면 시간",
                    "12일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                }
                if (number >= 14) {
                  await Achievements.update(
                    "수면 시간",
                    "14일 연속 7시간 이상 수면",
                    decoded.email,
                    true
                  );
                }
              }
            }
          );

          return super.Response(
            res,
            200,
            "수면시간을 성공적으로 업데이트 했습니다",
            {
              success: true,
            }
          );
        }
      });
    } catch (e) {
      return next(e);
    }
  }
  /**
   * @swagger
   * /sleep/get:
   *   post:
   *     summary: 평균 수면시간을 가져옵니다.
   *     tags:
   *	     - Sleep
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestGetSleepTime"
   *       - in: header
   *         name: Authorization
   *         type: string
   *         schema:
   *           $ref: "#/definitions/Token"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseGetSleepTime"
   */

  public GetSleepTime(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, date } = req.body;
      let decoded: any = jwt.verify(
        req.headers["authorization"].split("Bearer ")[1],
        process.env.JWT_SECRET_KEY
      );
      console.log(type.day, type.week, type.month);
      let dataList: any = {};
      let yearNumber: number = moment(date).year();
      let monthNumber: number = moment(date).month() + 1;
      let dateNumber: number = moment(date).date();
      User.findOne({ email: decoded.email }, (err, result) => {
        if (err) throw err;
        if (result != null) {
          let seconds: number = 0;
          let secondNumber: number = 0;
          let monthSeconds: number = 0;
          let monthSecondNumber: number = 0;
          result.sleepTime.forEach((element: any) => {
            if (type.indexOf("day") != -1) {
              if (
                element.data.year == yearNumber &&
                element.data.month == monthNumber &&
                element.data.date == dateNumber
              ) {
                let hours =
                  element.data.hours.toString().length == 1
                    ? "0" + element.data.hours
                    : element.data.hours;
                let minutes =
                  element.data.minutes.toString().length == 1
                    ? "0" + element.data.minutes
                    : element.data.minutes;
                let seconds =
                  element.data.seconds.toString().length == 1
                    ? "0" + element.data.seconds
                    : element.data.seconds;
                dataList.day = hours + ":" + minutes + ":" + seconds;
              }
            }
            if (type.indexOf("week") != -1) {
              if (
                element.data.year == yearNumber &&
                moment(element.day).week() == moment(date).week()
              ) {
                seconds +=
                  element.data.seconds +
                  60 * (element.data.minutes + 60 * element.data.hours);
                secondNumber += 1;
              }
            }
            if (type.indexOf("month") != -1) {
              if (
                element.data.year == yearNumber &&
                element.data.month == monthNumber
              ) {
                monthSeconds +=
                  element.data.seconds +
                  60 * (element.data.minutes + 60 * element.data.hours);
                monthSecondNumber += 1;
              }
            }
          });
          if (!dataList.day) {
            dataList.day = "00:00:00";
          }
          if (secondNumber != 0) {
            dataList.week = moment
              .utc((seconds / secondNumber) * 1000)
              .format("HH:mm:ss"); //수정해야됨
          } else if (type.indexOf("week") != -1) {
            dataList.week = "00:00:00";
          }
          if (monthSecondNumber != 0) {
            dataList.month = moment
              .utc((monthSeconds / monthSecondNumber) * 1000)
              .format("HH:mm:ss"); //수정해야됨
          } else if (type.indexOf("month") != -1) {
            dataList.month = "00:00:00";
          }
          console.log("day", dataList.day);
          console.log("week", dataList.week);
          console.log("month", dataList.month);
          return super.Response(
            res,
            200,
            "평균 수면시간을 성공적으로 가져왔습니다",
            {
              data: dataList,
            }
          );
        }
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
