import mongoose from "mongoose";

const ideaSpaceSchema = new mongoose.Schema({
  text: String,
  images: [String],
  board: [String],
  graphs: [String],
  links: [String],
});

const inspirationSchema = new mongoose.Schema({
  text: String,
  images: [String],
  board: [String],
  graphs: [String],
  links: [String],
});

const consSchema = new mongoose.Schema({
  time: String,
  budget: String,
});

const ideaSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    description: String,
    idea_space: [ideaSpaceSchema],
    inspiration: [inspirationSchema],
    cons: consSchema,
    progress: String,
    github_link: String,
    guiding: [String],
    comments: { type: mongoose.Schema.Types.Mixed, default: {} },
    likes: Number,
    additional_points: [String],
    prevNodes: [String],
    parentChart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chart",
    },
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

export const Idea = mongoose.model("Idea", ideaSchema);
