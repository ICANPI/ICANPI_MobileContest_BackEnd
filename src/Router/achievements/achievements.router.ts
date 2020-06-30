import { Router } from "express";

const router = Router();

import achievementsController from "./achievements.controller";
import Passport from "../../lib/passport";
router.post("/get", Passport.authenticate(), achievementsController.Get);

export default router;
