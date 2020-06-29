import { Router } from "express";

const router = Router();

import SleepController from "./sleep.controller";
import Passport from "../../lib/passport";

router.put("/update", Passport.authenticate(), SleepController.UpdateSleepTime);
router.post("/get", Passport.authenticate(), SleepController.GetSleepTime);

export default router;
