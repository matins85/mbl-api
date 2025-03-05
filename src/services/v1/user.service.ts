import Joi from "joi";
import { Request } from "express";

import UserModel from "@/models/user.model";
import CustomError from "@/utilities/custom-error";
import MessageModel from "@/models/message.model";

class UserService {
    async getCurrentUser({ $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            $currentUser: Joi.object({
                _id: Joi.required(),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ $currentUser });
        if (error) throw new CustomError(error.message, 400);

        // Check if user exists
        const user = await UserModel.findOne({ _id: data.$currentUser._id });
        if (!user) throw new CustomError("user not found", 404);

        // get user messages count
        const messagesCount = await MessageModel.countDocuments({ recipient: user._id });

        // get  unread Messages Count

        const unReadCount = await MessageModel.countDocuments({ recipient: user._id, isRead: false });

        return {
            user,
            messagesCount,
            unReadCount,
        };
    }

    async getAllUsers() {
        return await UserModel.find();
    }
}

export default new UserService();
