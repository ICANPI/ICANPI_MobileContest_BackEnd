import { Router } from "express";

const router = Router();

import AuthController from "./auth.controller";
import Passport from "../../lib/passport";
router.post("/test", Passport.authenticate(), AuthController.Test);
router.post("/signin", AuthController.SignIn);
router.post("/signup", AuthController.SignUp);
router.get("/",AuthController.Auth);

export default router;
