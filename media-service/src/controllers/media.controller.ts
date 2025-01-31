import { Request, Response } from "express";
import Media from "../models/media.model";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import logger from "../utils/logger";


interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadMedia = async (req: MulterRequest, res: Response): Promise<void> => {
  logger.info("Starting media upload");

  try {
    if (!req.file) {
      logger.error("No file found. Please add a file to upload");
      res.status(400).json({ success: false, message: "No file found. Please add a file to upload" });
      return;
    }

    const { originalname, mimetype } = req.file;

    logger.info(`File details: name=${originalname}, type=${mimetype}`);
    logger.info("Uploading to Cloudinary...");

    const cloudinaryUploadResult : any = await uploadMediaToCloudinary(req.file);
    logger.info(`Cloudinary upload successful. Public ID: ${cloudinaryUploadResult.public_id}`);

    const newMedia = new Media({
      originalName: originalname,
      mimeType: mimetype,
      publicId: cloudinaryUploadResult.public_id,
      url: cloudinaryUploadResult.secure_url,
    });

    await newMedia.save();

    res.status(201).json({
      success: true,
      mediaId: newMedia._id,
      url: newMedia.url,
      message: "Media uploaded successfully",
    });

  } catch (error) {
    logger.error("Media upload error occurred", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const getAllMedias = async (req: Request, res: Response): Promise<void> => {
  try {
    const medias = await Media.find({});
    res.status(200).json({
      success: true,
      data: medias,
    });
  } catch (error) {
    logger.error("Error getting media", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};
