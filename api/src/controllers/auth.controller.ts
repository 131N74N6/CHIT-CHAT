import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

export async function signIn(req: Request, res: Response) {
    try {
        const { password, username } = req.body;

        if (!username && !password) return res.status(400).json({ message: "all fields are required" });
        if (!password) return res.status(400).json({ message: "please provide password" });
        if (!username) return res.status(400).json({ message: "please provide username" });

        const userExist = await User.findOne({ username });
        if (!userExist) return res.status(404).json({ message: "user not found" });

        const isPasswordMatch = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatch) return res.status(404).json({ message: "invalid password" });

        const token = jwt.sign(
            { user_id: userExist._id, username: userExist.username }, 
            process.env.JWT_KEY || 'my_secret_key',
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ user_id: userExist._id, username: userExist.username });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function signOut (_: Request, res: Response) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ message: "user logged out!" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function signUp (req: Request, res: Response) {
    try {
        const { email, password, username } = req.body;
        const created_at = new Date().toISOString();

        if (!username && !password) return res.status(400).json({ message: "all fields are required" });
        if (!password) return res.status(400).json({ message: "please provide password" });
        if (!username) return res.status(400).json({ message: "please provide email" });

        const usernameExist = await User.findOne({ username });
        if (usernameExist) return res.status(409).json({ message: "this username has been taken" });

        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(409).json({ message: "this email has been taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            address: null,
            created_at,
            email,
            gender: null,
            password: hashedPassword,
            profile_picture: null,
            username
        });

        await newUser.save();

        const token = jwt.sign(
            { user_id: newUser._id, username: newUser.username }, 
            process.env.JWT_KEY || 'my_secret_key',
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.status(200).json({ message: "new user added" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}