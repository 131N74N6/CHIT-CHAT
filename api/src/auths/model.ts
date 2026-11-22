import { ObjectId } from "mongodb";
import { authServiceApi } from "./service";

export type Session = typeof authServiceApi.$Infer.Session;
export type User = typeof authServiceApi.$Infer.Session.user;
export type AuthServiceApi = typeof authServiceApi;

export type TCustomUser = {
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image: string;
    address: string;
    description: string;
    gender: string;
    group_ids: ObjectId[];
    image_public_id: string;
    image_filename: string;
    image_filetype: string;
    image_resource_type: string;
}