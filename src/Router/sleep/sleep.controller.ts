import { Request, Response, NextFunction } from "express";
import Controller from "../../lib/controller";

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
  public UpdateSleepTime(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("UpdateSleepTime",req.body.day);
      return super.Response(res, 200, "테스트");
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
