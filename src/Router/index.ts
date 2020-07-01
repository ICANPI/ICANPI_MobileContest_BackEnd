import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";
import Sleep from "./sleep/sleep.router";
import Achievements from "./achievements/achievements.router";
import Post from "./post/post.router";
import Time from "./time/time.router";
router.use("/auth", Auth);
router.use("/sleep", Sleep);
router.use("/achievements", Achievements);
router.use("/post", Post);
router.use("/time", Time);
export default router;
