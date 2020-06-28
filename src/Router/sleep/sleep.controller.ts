import { Request, Response, NextFunction } from "express";
import Controller from "../../lib/controller";
import User from "../../model/user";
import * as jwt from "jsonwebtoken";
import authController from "../auth/auth.controller";
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
        let timeArray = [];
        let bol = 0;

        if (result.sleep_time.length > 0) {
          console.log("원래있음");
          timeArray = result.sleep_time.map(function (e) {
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
                  milliseconds: sleepTime.seconds(),
                },
              };
            } else {
              console.log("다름");
              bol++;
              return e;
            }
          });
          if (bol == result.sleep_time.length) {
            console.log("중복 날짜가 없었음");
            timeArray.push({
              day: sleepTime.format("YYYY-MM-DD"),
              data: {
                year: sleepTime.year(),
                month: sleepTime.month() + 1,
                date: sleepTime.date(),
                hours: sleepTime.hours(),
                minutes: sleepTime.minutes(),
                milliseconds: sleepTime.seconds(),
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
              milliseconds: sleepTime.seconds(),
            },
          });
        }

        result.sleep_time = timeArray;
        result.save();
        return super.Response(res, 200, "성공적으로 업데이트 했습니다", {
          success: true,
        });
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
