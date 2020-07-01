import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt-nodejs";
import Controller from "../../lib/controller";
import RegExp from "../../lib/regExp";
import User from "../../model/user";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
class TimeController extends Controller {
  constructor() {
    super();
  }
  /**
   * @swagger
   * /time/add:
   *   post:
   *     summary: 시간을 더합니다
   *     tags:
   *	     - Time
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestAddTime"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseAddTime"
   */
  public async AddTime(req: Request, res: Response, next: NextFunction) {
    try {
      const { time1, time2 } = req.body;

      //10:02:03
      let times1 = moment("2020-01-01 " + time1);
      let times2 = moment("2020-01-01 " + time2);
      console.log(times1.format("YYYY-MM-DD"));

      times1.add(times2.hours(), "hours");
      console.log(times1);
      times1.add(times2.minutes(), "minutes");
      times1.add(times2.seconds(), "seconds");

      return super.Response(res, 200, "게시물을 성공적으로 계산 하였습니다.", {
        time: times1.format("HH:mm:ss"),
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default new TimeController();
