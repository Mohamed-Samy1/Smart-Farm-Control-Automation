const getAuthenticatedUser = async (req) => {
  // Extract the JWT token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header missing.");
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);

    if (!decodedToken) {
      throw new Error("Invalid token.");
    }

    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch (error) {
    throw new Error("Authentication failed.");
  }
};

module.exports = { getAuthenticatedUser };