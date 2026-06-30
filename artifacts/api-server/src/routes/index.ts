import { Router, type IRouter } from "express";
import healthRouter from "./health";
import commissionRouter from "./commission";
import referralRouter from "./referral";

const router: IRouter = Router();

router.use(healthRouter);
router.use(commissionRouter);
router.use(referralRouter);

export default router;
