import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt-nodejs";
import Controller from "../../lib/controller";
import RegExp from "../../lib/regExp";
import User from "../../model/user";
import * as jwt from "jsonwebtoken";
import Token from "../../model/token";
import Achievements from "../../model/achievements";
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
              const accessToken = await Token.create(
                result.email,
                "accessToken"
              );
              const refreshToken = await Token.create(
                result.email,
                "refreshToken"
              );
              ++result.loginCount;
              await result.save();
              return super.Response(res, 200, "로그인에 성공했습니다", {
                accessToken: accessToken.token,
                refreshToken: refreshToken.token,
                success: true,
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
      if (result.success) {
        await Achievements.create(email);

        return super.Response(res, 200, "회원가입 성공", {
          mes: result.mes,
          success: true,
        });
      } else {
        return super.Response(res, 400, "회원가입 실패", { mes: result.mes });
      }
    } catch (e) {
      return next(e);
    }
  }
  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: access 토큰 갱신
   *     tags:
   *	     - Auth
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
   *           $ref: "#/definitions/ResponseRefresh"
   */
  public async Refresh(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers["authorization"].split("Bearer ")[1];
      let decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
      //취소를 체크해야됨
      Token.findOne({ token: token }, async (err, result) => {
        if (err) throw err;
        if (result != null) {
          let accessToken = await Token.create(decoded.email, "accessToken");
          if (result.revoked == false) {
            return super.Response(res, 200, "리프레쉬 성공", {
              accessToken: accessToken.token,
            });
          } else {
            return super.Response(res, 400, "해당 토큰이 강제로 거부했습니다.");
          }
        } else {
          return super.Response(res, 400, "관련된 토큰이 없습니다.");
        }
      });
    } catch (e) {
      return next(e);
    }
  }
  /**
   * @swagger
   * /auth/info:
   *   post:
   *     summary: 사용자의 정보를 가져옵니다.
   *     tags:
   *	     - Auth
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestInfo"
   *       - in: header
   *         name: Authorization
   *         type: string
   *         schema:
   *           $ref: "#/definitions/Token"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseInfo"
   */
  public async Info(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      let decoded: any = jwt.verify(
        req.headers["authorization"].split("Bearer ")[1],
        process.env.JWT_SECRET_KEY
      );
      User.findOne({ email: decoded.email }, (err, result) => {
        if (err) throw err;
        if (result != null) {
          let typeList: any = [];
          type.indexOf("id") != -1 ? typeList.push({ id: result.id }) : "";
          type.indexOf("password") != -1
            ? typeList.push({ password: "**********" })
            : "";
          type.indexOf("email") != -1
            ? typeList.push({ email: result.email })
            : "";
          type.indexOf("username") != -1
            ? typeList.push({ username: result.username })
            : "";
          let responseTypeObject: any = {};
          typeList.forEach((element) => {
            if (Object.keys(element)[0] == "id") {
              responseTypeObject.id = element.id;
            } else if (Object.keys(element)[0] == "password") {
              responseTypeObject.password = element.password;
            } else if (Object.keys(element)[0] == "email") {
              responseTypeObject.email = element.email;
            } else if (Object.keys(element)[0] == "username") {
              responseTypeObject.username = element.username;
            }
          });
          return super.Response(
            res,
            200,
            "유저 정보를 성공적으로 가져왔습니다",
            {
              data: responseTypeObject,
              success: true,
            }
          );
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
   * /auth/update_info:
   *   put:
   *     summary: 사용자의 정보를 수정합니다. (수정은 하나의 속성밖에 할 수 없습니다.)
   *     tags:
   *	     - Auth
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestUpdateInfo"
   *       - in: header
   *         name: Authorization
   *         type: string
   *         schema:
   *           $ref: "#/definitions/Token"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponseUpdateInfo"
   */
  public async UpdateInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, text } = req.body;
      let decoded: any = jwt.verify(
        req.headers["authorization"].split("Bearer ")[1],
        process.env.JWT_SECRET_KEY
      );
      User.findOne({ email: decoded.email }, async (err, result) => {
        if (err) throw err;
        if (result != null) {
          if (super.CheckBlank(type, text)) {
            return super.Response(res, 400, "빈칸을 모두 입력해 주세요.");
          }
          if (result.id == text) {
            return super.Response(res, 400, "아이디를 다르게 작성해주세요.");
          }

          if (type == "id") {
            if (RegExp.Id(text)) {
              return super.Response(res, 400, "올바른 형식이 아닙니다.");
            }
            if (await User.findOne({ id: text })) {
              return super.Response(res, 400, "이미 존재하는 아이디 입니다.");
            }
            result.id = text;
            await result.save();
            return super.Response(res, 200, "성공적으로 업데이트 했습니다", {
              success: true,
            });
          } else if (type == "password") {
            if (RegExp.Pwd(text)) {
              return super.Response(res, 400, "올바른 형식이 아닙니다.");
            }
            bcrypt.compare(text, result.password, (err, value) => {
              if (value == true) {
                return super.Response(
                  res,
                  400,
                  "비밀번호를 다르게 작성해주세요."
                );
              } else {
                bcrypt.hash(text, null, null, (err, hash) => {
                  result.password = hash;
                  result.save();
                  return super.Response(
                    res,
                    200,
                    "성공적으로 업데이트 했습니다",
                    {
                      success: true,
                    }
                  );
                });
              }
            });
          } else if (type == "username") {
            if (RegExp.Username(text)) {
              return super.Response(res, 400, "올바른 형식이 아닙니다.");
            }
            if (result.username == text) {
              return super.Response(
                res,
                400,
                "유지닉네임을 다르게 작성해주세요."
              );
            }
            result.username = text;
            result.save();
            return super.Response(res, 200, "성공적으로 업데이트 했습니다", {
              success: true,
            });
          }
        } else {
          return super.Response(res, 400, "아이디가 존재하지 않습니다");
        }
      });
    } catch (e) {
      return next(e);
    }
  }
  public Test(req: Request, res: Response, next: NextFunction) {
    try {
      return super.Response(res, 200, "테스트");
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
