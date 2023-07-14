express = require("express");
const router = express.Router();

const usersController = require('../controllers/users');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     description: Register a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Input validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Password and confirm password do not match"
 *       500:
 *         description: Internal server error or registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Registration failed."
 */
router.post('/register', usersController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Users
 *     description: Authenticate user with email and password, and return a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: mosalah@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzg3NTM4ZmJhMjQ3MTAwMTU1MDIyYmMiLCJpYXQiOjE2MzI3Mjg0MTIsImV4cCI6MTYzMzMyMjQxMn0.4Ww4eKt9PnEh1MH1RHGkLJWOtZyR1Yt7Zi06XcBf9d0"
 *       400:
 *         description: Input validation error or wrong password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Wrong Password."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "The user was not found!"
 *       500:
 *         description: Internal server error or login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Login failed."
 */
//User Login
router.post('/login', usersController.login);

//User Logout
router.get('/logout', usersController.logout);

//Getting a specific user
router.get("/getUser", usersController.getUser);

//Update an existing user
router.put("/updateUser", usersController.updateUser);

//Delete an existing user
router.delete("/deleteUser", usersController.deleteUser);

//After hitting the reset button
router.post(`/reset`, usersController.postReset);

//Getting a new password
router.post(`/reset/newPassword`, usersController.getNewPassword);

//Getting the list of all users
router.get(`/`, usersController.getAllUsers);

module.exports = router;