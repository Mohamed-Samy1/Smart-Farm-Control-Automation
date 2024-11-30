const express = require('express');
const router = express.Router();

const farmsController = require('../controllers/farms');

/**
 * @swagger
 * /farms:
 *   post:
 *     summary: Create a new farm
 *     tags:
 *       - Farms
 *     description: Create a new farm using the provided serial number and type. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The unique serial number for the farm.
 *                 example: "12345-ABC"
 *               type:
 *                 type: string
 *                 description: The type of farm (e.g., "organic", "hydroponic").
 *                 example: "organic"
 *     responses:
 *       201:
 *         description: Farm created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Farm created successfully"
 *                 farm:
 *                   type: object
 *                   properties:
 *                     serialNumber:
 *                       type: string
 *                       description: The unique serial number of the farm.
 *                     type:
 *                       type: string
 *                       description: The type of farm.
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the farm.
 *                   example:
 *                     serialNumber: "12345-ABC"
 *                     type: "organic"
 *                     _id: "647c3f2e6cfd220013e430d3"
 *       401:
 *         description: Unauthorized. The token is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing token."
 *       400:
 *         description: Bad request. Input validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Serial number and type are required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
// Create a new farm
router.post('/', farmsController.createNewFarm);


/**
 * @swagger
 * /farms/getFarmBySerialNumber:
 *   get:
 *     summary: Get a farm by serial number
 *     tags:
 *       - Farms
 *     description: Retrieve a farm by its serial number. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *       - in: query
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345-ABC"
 *         description: The serial number of the farm to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique ID of the farm.
 *                 serialNumber:
 *                   type: string
 *                   description: The serial number of the farm.
 *                 type:
 *                   type: string
 *                   description: The type of the farm.
 *                 plants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the plant.
 *                       name:
 *                         type: string
 *                         description: The name of the plant.
 *                       life_cycle:
 *                         type: string
 *                         description: The life cycle stage of the plant.
 *               example:
 *                 _id: "647c3f2e6cfd220013e430d3"
 *                 serialNumber: "12345-ABC"
 *                 type: "organic"
 *                 plants:
 *                   - _id: "647c3f2e6cfd220013e430d4"
 *                     name: "Tomato"
 *                     life_cycle: "vegetative"
 *                   - _id: "647c3f2e6cfd220013e430d5"
 *                     name: "Cucumber"
 *                     life_cycle: "fruiting"
 *       404:
 *         description: Farm not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Farm not found."
 *       401:
 *         description: Unauthorized. The token is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get farm."
 */
// Get a farm by ID
router.get('/getFarmBySerialNumber', farmsController.getFarmBySerialNumber);


/**
 * @swagger
 * /farms:
 *   get:
 *     summary: Get all farms
 *     tags:
 *       - Farms
 *     description: Retrieve a list of all farms. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of farms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the farm.
 *                   serialNumber:
 *                     type: string
 *                     description: The serial number of the farm.
 *                   type:
 *                     type: string
 *                     description: The type of the farm.
 *                   plants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique identifier of the plant.
 *                         name:
 *                           type: string
 *                           description: The name of the plant.
 *                         life_cycle:
 *                           type: string
 *                           description: The life cycle stage of the plant.
 *               example:
 *                 - _id: "647c3f2e6cfd220013e430d3"
 *                   serialNumber: "12345-ABC"
 *                   type: "organic"
 *                   plants:
 *                     - _id: "647c3f2e6cfd220013e430d4"
 *                       name: "Tomato"
 *                       life_cycle: "vegetative"
 *                     - _id: "647c3f2e6cfd220013e430d5"
 *                       name: "Cucumber"
 *                       life_cycle: "fruiting"
 *                 - _id: "647c3f2e6cfd220013e430d6"
 *                   serialNumber: "67890-DEF"
 *                   type: "hydroponic"
 *                   plants:
 *                     - _id: "647c3f2e6cfd220013e430d7"
 *                       name: "Lettuce"
 *                       life_cycle: "seedling"
 *                     - _id: "647c3f2e6cfd220013e430d8"
 *                       name: "Basil"
 *                       life_cycle: "vegetative"
 *       401:
 *         description: Unauthorized. The token is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get farms."
 */
// Get all farms [ In General ]
router.get('/', farmsController.getAllFarms);


/**
 * @swagger
 * /farms/updateFarmOfUser:
 *   put:
 *     summary: Update a farm by serial number
 *     tags:
 *       - Farms
 *     description: Update the details of a farm in the user's farms array by providing the serial number. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The serial number of the farm to update.
 *                 example: "12345-ABC"
 *               type:
 *                 type: string
 *                 description: The new type of the farm.
 *                 example: "organic"
 *               sensors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of sensor identifiers for the farm.
 *                 example: ["sensor1", "sensor2"]
 *               plants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the plant.
 *                       example: "647c3f2e6cfd220013e430d4"
 *                     name:
 *                       type: string
 *                       description: The name of the plant.
 *                       example: "Tomato"
 *                     life_cycle:
 *                       type: string
 *                       description: The life cycle stage of the plant.
 *                       example: "vegetative"
 *                 description: List of plants in the farm.
 *               isDisabled:
 *                 type: boolean
 *                 description: Whether the farm is disabled.
 *                 example: false
 *     responses:
 *       200:
 *         description: Farm updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Farm updated successfully."
 *       404:
 *         description: Farm not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Farm not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update farm."
 */
// Update a farm by ID
router.put('/updateFarmOfUser', farmsController.updateFarmOfUser);


/**
 * @swagger
 * /farms/deleteFarmFromUser:
 *   delete:
 *     summary: Delete a farm by serial number
 *     tags:
 *       - Farms
 *     description: Delete a farm from the user's farms array by providing the serial number. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The serial number of the farm to delete.
 *                 example: "12345-ABC"
 *     responses:
 *       200:
 *         description: Farm deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Farm deleted successfully."
 *       404:
 *         description: Farm not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Farm not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete farm."
 */
// Delete a farm by ID
router.delete('/deleteFarmFromUser', farmsController.deleteFarmFromUser);


/**
 * @swagger
 * /farms/addFarmToUser:
 *   put:
 *     summary: Add a farm to a user
 *     tags:
 *       - Farms
 *     description: Add a farm to a user's list using the farm serial number. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The serial number of the farm to add.
 *                 example: "12345-ABC"
 *               name:
 *                 type: string
 *                 description: The name to assign to the farm.
 *                 example: "GreenField"
 *     responses:
 *       200:
 *         description: Farm successfully added to the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Farm added to user"
 *       400:
 *         description: Farm is either already assigned to another user or already added to this user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     farm_assigned: 
 *                       value: "Farm already assigned to another user"
 *                     farm_added: 
 *                       value: "Farm already added to user"
 *       404:
 *         description: Farm not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Farm not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
//Add Farm to user
router.put('/addFarmToUser', farmsController.addFarmToUser);


/**
 * @swagger
 * /farms/getEverythingAboutUserFarms:
 *   get:
 *     summary: Retrieve all farms associated with the authenticated user
 *     tags:
 *       - Farms
 *     description: Returns all farms linked to the user, along with their names, plants, and the total number of farms. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's farms and their details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 farms:
 *                   type: array
 *                   description: List of farms associated with the user.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the farm.
 *                       serialNumber:
 *                         type: string
 *                         description: Serial number of the farm.
 *                       name:
 *                         type: string
 *                         description: Name of the farm.
 *                       plants:
 *                         type: array
 *                         description: List of plants in the farm.
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Name of the plant.
 *                             plant_count:
 *                               type: integer
 *                               description: Number of plants in this category.
 *                 farms_count:
 *                   type: integer
 *                   description: Total number of farms associated with the user.
 *               example:
 *                 farms:
 *                   - _id: "123456789012345678901234"
 *                     serialNumber: "12345-ABC"
 *                     name: "GreenField"
 *                     plants:
 *                       - name: "Tomato"
 *                         plant_count: 30
 *                       - name: "Cucumber"
 *                         plant_count: 20
 *                   - _id: "987654321098765432109876"
 *                     serialNumber: "67890-XYZ"
 *                     name: "BlueField"
 *                     plants:
 *                       - name: "Pepper"
 *                         plant_count: 15
 *                 farms_count: 2
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get farms."
 */
// Take the user token, send back all his farms, names of this farms, plants included in those farms
router.get('/getEverythingAboutUserFarms', farmsController.getEverythingAboutUserFarms);

module.exports = router;