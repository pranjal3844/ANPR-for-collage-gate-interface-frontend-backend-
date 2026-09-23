import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: [true, "Plate number is required"],
      trim: true,
      uppercase: true,
      index: true,
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: ["KNOWN", "UNKNOWN"],
      required: true,
      index: true,
    },

    yoloConfidence: {
      type: Number,
      default: null,
      min: 0,
      max: 1,
    },

    ocrConfidence: {
      type: Number,
      default: null,
      min: 0,
      max: 1,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    detectedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    source: {
      type: String,
      enum: ["VIDEO_UPLOAD", "CCTV"],
      default: "VIDEO_UPLOAD",
    },
  },
  {
    timestamps: true,
  }
);

export const Detection = mongoose.model("Detection", detectionSchema);