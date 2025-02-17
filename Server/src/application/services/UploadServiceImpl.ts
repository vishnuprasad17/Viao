import { injectable } from "inversify";
import { UploadService } from "../../domain/interfaces/application interfaces/UploadService";
import crypto from "crypto";
import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BaseError } from "../../domain/errors/BaseError";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

const randomImg = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

@injectable()
export class UploadServiceImpl implements UploadService {
  async upload(
    files:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | Express.Multer.File,
    context: "vendor" | "user"
  ): Promise<
    | {
        coverpicFile: string;
        coverpicUrl: string;
        logoFile: string;
        logoUrl: string;
      }
    | string
  > {
    try {
      if (context === "vendor") {
        // Vendor-specific logic
        let coverpicFile,
          coverpicUrl = "";
        let logoFile,
          logoUrl = "";

        if (
          typeof files === "object" &&
          "coverpic" in files &&
          Array.isArray(files["coverpic"])
        ) {
          coverpicFile = files["coverpic"][0];
          const coverpicUploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: coverpicFile?.originalname,
            Body: coverpicFile?.buffer,
            ContentType: coverpicFile?.mimetype,
          };

          const covercommand = new PutObjectCommand(coverpicUploadParams);
          await s3.send(covercommand);

          coverpicUrl = `${process.env.IMAGE_URL}/${coverpicFile?.originalname}`;
        }

        if (
          typeof files === "object" &&
          "logo" in files &&
          Array.isArray(files["logo"])
        ) {
          logoFile = files["logo"][0];
          const logoUploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: logoFile?.originalname,
            Body: logoFile?.buffer,
            ContentType: logoFile?.mimetype,
          };

          const logocommand = new PutObjectCommand(logoUploadParams);
          await s3.send(logocommand);

          logoUrl = `${process.env.IMAGE_URL}/${logoFile?.originalname}`;
        }

        if (!coverpicFile || !logoFile) {
          throw new BaseError("Coverpic and logo file are required", 400);
        }

        return {
          coverpicFile: coverpicFile.originalname,
          coverpicUrl: coverpicUrl,
          logoFile: logoFile.originalname,
          logoUrl: logoUrl,
        };
      } else if (context === "user") {
        // User-specific logic
        const file = files as Express.Multer.File;
        const buffer = await sharp(file.buffer)
          .resize({ height: 1200, width: 1200, fit: "contain" })
          .toBuffer();

        const imgName = `${randomImg()}.jpg`;

        const params = {
          Bucket: process.env.BUCKET_NAME!,
          Key: imgName,
          Body: buffer,
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        const imgUrl = `${process.env.IMAGE_URL}/${imgName}`;
        return imgUrl;
      } else {
        throw new BaseError("Invalid context provided", 400);
      }
    } catch (error) {
      console.error("Error uploading file(s):", error);
      throw new BaseError("Error uploading file(s)! Try again later.", 500);
    }
  }

  async uploadType(file: Express.Multer.File): Promise<{ image: string, imageUrl: string}> {
    const image = randomImg();
        
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: image,
      Body: file.buffer,
      ContentType: file?.mimetype,
    };
        
    const command = new PutObjectCommand(params);
    await s3.send(command);
        
    const imageUrl=`${process.env.IMAGE_URL}/${image}`;
    
    return { image, imageUrl };
  }

  async uploadPost(file: Express.Multer.File): Promise<{ image: string, imageUrl: string }> {
    const buffer = await sharp(file.buffer)
        .resize({ height: 1920, width: 1080, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .toBuffer();
    
    const image = randomImg();
  
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: image,
      Body: buffer,
      ContentType: file.mimetype,
    };
  
    const command = new PutObjectCommand(params);
    await s3.send(command);
  
    const imageUrl=`${process.env.IMAGE_URL}/${image}`;

    return { image, imageUrl};
  }

  async deletePost(imageName: string): Promise<boolean> {
    const params={
      Bucket: process.env.BUCKET_NAME!,
      Key: imageName,
    }
    
    const command=new DeleteObjectCommand(params);
    await s3.send(command);
    
    return true;
  }
}