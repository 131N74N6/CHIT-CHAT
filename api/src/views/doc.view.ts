import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Docs } from "../models/doc.model";

export async function getAllDocumentations(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.user_id;
        const limit = parseInt(req.query.limit as string) || 13;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const documentations = await Docs.find({ user_id }).limit(limit).skip(skip);
        res.status(200).json(documentations);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getDocumentation(req: Request, res: Response) {
    try {
        const documentation = await Docs.findOne({ _id: req.params._id });
        res.status(200).json(documentation);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}