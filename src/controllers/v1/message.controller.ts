import { Request, Response } from "express";

import response from "@/utilities/response";
import MessageService from "@/services/v1/message.service";

class MessageController {
    async sendMessage(req: Request, res: Response) {
        const result = await MessageService.sendMessage(req);
        res.status(200).send(response("Message delivered", result));
    }

    async openMessage(req: Request, res: Response) {
        const result = await MessageService.openMessage(req);
        res.status(200).send(response("Message details fetched", result));
    }

    async userMessages(req: Request, res: Response) {
        const result = await MessageService.getUserMessages(req);
        res.status(200).send(response("Messages fetched", result));
    }
}

export default new MessageController();
