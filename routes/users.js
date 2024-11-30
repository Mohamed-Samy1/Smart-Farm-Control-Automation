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

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Users
 *     description: Clears the JWT cookie and logs out the currently authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzg3NTM4ZmJhMjQ3MTAwMTU1MDIyYmMiLCJpYXQiOjE2MzI3Mjg0MTIsImV4cCI6MTYzMzMyMjQxMn0.4Ww4eKt9PnEh1MH1RHGkLJWOtZyR1Yt7Zi06XcBf9d0
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logout:
 *                   type: boolean
 *                   description: Indicates whether the user has been logged out.
 *                   example: true
 *       400:
 *         description: Bad Request. Token is missing from the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token is required."
 *       401:
 *         description: Unauthorized. The token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid token."
 *       500:
 *         description: Internal server error or logout failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Logout failed."
 */
router.post('/logout', usersController.logout);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Retrieve a list of all registered users. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the user.
 *                   firstName:
 *                     type: string
 *                     description: User's first name.
 *                   lastName:
 *                     type: string
 *                     description: User's last name.
 *                   email:
 *                     type: string
 *                     description: User's email address.
 *                   role:
 *                     type: string
 *                     description: Role of the user (e.g., "user", "admin").
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time the user was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time the user was last updated.
 *               example:
 *                 - _id: "123456789012345678901234"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "johndoe@example.com"
 *                   role: "user"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   updatedAt: "2023-01-10T00:00:00.000Z"
 *       401:
 *         description: Unauthorized. The token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to retrieve users."
 */
router.get('/', usersController.getAllUsers);


/**
 * @swagger
 * /users/getUser:
 *   get:
 *     summary: Get a specific user
 *     tags:
 *       - Users
 *     description: Retrieve a user's details by their ID.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 _id: "123456789012345678901234"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 role: "user"
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 */
//Getting a specific user
router.get("/getUser", usersController.getUser);


/**
 * @swagger
 * /users/updateUser:
 *   put:
 *     summary: Update a user's information
 *     tags:
 *       - Users
 *     description: Update user details such as name, email, or phone number.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               userId: "123456789012345678901234"
 *               firstName: "Jane"
 *               lastName: "Smith"
 *               email: "jane.smith@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully."
 *       404:
 *         description: User not found.
 *       400:
 *         description: Bad Request. Input validation error.
 *       500:
 *         description: Internal server error.
 */
//Update an existing user
router.put("/updateUser", usersController.updateUser);


/**
 * @swagger
 * /users/deleteUser:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     description: Permanently delete a user by their ID.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully."
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
//Delete an existing user
router.delete("/deleteUser", usersController.deleteUser);


/**
 * @swagger
 * /users/reset:
 *   post:
 *     summary: Request a password reset
 *     tags:
 *       - Users
 *     description: Send a password reset request for a user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset request sent successfully.
 *       400:
 *         description: Invalid email address.
 *       500:
 *         description: Internal server error.
 */
//After hitting the reset button
router.post(`/reset`, usersController.postReset);


/**
 * @swagger
 * /users/reset/newPassword:
 *   post:
 *     summary: Reset a user's password
 *     tags:
 *       - Users
 *     description: Reset a password using a valid token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               token: "reset-token-example"
 *               newPassword: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully."
 *       400:
 *         description: Invalid token or password.
 *       500:
 *         description: Internal server error.
 */
//Getting a new password
router.post(`/reset/newPassword`, usersController.getNewPassword);


module.exports = router;