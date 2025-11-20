import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
  linkId: mongoose.Types.ObjectId;
  shortCode: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referer: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    device: {
      type: String,
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

AnalyticsSchema.index({ linkId: 1, timestamp: -1 });
AnalyticsSchema.index({ shortCode: 1, timestamp: -1 });

const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
