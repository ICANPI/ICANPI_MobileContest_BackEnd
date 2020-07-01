import { Router } from "express";
import AuthController from "./auth.controller";
import Passport from "../../lib/passport";

const router = Router();

router.post("/test", Passport.authenticate(), AuthController.Test);
router.post("/signin", AuthController.SignIn);
router.post("/signup", AuthController.SignUp);
router.post("/info", Passport.authenticate(), AuthController.Info);
router.post("/refresh", Passport.authenticate(), AuthController.Refresh);
router.put("/update_info", Passport.authenticate(), AuthController.UpdateInfo);

router.get("/", AuthController.Auth);

export default router;
