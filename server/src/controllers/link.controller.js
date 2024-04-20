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

const getLinkById = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Find the board by ID
  const link = await Link.findById(_id);

  if (!link) {
    throw new ApiError(404, "Board not found");
  }

  // Fetch all boards
  const boardIds = link.boards;
  const boards = [];
  if (boardIds) {
    for (const boardId of boardIds) {
      const board = await Board.findById(boardId);
      if (board) {
        boards.push(board);
      } else {
        console.log(`Board with ID ${boardId} not found`);
      }
    }
  }

  // If current user is new user to link : add user to link
  if (!link.users.includes(req.user._id)) {
    link.users.push(req.user._id);
    await link.save();
  }

  link.boards = boards;

  res.status(200).json(new ApiResponse(200, link, "Link fetched successfully"));
});

const createLink = asyncHandler(async (req, res) => {
  try {
    const link = new Link({});

    link.users.push(req.user);

    const savedLink = await link.save();

    res.status(201).json(savedLink);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

export { getLinkById, createLink };