import { Request, Response, NextFunction } from "express";
import { publishEvent } from "../config/rabbitmq";
import logger from "../utils/logger";
import { movieAddValidation } from "../utils/validation";
import axios from "axios";
import FormData from "form-data";
import { config } from "../config";

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const addMovie = async (
  req: MulterRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    logger.info("Received add movie request");
    
    console.log("Request body:", req.body);
    logger.debug("File details:", req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');
    const { value, error } = movieAddValidation.validate(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    logger.info("Validated movie data successfully");

    let mediaId: string | null = null;

    if (req.file) {
      logger.info(`Uploading media via Media Service: ${req.file.originalname}`);

      const formData = new FormData();
      // Properly add the buffer to FormData with filename and content type
      formData.append("file", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      try {
        const mediaResponse = await axios.post(
          `${config.api_url}/v1/media/upload`,
          formData,
          {
            headers: {
              "Content-Type" : "multipart/form-data",
            },
          }
        );

        if (!mediaResponse.data || !mediaResponse.data.mediaId) {
          throw new Error('Invalid response from media service');
        }

        mediaId = mediaResponse.data.mediaId;
        logger.info(`Media uploaded successfully: ${mediaId}`);
      } catch (mediaError: any) {
        logger.error("Error uploading file to Media Service", {
          error: mediaError.message,
          response: mediaError.response?.data,
          status: mediaError.response?.status
        });
        
        res.status(500).json({
          success: false,
          message: "Failed to upload media",
          error: mediaError.response?.data?.message || mediaError.message
        });
        return;
      }
    }

    // Include media details in movie data
    const movieData = {
      ...value,
      mediaId: mediaId,
      timestamp: new Date().toISOString()
    };

    logger.info("Publishing movie data to queue", { 
      movieId: movieData.id,
      hasMedia: !!mediaId 
    });

    // Publish the validated data (with media) to the Movie Service
    await publishEvent("movie.add", movieData);

    logger.info("Movie data published successfully");

    res.status(200).json({
      success: true,
      message: "Movie data forwarded to the movie service successfully",
      data: {
        movieId: movieData.id,
        mediaId: mediaId
      }
    });
  } catch (error) {
    logger.error("Error in addMovie controller:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });

    res.status(500).json({
      success: false,
      message: "An error occurred while forwarding movie data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};