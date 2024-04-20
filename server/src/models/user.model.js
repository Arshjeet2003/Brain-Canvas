import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// --> use function (not arrow function) with hooks as arrow functions don't have access to context (this).

// hash password on 'save' and when password is updated
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// create new method in mongoose to verify password on login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// create new method in mongoose to generate access token (a jwt token)
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    // payload
    {
      _id: this._id,
      email: this.email,
    },
    // secret
    process.env.ACCESS_TOKEN_SECRET,
    // expiry
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// create new method in mongoose to generate refresh token (a jwt token)
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    // payload
    {
      _id: this._id,
    },
    // secret
    process.env.REFRESH_TOKEN_SECRET,
    // expiry
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
