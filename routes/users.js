express = require("express");

const router = express.Router();

const usersController = require('../controllers/users');

//User Login
router.post('/login', usersController.login);

//User Registartaion
router.post('/register', usersController.register);

//User Logout
router.get('/logout', usersController.logout);

//Getting a specific user
router.get("/:id", usersController.getUser);

//Update an existing user
router.put("/:id", usersController.updateUser);

//Update an existing user (Adding Farm)
router.put("/addFarm/:id", usersController.addFarmToUser);

//Update an existing user (Delete Farm)
router.put("/deleteFarm/:id", usersController.RemoveFarmFromUser);

router.put('/addItemToFarm/:id', usersController.addItemToFarm);

router.put('/RemoveItemFromFarm/:id', usersController.RemoveItemFromFarm);

//Delete an existing user
router.delete("/:id", usersController.deleteUser);

//Get the number of users stored in our database
router.get(`/get/count`, usersController.howManyUsers);

//After hitting the reset button
router.post(`/reset`, usersController.postReset);

//Getting a new password
router.post(`/reset/newPassword`, usersController.getNewPassword);

//Getting the list of all users
router.get(`/`, usersController.getAllUsers);

module.exports = router;