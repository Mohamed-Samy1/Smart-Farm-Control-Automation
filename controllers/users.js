const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { User } = require("../models/user");

const maxAge = 24 * 60 * 60;

// Creating a JWT token
const createJWT = (id) => {
  return jwt.sign(
    { id }, 
    process.env.secret,
    // token expiration, calculated by second
    {expiresIn: maxAge * 1000}
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

//USER REGISTRATION
exports.register = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword, 
      phone, 
      country 
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirm password do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = new User({ firstName, lastName, email, password, phone, country });
    const savedUser = await user.save();

    const token = createJWT(savedUser._id);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//USER LOGIN
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send("The user was not found!");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = createJWT(user._id);
    res.status(200).json({ token });
  } else {
    return res.status(400).send("Password is wrong!");
  }
};

//USER LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ logout: true });
};

//Getting the list of all users
exports.getAllUsers = async (req, res) => {
  const userList = await User.find().select("-password");

  if (!userList) {
    return res.status(500).json({ success: false });
  }
  res.status(200).send(userList);
};

//GETTING A SPECIFIC USER
exports.getUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID and exclude the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

//UPDATE AN EXISTING USER
exports.updateUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "The user with the given ID was not found." });
    }

    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.password;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: newPassword,
        phone: req.body.phone,
        country: req.body.country,
        role: req.body.role
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).send("This user cannot be updated!");
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};


//DELETE AN EXISTING USER
exports.deleteUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    const deletedUser = await User.findByIdAndRemove(userId);
    if (deletedUser) {
      return res.status(200).json({ success: true, message: "the user is deleted!" });
    } else {
      return res.status(404).json({ success: false, message: "user not found!" });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

//ADD FARM TO THE USER
exports.addFarmToUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "The user with the given ID was not found." });
    }

    //Get the request body for the farm and add it to the user
    const newFarm = {
      "serialNumber": req.body.serialNumber,
    };  

    //Update the user with the new farm
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { farms: newFarm } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).send("This farm cannot be added!");
    }

    res.status(201).json({ farmAdded: newFarm, message: "Farm was added successfully." });
  } catch (e) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

//REMOVE A FARM FROM THE USER FARMS
exports.RemoveFarmFromUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "The user with the given ID was not found." });
    }

    if (!req.body.serialNumber) { 
      return res.status(400).send("The farm's serial number must be provided!");
    }

    let userFarms = userExist.farms;
    const farmExist = userFarms.find(f => f.serialNumber === req.body.serialNumber);
    if (!farmExist) {
      return res.status(404).send("This farm serial number was not found!");
    }

    //Delete the farm from the user
    userFarms = userFarms.filter(f => f.serialNumber !== req.body.serialNumber);
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { farms: userFarms }, { new: true });

    if (!updatedUser) {
      return res.status(400).send("This farm cannot be removed!");
    }

    res.status(200).json({ message: "Farm was removed successfully." });
  } catch (e) {
    res.status(401).json({ error: 'Authentication failed' });
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
