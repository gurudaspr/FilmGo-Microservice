import mongoose, { Schema, Document } from 'mongoose';

interface UserType extends Document {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    googleId?: string;
    appleId?: string;
    provider: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserType>({
    _id: { type: String, required: true},
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true },
    provider: { type: String, required: true },
    photoURL: { type: String },
}, { timestamps: true });

const User = mongoose.model<UserType>('User', userSchema);

export default User;
