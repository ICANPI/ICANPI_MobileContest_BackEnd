import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";
import Sleep from "./sleep/sleep.router";
import Achievements from "./achievements/achievements.router";
router.use("/auth", Auth);
router.use("/sleep", Sleep);
router.use("/achievements", Achievements);
export default router;
