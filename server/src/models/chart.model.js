import mongoose from "mongoose";

const chartSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ideas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
      },
    ],
    parentBoard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    parentLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Chart = mongoose.model("Chart", chartSchema);
