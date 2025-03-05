import Joi from "joi";
import bcryptjs from "bcryptjs";
import { Request } from "express";
import { CONFIGS } from "@/configs";

import UserModel from "@/models/user.model";
import CustomError from "@/utilities/custom-error";
import TokenService from "@/services/token.service";

class AuthService {
    async register({ body }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                first_name: Joi.string().trim().required().label("first name"),
                last_name: Joi.string().trim().required().label("last name"),
                email: Joi.string().trim().email().lowercase().required().label("email"),
                password: Joi.string().required().label("password"),
                image: Joi.string().required().label("image"),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ body });
        if (error) throw new CustomError(error.message, 400);

        const emailExist = await UserModel.findOne({ email: data.body.email });
        if (emailExist) throw new CustomError("email already exists", 400);

        const passwordHash = await bcryptjs.hash(data.body.password, CONFIGS.BCRYPT_SALT);

        const context = {
            first_name: data.body.first_name,
            last_name: data.body.last_name,
            email: data.body.email,
            password: passwordHash,
            image: data.body.image,

            // for this app, set user verified as default
            email_verified: true,
        };

        // Create new user
        const user = await new UserModel(context).save();

        // Generate token
        const token = await TokenService.generateAuthTokens({ _id: user._id });

        // Remove password from response
        user.password = undefined;

        return { user, token };
    }

    async login({ body }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                email: Joi.string().trim().email().lowercase().required().label("email"),
                password: Joi.string().required().label("password"),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ body });
        if (error) throw new CustomError(error.message, 400);

        // Check if email exists
        const user = await UserModel.findOne({ email: data.body.email }).select("+password");
        if (!user) throw new CustomError("incorrect email or password", 400);

        // Check if password is correct
        const validPassword = await bcryptjs.compare(data.body.password, user.password || "");
        if (!validPassword) throw new CustomError("incorrect email or password", 400);

        // check if account is disabled
        if (user.account_disabled === true) throw new CustomError("account has been disabled, if you believe this is a mistake kindly contact support", 409);

        // Generate token
        const token = await TokenService.generateAuthTokens({ _id: user._id });

        // Remove password from response
        user.password = undefined;

        return { user, token };
    }
}

export default new AuthService();
