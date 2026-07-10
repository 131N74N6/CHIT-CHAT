import { v2 } from "cloudinary";
import { Readable } from "stream";

export interface CloudinaryUploadResult {
    public_id: string;
    resource_type: string;
    url: string;
}

export interface CloudinaryUploadOption {
    file_buffer: Buffer;
    folder_name: string;
    original_name: string;
}

export async function uploadTOCloudinary(props: CloudinaryUploadOption): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const publicId = `${Date.now()}-${props.original_name}`;
        const uploadStream = v2.uploader.upload_stream({
            folder: props.folder_name,
            public_id: publicId,
            resource_type: "auto"
        }, (error, result) => {
            if (error) {
                reject(new Error(`Failed to upload to cloudinary: ${error.message}`));
                return;
            }
            if (!result) {
                reject(new Error("No response returned from cloudinary"));
                return;
            }
            resolve({
                public_id: result?.public_id,
                resource_type: result?.resource_type,
                url: result?.url
            });
        });

        const readableStream = new Readable();
        readableStream.push(props.file_buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream)
    });
}