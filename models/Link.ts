import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILink extends Document {
  shortCode: string;
  destinationUrl: string;
  title?: string;
  description?: string;
  qrCodeData?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
}

const LinkSchema = new Schema<ILink>(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    destinationUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    qrCodeData: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

LinkSchema.index({ createdAt: -1 });

const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default Link;
