import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// http://localhost:3000/api/v1/auth/sign-up

// MARK: Sign Up Logic
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// MARK: Sign In Logic
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User does not exist with this email");
      error.statusCode = 404;
      throw error;
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
