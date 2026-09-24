export interface ApiResponse<T = unknown> {
    message?: string;
    data?: T;
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiError";
    }
}

async function handleResponse<T>(response: Response) {
    let result: ApiResponse<T>;

    try {
        result = await response.json();
    } catch (error) {
        throw new ApiError(response.ok ? "Failed to give response" : "internal server error");
    }

    return result;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit) {
    const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}${endpoint}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...options.headers }
    });
    
    return handleResponse<T>(response);
}

export async function apiUpload<T>(endpoint: string, formData: FormData, methodUsed: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}${endpoint}`, {
        body: formData,
        credentials: "include",
        method: methodUsed
    });

    return handleResponse<T>(response);
}