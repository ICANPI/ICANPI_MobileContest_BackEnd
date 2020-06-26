import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";
import Sleep from "./auth/auth.router";

router.use("/auth", Auth);
router.use("/sleep", Sleep);

export default router;
