import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        user_id: string;
        username: string;
    }
}

export interface CustomJwtPayload extends JwtPayload {
    user_id: string;
    username: string;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "token is required" });
    
    jwt.verify(token, process.env.JWT_KEY || "my_secret_key", (error: any, decode: any) => {
        if (error) return res.status(403).json({ message: "invalid token" });

        const payload = decode as CustomJwtPayload;
        req.user = {
            user_id: payload.user_id,
            username: payload.username
        }

        next();
    });
}