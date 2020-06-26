import { Router } from "express";

const router = Router();

import SleepController from "./sleep.controller";
import Passport from "../../lib/passport";

router.put("/update", Passport.authenticate(), SleepController.UpdateSleepTime);

export default router;
