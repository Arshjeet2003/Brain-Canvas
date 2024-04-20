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

const createGroup = asyncHandler(async (req, res) => {
  // Extract required data from request body
  const { title, description, users } = req.body;
  const { linkId } = req.params;

  // Check if required fields are provided
  if (!title || !description) {
    throw new ApiError(
      400,
      "Title, description, and at least one username are required"
    );
  }

  // let isUserPresent = false;
  // users.forEach((element) => {
  //   if (element === req.user.username) isUserPresent = true;
  // });

  // if (!isUserPresent) {
  //   users.push(req.user.username);
  // }

  // // Find users by their usernames
  // const foundUsers = await User.find({ username: { $in: users } });

  // if (foundUsers.length !== users.length) {
  //   throw new ApiError(404, "One or more users not found");
  // }

  const parentLink = await Link.findById(linkId);

  if (!parentLink) {
    throw new ApiError(404, "No parent Link available");
  }

  // Create new Board instance
  const board = new Board({
    title,
    description,
    users: [],
    createdBy: req.user._id,
    parentLink,
  });

  // Save the new board to the database
  const createdBoard = await board.save();

  parentLink.boards.push(createdBoard._id);

  await parentLink.save();

  // Populate the board with user details
  await createdBoard.populate("users", "-password -refreshToken");

  // Return success response with created board details
  return res
    .status(201)
    .json(new ApiResponse(200, createdBoard, "Group created successfully"));
});

const getBoardById = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Find the board by ID
  const board = await Board.findById(_id).populate({
    path: "ideaCharts",
    select: "title description",
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  // Fetch all links
  const chartIds = board.ideaCharts;
  const charts = [];
  if (chartIds) {
    for (const chartId of chartIds) {
      const chart = await Chart.findById(chartId);
      if (board) {
        charts.push(chart);
      } else {
        console.log(`Board with ID ${chartId} not found`);
      }
    }
  }

  board.ideaCharts = charts;

  res
    .status(200)
    .json(new ApiResponse(200, board, "Board fetched successfully"));
});

export { getBoardById, createGroup };