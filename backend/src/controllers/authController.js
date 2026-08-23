/**
 * Controller: authController.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Handles user authentication, password hashing, and JWT token issuing.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userModel = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

/**
 * Register a new user (Customer or Support Agent).
 * POST /api/v1/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email, and password.');
    }

    // 2. Check if user already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    // 3. Hash password (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert user record (Sanitize role: public self-registration is strictly CUSTOMER to prevent privilege escalation)
    const assignedRole = (req.user && req.user.role === 'ADMIN' && ['CUSTOMER', 'AGENT', 'ADMIN'].includes(role))
      ? role
      : 'CUSTOMER';

    const newUser = await userModel.createUser({
      name,
      email,
      passwordHash,
      role: assignedRole
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return sendSuccess(res, 201, 'User registered successfully', {
      user: newUser,
      token
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticate existing user and issue JWT token.
 * POST /api/v1/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide both email and password.');
    }

    // 1. Find user by email
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return sendError(res, 401, 'Invalid email or password credentials.');
    }

    // 2. Compare password hashes
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password credentials.');
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      created_at: user.created_at
    };

    return sendSuccess(res, 200, 'Login successful', {
      user: userPayload,
      token
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch authenticated user profile.
 * GET /api/v1/auth/me
 */
async function getMe(req, res, next) {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }
    return sendSuccess(res, 200, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch all users (Admin only).
 * GET /api/v1/auth/users
 */
async function getUsers(req, res, next) {
  try {
    const users = await userModel.getAllUsers();
    return sendSuccess(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
}

/**
 * Update user role (Admin only).
 * PATCH /api/v1/auth/users/:id/role
 */
async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!role || !['CUSTOMER', 'AGENT', 'ADMIN'].includes(role)) {
      return sendError(res, 400, 'Valid role is required (CUSTOMER, AGENT, ADMIN).');
    }
    const updated = await userModel.updateUserRole(req.params.id, role);
    if (!updated) {
      return sendError(res, 404, 'User not found.');
    }
    return sendSuccess(res, 200, 'User role updated successfully', updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole
};
