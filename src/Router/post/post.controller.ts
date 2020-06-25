import { Request, Response, NextFunction } from "express";
import Controller from "../../lib/controller";

class AuthController extends Controller {
  constructor() {
    super();
  }
  public Create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Create");
      return super.Response(res, 200, "테스트");
    } catch (e) {
      return next(e);
    }
  }
  public Delete(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Delete");
      return super.Response(res, 200, "테스트");
    } catch (e) {
      return next(e);
    }
  }
}

export default new AuthController();
