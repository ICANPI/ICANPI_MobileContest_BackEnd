import { Router } from "express";
import Passport from "../../lib/passport";

import DayController from "./time.controller";

const router = Router();

router.post("/add", DayController.AddTime);

export default router;
