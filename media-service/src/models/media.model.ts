import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  originalName: string; 
  mimeType: string;    
  publicId: string;     
  url: string;          
  createdAt: Date;      
}

const MediaSchema = new Schema<IMedia>(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMedia>("Media", MediaSchema);
