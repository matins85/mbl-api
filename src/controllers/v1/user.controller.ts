import { Request, Response } from "express";

import response from "@/utilities/response";
import UserService from "@/services/v1/user.service";

class UserController {
    async getCurrentUser(req: Request, res: Response) {
        const result = await UserService.getCurrentUser(req);
        res.status(200).send(response("user retrieved", result));
    }

    async getAllUsers(_req: Request, res: Response) {
        const result = await UserService.getAllUsers();
        res.status(200).send(response("users retrieved", result));
    }
}

export default new UserController();
