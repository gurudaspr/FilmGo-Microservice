
import mongoose, { Schema, Document, Types } from "mongoose";

interface ISearch extends Document {
   _id: Types.ObjectId;
  type: "movie" | "theater";
  name: string;
  genres?: string[];
  rating?: number;
  popularity: number;
  releaseDate?: Date;
  location?: { type: "Point"; coordinates: [number, number] };
  locationName?: string;
  movieId?: string;
  theaterId?: string;
}

const SearchSchema = new Schema<ISearch>(
  {
    type: { type: String, enum: ["movie", "theater"], required: true },
    name: { type: String, required: true },
    genres: { type: [String], default: undefined },
    popularity: { type: Number, default: 0 },
    releaseDate: { type: Date },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    locationName: { type: String, default: "" },
    movieId: { type: String },
    theaterId: { type: String },
  },
  { timestamps: true }
);

SearchSchema.index({ name: "text", genres: "text", locationName: "text" });

export const Search = mongoose.model<ISearch>("Search", SearchSchema);
