const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

const getAuthenticatedUser = async (req) => {
  try {

    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing.");
    }

  const token = authHeader.split(' ')[1];
    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    console.log("decodedToken: ", decodedToken);

    if (!decodedToken) {
      throw new Error("Invalid token.");
    }

    const userId = decodedToken.id;
    console.log("userId: ", userId);

    // Find the user in the database by ID
    const user = await User.findById(userId);
    console.log("user: ", user);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Authentication failed.");
  }
}

module.exports = { getAuthenticatedUser };