import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { validationResult, body } from "express-validator";
import { Board } from "../models/board.model.js";
import { Chart } from "../models/chart.model.js";
import { Idea } from "../models/idea.model.js";
import { Link } from "../models/link.model.js";

const createIdea = asyncHandler(async (req, res) => {
  // Extract required data from request body
  const {
    topic,
    description,
    idea_space,
    inspiration,
    cons,
    progress,
    github_link,
    guiding,
    comments,
    likes,
    additional_points,
    prevNodes,
  } = req.body;

  const { linkId, boardId, chartId } = req.params;

  // Check if required fields are provided
  if (!topic || !chartId || !boardId || !linkId) {
    throw new ApiError(400, "Topic, chartId, and boardId are required");
  }

  // Check if link, board and chart is correct and hierarchial.
  const link = await Link.findById(linkId);

  if (!link) {
    throw new ApiError(404, "Parent link not found");
  }

  const parentBoard = await Board.findById(boardId);
  if (!parentBoard) {
    throw new ApiError(404, "Parent board not found");
  }

  const parentChart = await Chart.findById(chartId);
  if (!parentChart) {
    throw new ApiError(404, "Parent chart not found");
  }

  if (!link.boards.includes(boardId)) {
    throw new ApiError(
      403,
      "You do not have permisson to create an idea in this link"
    );
  }

  // if (!parentBoard.users.includes(req.user._id)) {
  //   throw new ApiError(
  //     403,
  //     "You do not have permission to create an idea in this board"
  //   );
  // }

  // Check if parent ideas exist, if provided
  // if (prevNodes) {
  //   for (const prevNodeId of prevNodes) {
  //     const prevNode = await Idea.findById(prevNodeId);
  //     if (!prevNode) {
  //       throw new ApiError(
  //         404,
  //         `Previous idea with ID ${prevNodeId} not found`
  //       );
  //     }
  //   }
  // }

  // Create a new idea instance
  const idea = new Idea({
    topic,
    description,
    idea_space,
    inspiration,
    cons,
    progress,
    github_link,
    guiding,
    comments,
    likes,
    additional_points,
    prevNodes: prevNodes || [], // If prevNodes is not provided, initialize as an empty array
    parentChart: chartId,
    parentBoard: boardId,
    parentLink: linkId,
    createdBy: req.user._id, // Assuming req.user is available globally if authenticated
  });

  // Save the new idea to the database
  const createdIdea = await idea.save();

  // Update the parentChart with the newly created idea
  parentChart.ideas.push(createdIdea._id);
  await parentChart.save();

  // Return success response with created idea details
  return res
    .status(201)
    .json(new ApiResponse(200, createdIdea, "Idea created successfully"));
});

const getIdeaById = asyncHandler(async (req, res) => {
  const { chartId, boardId, linkId, _id } = req.params;

  if (!_id || !chartId || !boardId || !linkId) {
    throw new ApiError(400, "Title, chartId, and boardId are required");
  }

  const link = await Link.findById(linkId);

  if (!link) {
    throw new ApiError(404, "Parent link not found");
  }

  // Check if the parent board exists
  const parentBoard = await Board.findById(boardId);
  if (!parentBoard) {
    throw new ApiError(404, "Parent board not found");
  }

  // Check if the parent chart exists
  const parentChart = await Chart.findById(chartId);
  if (!parentChart) {
    throw new ApiError(404, "Parent chart not found");
  }

  if (!link.boards.includes(boardId)) {
    throw new ApiError(
      403,
      "You do not have permisson to create an idea in this link"
    );
  }

  if (!parentBoard.users.includes(req.user._id)) {
    throw new ApiError(
      403,
      "You do not have permission to create an idea in this board"
    );
  }

  // Find the idea by ID
  const idea = await Idea.findById(_id);

  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  res.status(200).json(idea);
});

const updateIdea = asyncHandler(async (req, res) => {
  // Extract idea ID from request parameters
  const { ideaId } = req.params;

  // Extract updated data from request body
  const {
    topic,
    description,
    idea_space,
    inspiration,
    cons,
    progress,
    github_link,
    guiding,
    comments,
    likes,
    additional_points,
    prevNodes,
  } = req.body;

  // Check if required fields are provided
  if (!ideaId) {
    throw new ApiError(400, "Idea ID is required");
  }

  // Find the idea by ID
  let idea = await Idea.findById(ideaId);

  // If idea doesn't exist, throw an error
  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  // Check if the current user has permission to update the idea
  // Assuming authentication is handled and req.user contains user information
  if (idea.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to update this idea");
  }

  // Update the idea fields with the provided data
  idea.topic = topic;
  idea.description = description;
  idea.idea_space = idea_space;
  idea.inspiration = inspiration;
  idea.cons = cons;
  idea.progress = progress;
  idea.github_link = github_link;
  idea.guiding = guiding;
  idea.comments = comments;
  idea.likes = likes;
  idea.additional_points = additional_points;
  idea.prevNodes = prevNodes;

  // Save the updated idea to the database
  idea = await idea.save();

  // Return success response with updated idea details
  res.status(200).json(new ApiResponse(200, idea, "Idea updated successfully"));
});

export { getIdeaById, createIdea, updateIdea };
