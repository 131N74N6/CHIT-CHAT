import { v2 } from "cloudinary";
import { Readable } from "stream";
import { CloudinaryUploadOption, CloudinaryUploadResult } from "./model";

export async function uploadToCloudinary(props: CloudinaryUploadOption): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const publicId = `${Date.now()}-${props.original_name}`;
        const uploadStream = v2.uploader.upload_stream({
            folder: props.foldername,
            public_id: publicId,
            resource_type: "auto",
            size: props.size
        }, (error, result) => {
            if (error) {
                reject("Failed to upload to cloudinary");
                return;
            }

            if (!result) {
                reject("no response returned from cloudinary");
                return;
            }

            resolve({
                file_name: props.original_name,
                file_type: props.mimetype,
                public_id: result.public_id,
                resource_type: result.resource_type,
                size: props.size,
                url: result.url
            });
        });

        const readableStream = new Readable();
        readableStream.push(props.file_buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
}