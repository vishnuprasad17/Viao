

export interface UploadService {
    upload(files: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | Express.Multer.File, context: "vendor" | "user"): Promise<{coverpicFile: string,
        coverpicUrl: string,
        logoFile: string,
        logoUrl: string} |
        string>;
    uploadType(file: Express.Multer.File): Promise<{ image: string, imageUrl: string}>;
    uploadPost(file: Express.Multer.File): Promise<{ image: string, imageUrl: string }>;
    deletePost(imageName: string): Promise<boolean>;
}