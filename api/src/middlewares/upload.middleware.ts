import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

function imageFilter(_: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    const allowedFileTypes = [
        'image/jpg', 
        'image/webp', 
        'image/avif', 
        'image/avci', 
        'image/jpeg', 
        'image/png', 
        'image/gif'
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error(`Invalid file type: ${file.mimetype}. Only images are allowed`));
    }
}

export const uploadImageConfig = multer({ storage, fileFilter: imageFilter });
export const uploadImage = uploadImageConfig.single("image");

export const uploadMediaConfig = multer({ storage });
export const uploadMedia = uploadMediaConfig.array("media");