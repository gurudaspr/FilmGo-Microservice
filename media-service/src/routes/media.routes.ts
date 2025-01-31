import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import logger from "../utils/logger";
import { getAllMedias, uploadMedia } from "../controllers/media.controller";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("file");

// Middleware for handling file uploads
router.post("/upload", (req :Request, res :Response, next :NextFunction) => {
  upload(req, res, (err: any) => {
    if (err) {
      logger.error("Multer Error uploading file:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed due to Multer error",
        error: err.message,
      });
    }

    if (!req.file) {
      logger.warn("No file found in request");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded. Please provide a file." });
    }

    next();
  });
}, uploadMedia);

// Fetch media list
router.get("/get-media", getAllMedias);

export default router;
