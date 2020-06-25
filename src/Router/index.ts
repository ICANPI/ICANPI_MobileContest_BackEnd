import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";

router.use("/auth", Auth);

export default router;
