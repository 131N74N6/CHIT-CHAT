import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createDocumentation } from "../services/ai.service";
import { Docs } from "../models/doc.model";

export async function makeDocumentation(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.user_id;
        const created_at = new Date().toISOString();
        const { codes, language } = req.body;

        if (!language && !codes) return res.status(400).json({ message: "all fields are required" });
        if (!codes) return res.status(400).json({ message: "please provide codes" });
        if (!language) return res.status(400).json({ message: "please provide language" });

        const result = await createDocumentation({ codes, language });
        const newCodeDocs = new Docs({
            created_at: created_at,
            codes: codes,
            language: language,
            result: result,
            user_id: user_id
        });

        await newCodeDocs.save();

        res.status(200).json({ message: "new documentation added" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllDocumentations(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.user_id;
        await Docs.deleteMany({ user_id });
        res.status(200).json({ message: "all documentations deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteDocumentation(req: Request, res: Response) {
    try {
        await Docs.deleteOne({ _id: req.params._id });
        res.status(200).json({ message: "documentation deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}