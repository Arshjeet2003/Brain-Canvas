import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Link = mongoose.model("Link", linkSchema);
