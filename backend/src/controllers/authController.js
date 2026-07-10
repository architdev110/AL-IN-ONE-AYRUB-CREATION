import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../config/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// REGISTER
export const register = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    // Generate tokens
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }
    );

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Registration failed'\n    });\n  }\n});\n\n// LOGIN\nexport const login = asyncHandler(async (req, res) => {\n  try {\n    const { email, password } = req.body;\n\n    if (!email || !password) {\n      return res.status(400).json({\n        status: 'error',\n        message: 'Email and password are required'\n      });\n    }\n\n    const user = await User.findOne({ email }).select('+password');\n\n    if (!user) {\n      logger.warn(`Login attempt with non-existent email: ${email}`);\n      return res.status(401).json({\n        status: 'error',\n        message: 'Invalid credentials'\n      });\n    }\n\n    if (user.isAccountLocked()) {\n      logger.warn(`Login attempt with locked account: ${email}`);\n      return res.status(401).json({\n        status: 'error',\n        message: 'Account temporarily locked. Try again later.'\n      });\n    }\n\n    const passwordMatch = await user.comparePassword(password);\n\n    if (!passwordMatch) {\n      await user.incLoginAttempts();\n      logger.warn(`Failed login attempt: ${email}`);\n      return res.status(401).json({\n        status: 'error',\n        message: 'Invalid credentials'\n      });\n    }\n\n    // Reset login attempts on successful login\n    await user.resetLoginAttempts();\n\n    // Update last login\n    user.lastLogin = new Date();\n    await user.save();\n\n    // Generate tokens\n    const token = jwt.sign(\n      { id: user._id, email: user.email, role: user.role },\n      process.env.JWT_SECRET,\n      { expiresIn: process.env.JWT_EXPIRE || '7d' }\n    );\n\n    const refreshToken = jwt.sign(\n      { id: user._id },\n      process.env.REFRESH_TOKEN_SECRET,\n      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }\n    );\n\n    logger.info(`User logged in: ${email}`);\n\n    res.json({\n      status: 'success',\n      message: 'Login successful',\n      data: {\n        user: {\n          id: user._id,\n          email: user.email,\n          firstName: user.firstName,\n          lastName: user.lastName,\n          role: user.role,\n          subscriptionPlan: user.subscriptionPlan\n        },\n        token,\n        refreshToken\n      }\n    });\n  } catch (error) {\n    logger.error(`Login error: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Login failed'\n    });\n  }\n});\n\n// REFRESH TOKEN\nexport const refreshToken = asyncHandler(async (req, res) => {\n  try {\n    const { refreshToken } = req.body;\n\n    if (!refreshToken) {\n      return res.status(400).json({\n        status: 'error',\n        message: 'Refresh token required'\n      });\n    }\n\n    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {\n      if (err) {\n        return res.status(403).json({\n          status: 'error',\n          message: 'Invalid refresh token'\n        });\n      }\n\n      const newToken = jwt.sign(\n        { id: decoded.id },\n        process.env.JWT_SECRET,\n        { expiresIn: process.env.JWT_EXPIRE || '7d' }\n      );\n\n      res.json({\n        status: 'success',\n        data: { token: newToken }\n      });\n    });\n  } catch (error) {\n    logger.error(`Token refresh error: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Token refresh failed'\n    });\n  }\n});\n\n// LOGOUT\nexport const logout = asyncHandler(async (req, res) => {\n  try {\n    logger.info(`User logged out: ${req.user.email}`);\n    res.json({\n      status: 'success',\n      message: 'Logout successful'\n    });\n  } catch (error) {\n    logger.error(`Logout error: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Logout failed'\n    });\n  }\n});\n\n// VERIFY EMAIL\nexport const verifyEmail = asyncHandler(async (req, res) => {\n  try {\n    const { token } = req.body;\n\n    if (!token) {\n      return res.status(400).json({\n        status: 'error',\n        message: 'Verification token required'\n      });\n    }\n\n    // TODO: Implement email verification logic\n    res.json({\n      status: 'success',\n      message: 'Email verified'\n    });\n  } catch (error) {\n    logger.error(`Email verification error: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Email verification failed'\n    });\n  }\n});\n\n// RESET PASSWORD\nexport const resetPassword = asyncHandler(async (req, res) => {\n  try {\n    const { email } = req.body;\n\n    if (!email) {\n      return res.status(400).json({\n        status: 'error',\n        message: 'Email is required'\n      });\n    }\n\n    const user = await User.findOne({ email });\n\n    if (!user) {\n      return res.status(404).json({\n        status: 'error',\n        message: 'User not found'\n      });\n    }\n\n    // Generate reset token\n    const resetToken = jwt.sign(\n      { id: user._id },\n      process.env.JWT_SECRET,\n      { expiresIn: '1h' }\n    );\n\n    logger.info(`Password reset requested for: ${email}`);\n\n    // TODO: Send email with reset link\n\n    res.json({\n      status: 'success',\n      message: 'Password reset email sent',\n      data: { resetToken } // Remove in production\n    });\n  } catch (error) {\n    logger.error(`Password reset error: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Password reset failed'\n    });\n  }\n});\n"