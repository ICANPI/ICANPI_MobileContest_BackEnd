import { Request, Response, NextFunction } from "express";
import Controller from "../../lib/controller";
import Post from "../../model/post";
import * as jwt from "jsonwebtoken";
class AuthController extends Controller {
  constructor() {
    super();
  }
  /**
   * @swagger
   * /post/create:
   *   post:
   *     summary: 게시물을 생성합니다.
   *     tags:
   *	     - Post
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         type: object
   *         schema:
   *           $ref: "#/definitions/RequestPost"
   *       - in: header
   *         name: Authorization
   *         type: string
   *         schema:
   *           $ref: "#/definitions/Token"
   *     responses:
   *       200:
   *         schema:
   *           $ref: "#/definitions/ResponsePost"
   */
  public async Create(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, title } = req.body;
      if (super.CheckBlank(text)) {
        return super.Response(res, 400, "빈칸을 모두 입력해 주세요.");
      }
      let decoded: any = jwt.verify(
        req.headers["authorization"].split("Bearer ")[1],
        process.env.JWT_SECRET_KEY
      );
      let result = await Post.create({
        title: title,
        text: text,
        email: decoded.email,
      });

      if (result.success) {
        return super.Response(
          res,
          200,
          "게시물을 성공적으로 업로드 하였습니다."
        );
      }
    } catch (e) {
      return next(e);
    }
  }
  /**
   * @swagger
   * /post/get:
   *   post:
   *     summary: 게시물을 가져옵니다.
   *     tags:
   *	     - Post
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
   *           $ref: "#/definitions/ResponseGetPost"
   */
  public async Get(req: Request, res: Response, next: NextFunction) {
    try {
      let result = await Post.get();

      if (result.success) {
        return super.Response(
          res,
          200,
          "게시물을 성공적으로 업로드 하였습니다.",
          { list: result.data }
        );
      }
      return super.Response(res, 200, "테스트");
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
