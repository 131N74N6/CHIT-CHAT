import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadMedia = upload.array("media");