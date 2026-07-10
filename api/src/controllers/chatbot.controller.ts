import { AuthRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { ChatBot } from "../models/chatbot.model";

export async function deleteAllChats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        await ChatBot.deleteMany({ user_id: userId });
        res.status(200).json({ message: "all chats whit bot deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChat(req: Request, res: Response) {
    try {
        const id = req.params._id;
        await ChatBot.deleteOne({ _id: id });
        res.status(200).json({ message: "chat with bot deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}