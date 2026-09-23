const bcrypt = require("bcryptjs");
const permission= require("../models/Permission");
const User = require("../models/User");
const Role = require("../models/role");
const RefreshToken = require("../models/RefreshToken");

const {
  genarateAccessToken,
  genarateRefreshToken,
  hashToken,
  getRefreshTokenExpir,
} = require("../utils/token");

const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
}) => {
  const existingUser = await User.findOne({
    email,
  });

  // Check existing user
  if (existingUser) {
    const error = new Error("An account with this email already exists");

    error.statusCode = 409;
    throw error;
  }

  // Find candidate role
  const candidateRole = await Role.findOne({
    name: "CANDIDATE",
    isActive: true,
  });

  if (!candidateRole) {
    const error = new Error("CANDIDATE role is not configured");

    error.statusCode = 500;
    throw error;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
    role: candidateRole._id,
  });

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: candidateRole.name,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};

const loginUser = async ({ email, password, userAgent, ipAddress }) => {
  const user = await User.findOne({ email })
    .select("+passwordHash")
    .populate({
      path: "role",
      populate: {
        path: "permissions",
        match: {
          isActive: true,
        },
      },
    });

  // User not found
  if (!user) {
    const error = new Error("Invalid email or password");

    error.statusCode = 401;
    throw error;
  }

  // Check user active
  if (!user.isActive) {
    const error = new Error("Your account is inactive");

    error.statusCode = 403;
    throw error;
  }

  // Check password
  const passwordMatched = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatched) {
    const error = new Error("Invalid email or password");

    error.statusCode = 401;
    throw error;
  }

  // Update last login time
  user.lastLoginAt = new Date();

  await user.save();

  // Generate access token
  const accessToken = genarateAccessToken(user);

  // Generate refresh token
  const refreshToken = genarateRefreshToken(user);

  // Hash refresh token before storing
  const refreshTokenHash = hashToken(refreshToken);

  // Get refresh token expiry
  const expiresAt = getRefreshTokenExpir();

  // Store refresh token
  await RefreshToken.create({
    user: user._id,
    tokenHash: refreshTokenHash,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      Permissions: user.role.permissions.map((permission) => permission.code),
    },
    accessToken,
    refreshToken,
  };
};

//check token new or old if old then invalid
const refreshAccessToken = async ({ refreshToken, userAgent, ipAddress }) => {
  if (!refreshToken) {
    const error = new Error("Reference token is required!");
    error.statusCode = 401;
    throw error;
  }

  //if token is refresh then
  const tokenHash = hashToken(refreshToken);
  //store token new token if exist same token remain same but different then replace
  const storedToken = await RefreshToken.findOne({
    tokenHash,
  }).populate({
    path: "user",
    populate: {
      path: "role",
    },
  });
  //if not store token
  if (!storedToken) {
    const error = new Error("Invalid refresh token");

    error.statusCode = 401;

    throw error;
  }
  //revoke refresh token

  if (storedToken.revokedAt) {
    const error = new Error("refresh token has been revoked");

    error.statusCode = 401;

    throw error;
  }

  //Check store valide or not
  if (storedToken.expiresAt <= new Date()) {
    const error = new Error("store refresh token has been expired");

    error.statusCode = 401;
    throw error;
  }

  //check user is active if user inActive then token invalide

  const user = storedToken.user;

  if (!user || !user.isActive) {
    const error = new Error(" User account is inactive");
    error.statuscode = 401;
    throw error;
  }

  //Refresh token rotation
  storedToken.revokedAt = new Date();

  await storedToken.save();

  //Check store token
  const newRefreshToken = genarateRefreshToken();

  const newTokenHash = hashToken(newRefreshToken);

  //Create refresh token
  await RefreshToken.create({
    tokenHash: newTokenHash,
    user: user._id,
    expiresAt: getRefreshTokenExpir(),
    userAgent,
    ipAddress,
  });

  //Access new refresh token
  const newAccessToken = genarateAccessToken(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

//logoutUser

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }
  const tokenHash = hashToken(refreshToken);

  //update profile after logout

  await RefreshToken.updateOne(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
