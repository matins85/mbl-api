import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

// Define the IMessage interface
export interface IMessage extends Document {
    subject: string;
    content: string;
    sender: Types.ObjectId | IUser;
    recipient: Types.ObjectId | IUser;
    isRead: boolean;
    created_at?: Date;
    updated_at?: Date;
}

// Define the IMessage schema
export const messageSchema: Schema<IMessage> = new Schema(
    {
        subject: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export default mongoose.model<IMessage>("Message", messageSchema);
