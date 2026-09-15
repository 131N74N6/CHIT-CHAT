export interface CloudinaryUploadResult {
    file_name: string;
    file_type: string;
    public_id: string;
    resource_type: string;
    size: number;
    url: string;
}

export interface CloudinaryUploadOption {
    file_buffer: Buffer;
    foldername: string;
    mimetype: string;
    original_name: string;
    size: number;
}