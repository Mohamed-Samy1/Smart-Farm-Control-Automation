const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { User } = require("../models/user");
const { getAuthenticatedUser } = require("../utils/authorization");

//The next line needs to be checked
const { threadId } = require("worker_threads");

// Creating a JWT token
const createJWT = (id) => {
  return jwt.sign(
    { id },
    process.env.secret,
    // token expiration, calculated by seconds (2 hours in this case)
    { expiresIn: 7200 }
  );
};

// ERROR HANDLING FUNCTION
const alertError = (err) => {
  let errors = { name: "", email: "", password: "" };
  console.log("err message", err.message);
  console.log("err code", err.code);

  if (err.message === "Incorrect email") {
    errors.email = "This email not found!";
  }
  if (err.message === "Incorrect password") {
    errors.password = "The password is incorrect!";
  }
  if (err.code === 11000) {
    errors.email = "This email already registered";
    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      country,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
    });
    const savedUser = await user.save();

    const token = createJWT(savedUser._id);
    res.status(201).json({
      message: `${firstName} ${lastName} registered successfully.`,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed." });
  }
};

//USER LOGIN
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User was not found!" });
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = createJWT(user._id);
      res.status(200).json({
        message: `${firstName} ${lastName} logged in successfully.`,
        token,
      });
    } else {
      return res.status(400).json({ message: "Wrong Password." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed.", error: err });
  }
};

//USER LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ logout: true });
};

//Getting the list of all users
exports.getAllUsers = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    const userList = await User.find().select("-password");

    if (!userList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).send(userList);
  } catch (e) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

//GETTING A SPECIFIC USER
exports.getUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID and exclude the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

//UPDATE AN EXISTING USER
exports.updateUser = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.password;
    }

    user = await User.findByIdAndUpdate(
      user._id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: newPassword,
        phone: req.body.phone,
        country: req.body.country,
        role: req.body.role,
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).send("This user cannot be updated!");
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

//DELETE AN EXISTING USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    const deletedUser = await User.findByIdAndRemove(user._id);
    if (deletedUser) {
      return res
        .status(200)
        .json({ success: true, message: "the user is deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

//AFTER HITTING THE RESET BUTTON
exports.postReset = async (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) console.log(err);

    const token = buffer.toString(hex);
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found!");
        }
        user.resetToken = token;
        user.resetTokenExpirtation = Date.now() + 3600000; // +1h
        return user.save();
      })
      .then((result) => {
        //Send email to the user telling him that he requested
        //a password rested with a link provided to reset page
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

//GETTING A NEW PASSWORD
exports.getNewPassword = async (req, res, next) => {};
