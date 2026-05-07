import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    image: {
      type: [Number],
    },
    spO2: {
      type: Number,
      required: true,
    },
    bp: {
      type: Number,
      required: true,
    },
    bpm: {
      type: Number,
      required: true,
    },
    temp: {
      type: Number,
      required: true,
    },
    prediction: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Detection = mongoose.model("Detection", detectionSchema);
export default Detection;
