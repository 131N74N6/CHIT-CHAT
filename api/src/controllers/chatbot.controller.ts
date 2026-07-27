import { AuthRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { ChatBot } from "../models/chatbot.model";
import { aiService } from "../services/ai.service";

export async function askAi(req: AuthRequest, res: Response) {
    try {
        const createdAt = new Date().toISOString();
        const userId = req.user?.user_id;
        const { question } = req.body;

        if (!question) return res.status(400).json({ message: "please insert your question" });
        
        const newQuestion = new ChatBot({
            created_at: createdAt,
            question: question,
            role: "user/human",
            user_id: userId
        });
        
        await newQuestion.save();
        
        const botAnswer = await aiService(question);
        const newBotResponse = new ChatBot({
            created_at: createdAt,
            answer: botAnswer.result,
            role: "ai/bot",
            question_id: newQuestion._id,
            user_id: userId
        });

        await newBotResponse.save();

        res.status(200).json({ message: "question has been sent" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        await ChatBot.deleteMany({ user_id: userId });
        res.status(200).json({ message: "all chats whit bot deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChosenChats(req: Request, res: Response) {
    try {
        const ids: string[] = req.body.selectedIds;
        await ChatBot.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "chat with bot deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showAllResults(req: AuthRequest, res: Response) {
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

export async function showDetailResult(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const result = await ChatBot.findOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}