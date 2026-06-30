import { Router, type IRouter } from "express";
import healthRouter from "./health";
import commissionRouter from "./commission";
import referralRouter from "./referral";
import discordRouter from "./discord";

const router: IRouter = Router();

router.use(healthRouter);
router.use(commissionRouter);
router.use(referralRouter);
router.use(discordRouter);

export default router;
