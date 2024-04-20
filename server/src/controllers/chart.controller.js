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

// Controller for creating a new chart for a board
const createChart = asyncHandler(async (req, res) => {
  // Extract required data from request body
  const { title, description } = req.body;

  const { boardId, linkId } = req.params;

  // Check if required fields are provided
  if (!title || !description || !boardId) {
    throw new ApiError(400, "Title, description, and boardId are required");
  }

  const link = await Link.findById(linkId);

  if (!link) {
    throw new ApiError(404, "Link does not exits");
  }

  // Check if the board exists
  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  if (!link.boards.includes(board._id)) {
    throw new ApiError(404, "Board does not belong to same link");
  }

  // Check if the current user has permission to create a chart in the board
  // if (!board.users.includes(req.user._id)) {
  //   throw new ApiError(
  //     403,
  //     "You do not have permission to create a chart in this board"
  //   );
  // }

  // Create a new chart instance
  const chart = new Chart({
    title,
    description,
    createdBy: req.user._id,
    parentBoard: boardId,
    parentLink: linkId,
  });

  // Save the new chart to the database
  const createdChart = await chart.save();

  // Add the chart to the board's list of ideaCharts
  board.ideaCharts.push(createdChart._id);
  await board.save();

  // Return success response with created chart details
  return res
    .status(201)
    .json(new ApiResponse(200, createdChart, "Chart created successfully"));
});

const getChartById = asyncHandler(async (req, res) => {
  const { boardId, linkId, _id } = req.params;

  const link = await Link.findById(linkId);

  if (!link) {
    throw new ApiError(404, "Link does not exits");
  }

  // Check if the board exists
  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  if (!link.boards.includes(board._id)) {
    throw new ApiError(404, "Board does not belong to same link");
  }

  // Check if the current user has permission to create a chart in the board
  // if (!board.users.includes(req.user._id)) {
  //   throw new ApiError(
  //     403,
  //     "You do not have permission to access this chart (does not belong to same board)"
  //   );
  // }

  // Find the chart by ID
  const chart = await Chart.findById(_id).populate(
    "ideas",
    "title description"
  );

  if (!chart) {
    throw new ApiError(404, "Chart not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, chart, "Chart fetched successfully..."));
});

export { getChartById, createChart };
