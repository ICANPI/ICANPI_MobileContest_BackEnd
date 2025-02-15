import { Router } from "express";

const router = Router();

import PostController from "./post.controller";
import Passport from "../../lib/passport";

router.post("/create", Passport.authenticate(), PostController.Create);
router.post("/get", Passport.authenticate(), PostController.Get);

export default router;
