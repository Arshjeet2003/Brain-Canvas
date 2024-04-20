import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    parentLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ideaCharts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Board = mongoose.model("Board", boardSchema);
