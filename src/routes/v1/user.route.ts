import { CONFIGS } from "@/configs";
import userController from "@/controllers/v1/user.controller";
import authGuard from "@/middlewares/auth.middleware";
import { Router } from "express";

const router: Router = Router();

router.get("/current-user", authGuard(CONFIGS.APP_ROLES.USER), userController.getCurrentUser);

router.get("/get-all-users", userController.getAllUsers);

export default router;
