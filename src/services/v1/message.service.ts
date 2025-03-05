import Joi from "joi";
import { Request } from "express";

import CustomError from "@/utilities/custom-error";
import MessageModel from "@/models/message.model";
import UserModel from "@/models/user.model";

class UserService {
    // create  conversation
    async sendMessage({ body, $currentUser }: Partial<Request>) {
        // Validate data
        const { error, value: data } = Joi.object({
            body: Joi.object({
                subject: Joi.string().trim().required().label("Subject"),
                content: Joi.string().trim().required().label("Content"),
                recipient: Joi.string().trim().required().label("Recipient"),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        // Check if user exists
        const user = await UserModel.findOne({ _id: data.$currentUser._id });
        if (!user) throw new CustomError("user not found", 404);

        // validate recipient
        const recipient = await UserModel.findOne({ _id: data.body.recipient });
        if (!recipient) throw new CustomError("recipient not found", 404);

        // prevent sender from being recipient
        if ((user._id as string).toString() === (recipient._id as string).toString()) throw new CustomError("Sorry, you can't send to self", 404);

        const payload = {
            subject: data.body.subject,
            content: data.body.content,
            recipient: data.body.recipient,
            sender: data.$currentUser._id,
            isRead: false,
        };

        // Create a new conversation
        const message = await new MessageModel(payload).save();

        return message;
    }

    // get user messages

    async openMessage({ $currentUser, params }: Partial<Request>) {
        // Validate data
        const { error, value: data } = Joi.object({
            params: Joi.object({
                messageId: Joi.string().trim().required().label("Message Id"),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ params, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        // Check if user exists
        const user = await UserModel.findOne({ _id: data.$currentUser._id });
        if (!user) throw new CustomError("user not found", 404);

        // Query for message by id and update isRead to true
        const message = await MessageModel.findOneAndUpdate({ _id: data.params.messageId, recipient: user._id }, { isRead: true }, { new: true });
        if (!message) throw new CustomError("Message not found or you are not the recipient", 404);

        return message;
    }

    // get user message

    async getUserMessages({ $currentUser }: Partial<Request>) {
        // Validate data
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

        // query for message by id and return result

        const messages = await MessageModel.find({ recipient: user._id }).populate("sender", "first_name last_name image");
        return {
            messages,
            messagesCount,
            unReadCount,
        };
    }
}

export default new UserService();
