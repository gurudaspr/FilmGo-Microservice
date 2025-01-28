
import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify'; // Ensure you install this package: npm install slugify

export interface IMovie extends Document {
  title: string;
  description: string;
  genres: string[];
  languages: string[];
  releaseDate: Date;
  duration: number;
  cast: { name: string; role: string }[];
  director: string;
  mediaId?: string;
  trailerUrl: string;
  slug?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    slug: { type: String, unique: true, },
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: [String], required: true },
    languages: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    cast: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
      },
    ],
    director: { type: String, required: true },
    mediaId: { type: String },
    trailerUrl: { type: String, required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
movieSchema.pre<IMovie>('save', async function (next) {
  if (this.isModified('title')) {
      const MAX_SLUG_ATTEMPTS = 100;
      let baseSlug = slugify(this.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;  
      while (counter < MAX_SLUG_ATTEMPTS) {
          const existingMovie = await Movie.findOne({
              slug: slug,
              _id: { $ne: this._id }
          });
          
          if (!existingMovie) {
              this.slug = slug;
              return next();
          }
          
          slug = `${baseSlug}-${counter}`;
          counter++;
      }
      
      throw new Error(`Could not generate unique slug after ${MAX_SLUG_ATTEMPTS} attempts`);
  }
  next();
});


export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
