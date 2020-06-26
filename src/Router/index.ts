import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";
import Sleep from "./sleep/sleep.router";

router.use("/auth", Auth);
router.use("/sleep", Sleep);

export default router;
