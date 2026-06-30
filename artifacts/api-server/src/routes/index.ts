import { Router, type IRouter } from "express";
import healthRouter from "./health";
import commissionRouter from "./commission";
import referralRouter from "./referral";
import discordRouter from "./discord";
import reviewsRouter from "./reviews";
import promoRouter from "./promo";
import viewsRouter from "./views";

const router: IRouter = Router();

router.use(healthRouter);
router.use(commissionRouter);
router.use(referralRouter);
router.use(discordRouter);
router.use(reviewsRouter);
router.use(promoRouter);
router.use(viewsRouter);

export default router;
