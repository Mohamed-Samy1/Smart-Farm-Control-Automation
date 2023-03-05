const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { User } = require("../models/user");
const { Item } = require("../models/item");

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
  if (req.body.password === req.body.confirmPassword) {
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      country: req.body.country,
      role: req.body.role
    });
    user = await user.save();

    // Create a cookie name as jwt and contain token that expires after 1 day
    // In cookies, expiration date is calculated by milisecond
    const token = createJWT(user._id);

    if (!user) return res.status(400).send("the user cannot be created!");

    res.status(201).json({ user, token });
  } else {
    return res.status(400).send("The two fields of passwords should be the same");
  }
};

//USER LOGIN
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(404).send("The user was not found!");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = createJWT(user._id);
    res.status(200).json({ user, token });
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
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
};

//UPDATE AN EXISTNG USER
exports.updateUser = async (req, res) => {
  const userExist = await User.findById(req.params.id);
  if (!userExist) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found." });
  }

  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.password;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
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

  if (!user) return res.status(400).send("This user cannot be updated!");

  res.status(200).send(user);
};

//DELETE AN EXISTING USER
exports.deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

//ADD FARM TO THE USER
exports.addFarmToUser = async (req, res) => {
 
  //Check if the user already exists
  let userExist = await User.findById(req.params.id);
  if (!userExist) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found." });
  }

  //Get the request body for the farm and add it to the user
  
  const newFarm = {
    "name": req.body.farmName,
    "type": req.body.farmType,
    "isDisabled": req.body.isDisabled,
    "government": req.body.government,
    "city": req.body.city,
    "landNumber": req.body.landNumber,
    "landArea": req.body.landArea,
    "officalNumber": req.body.officalNumber
  }  
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { farms: newFarm } },
  ).exec();

  if (!newFarm) return res.status(400).send("This farm cannot be added!");

  res.status(201).json({farmAdded: newFarm, message: "Farm was added successfuly."});
};

//REMOVE A FARM FROM THE USER FARMS
exports.RemoveFarmFromUser = async (req, res) => {
 
  //Check if the user already exists
  let userExist = await User.findById(req.params.id);
  if (!userExist) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found." });
  }
  //Check if the offical number was sent in the request body
  if (!req.body.officalNumber) { 
    return res
      .status(400)
      .send("The farm's offical number must be provided!");
  }
  //Check if there is a farm with this offical number
  let userFarms = userExist.farms;
  const farmExist = userFarms.find(f => f.officalNumber === req.body.officalNumber);
  if (!farmExist) {
    return res
      .status(404)
      .send("This farm offical number was not found!");
  }
  //Delete the farm from the user
  userFarms = userFarms.filter(f => f.officalNumber !== req.body.officalNumber);

  User.findOneAndUpdate({ _id: req.params.id }, {
    farms: userFarms
  }).exec();

  res.status(200).json({message: "Farm was removed successfuly."});
};

//ADD ITEM TO THE FARM OF THE USER
exports.addItemToFarm = async (req,  res) => {
  //Check if the user already exists
  let userExist = await User.findById(req.params.id);

  if (!userExist) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found." });
  }

  //find the item with provided serial number
  const item = await Item.findOne({ serialNumber: req.body.serialNumber });

  if(!item) {
    return res
      .status(404)
      .json({message: "No item with this serial number was found!"});
  }

  //Check if there is a farm with this offical number
  let userFarms = userExist.farms;
  let farmExist = userFarms.find(f => f.officalNumber === req.body.officalNumber);

  if (!farmExist) {
    return res
      .status(404)
      .send("This farm offical number was not found!");
  }
  
  const ItemAddedID = { _id: item._id };

  //Add the item to the farm
  User.findOneAndUpdate(
    { _id: req.params.id }, 
    { $push: { "farms.$[].farmItems": ItemAddedID } }
  ).exec();

  res.status(201).json({message: "Item was added successfuly."});
};

//REMOVE ITEM FROM FARM   (Needs Validation)
exports.RemoveItemFromFarm = async (req, res) => {
  //Check if the user already exists
  let userExist = await User.findById(req.params.id);

  if (!userExist) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found." });
  }

  //find the item with provided serial number
  const item = await Item.findOne({ serialNumber: req.body.serialNumber });

  if(!item) {
    return res
      .status(404)
      .json({message: "No item with this serial number was found!"});
  }

  //Check if there is a farm with this offical number
  let userFarms = userExist.farms;
  let farmExist = userFarms.find(f => f.officalNumber === req.body.officalNumber);

  if (!farmExist) {
    return res
      .status(404)
      .send("This farm offical number was not found!");
  }
  
  //filter the specific farm needed by the user
  userFarms = userFarms.filter(f => f.officalNumber === req.body.officalNumber);

  //Delete the item from the farm
  User.findOneAndUpdate(
    { _id: req.params.id }, 
    { $pullAll: { 
      "farms.$[].farmItems": [{ _id: item._id }] 
    } }
  ).exec();

  res.status(200).json({message: "Item has been deleted successfuly."});

};

//GET THE NUMBER OF USERS STORED IN THE DATABASE
exports.howManyUsers = async (req, res) => {
  const userCount = await User.countDocuments((count) => count).clone();

  if (!userCount) {
    return res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
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
