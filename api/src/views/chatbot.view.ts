import { AuthRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { ChatBot } from "../models/chatbot.model";

export async function getAllResults(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const results = await ChatBot.find({ user_id: userId }).limit(limit).skip(skip);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getResult(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const result = await ChatBot.findOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}