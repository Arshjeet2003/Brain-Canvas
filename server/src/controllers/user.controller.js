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

// method to generate access and refresh token and save refresh token to DB.
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    // update refreshToken in DB.
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // do not check for password.
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

// controller for registering user.
const registerUser = asyncHandler(async (req, res) => {
  // Steps to register user --->

  // destructure data
  const { username, email, fullName, password } = req.body;

  // empty fields check
  if (
    [username, email, fullName, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are compulsory or required");
  }

  // user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], // either username or email matches.
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with similar email or username already exists"
    );
  }

  // upload to DB
  const user = await User.create({
    fullName,
    email,
    username,
    password,
  });

  // check if user created and remove from response (password and refreshToken).
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return data to frontend
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// controller for user login.
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // check for password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User credentials");
  }

  // generate access and refresh token and save refresh token to DB.
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // send cookie
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // cookie can be modified by server only
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        loggedInUser,
        accessToken,
        "user logged in successfully"
      )
    );
});

// controller for user logout.
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.header.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { newAccessToken, newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { newRefreshToken, newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };