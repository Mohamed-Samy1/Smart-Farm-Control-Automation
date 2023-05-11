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
router.get("/getUser", usersController.getUser);

//Update an existing user
router.put("/updateUser", usersController.updateUser);

//Add Farm to user
router.put("/addFarmToUser", usersController.addFarmToUser);

//Delete farm from user
router.put("/RemoveFarmFromUser", usersController.RemoveFarmFromUser);

//Delete an existing user
router.delete("/deleteUser", usersController.deleteUser);

//After hitting the reset button
router.post(`/reset`, usersController.postReset);

//Getting a new password
router.post(`/reset/newPassword`, usersController.getNewPassword);

//Getting the list of all users
router.get(`/`, usersController.getAllUsers);

module.exports = router;