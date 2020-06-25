import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt-nodejs";
import Controller from "../../lib/controller";
import RegExp from "../../lib/regExp";
import User from "../../model/user";

class AuthController extends Controller {
  constructor() {
    super();
  }
  public Auth(req, res, next) {
    try {
      return res.send({
        title: "단잠",
        contest: "선린인터넷고등학교 모바일 콘텐츠 경진 대회",
      });
    } catch (e) {
      next(e);
    }
  }
  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: 로그인을 합니다.
   *     tags:
   *	     - Auth
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestSignin"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseSignin"
   */
  public async SignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, password } = req.body;

      if (super.CheckBlank(id, password)) {
        return super.Response(res, 400, "빈칸을 모두 입력해 주세요.");
      }
      if (RegExp.SignIn(id, password)) {
        return super.Response(res, 400, "올바른 형식이 아닙니다.");
      }

      User.findOne({ id: id }, (err, result) => {
        if (err) throw err;
        if (result != null) {
          bcrypt.compare(password, result.password, async (err, value) => {
            if (value == true) {
              const token = await User.getToken(result);
              console.log(token);
              ++result.loginCount;
              await result.save();
              return super.Response(res, 200, "로그인에 성공했습니다", {
                token: token,
              });
            } else {
              return super.Response(res, 400, "비밀번호가 일치하지않습니다");
            }
          });
        } else {
          return super.Response(res, 400, "아이디가 존재하지 않습니다");
        }
      });
    } catch (e) {
      return next(e);
    }
  }
  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: 회원가입을 합니다.
   *     tags:
   *	     - Auth
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestSignup"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseSignup"
   */
  public async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, password, email, username } = req.body;
      if (super.CheckBlank(id, password, email, username)) {
        return super.Response(res, 400, "빈칸을 모두 입력해 주세요.");
      }
      if (RegExp.SignUp(id, password, username, email)) {
        return super.Response(res, 400, "올바른 형식이 아닙니다.");
      }
      let result = await User.create({
        id: id,
        password: password,
        email: email,
        username: username,
      });
      console.log(result.success, result.mes);
      if (result.success) {
        return super.Response(res, 200, "회원가입 성공", { mes: result.mes });
      } else {
        return super.Response(res, 400, "회원가입 실패", { mes: result.mes });
      }
    } catch (e) {
      return next(e);
    }
  }
  public Test(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("test");
      return super.Response(res, 200, "테스트");
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
