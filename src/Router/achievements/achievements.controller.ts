import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt-nodejs";
import Controller from "../../lib/controller";
import RegExp from "../../lib/regExp";
import User from "../../model/user";
import * as jwt from "jsonwebtoken";
import Token from "../../model/token";
import Achievements from "../../model/achievements";
class AchievementsController extends Controller {
  constructor() {
    super();
  }
  /**
   * @swagger
   * /achievements/get:
   *   post:
   *     summary: 업적을 가져옵니다.
   *     tags:
   *	     - Achievements
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         type: string
   *         schema:
   *           $ref: "#/definitions/Token"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseGetAchievements"
   */
  public async Get(req: Request, res: Response, next: NextFunction) {
    try {
      let decoded: any = jwt.verify(
        req.headers["authorization"].split("Bearer ")[1],
        process.env.JWT_SECRET_KEY
      );

      let result = await Achievements.get(decoded.email);

      return super.Response(res, 200, "업적을 성공적으로 가져왔습니다.", {
        success: true,
        result: result.result,
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default new AchievementsController();
