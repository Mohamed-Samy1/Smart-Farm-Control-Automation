const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants');


/**
 * @swagger
 * /plants:
 *   post:
 *     summary: Add a new plant
 *     tags:
 *       - Plants
 *     description: Creates a new plant in the system. This endpoint requires authentication using a Bearer token.
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
 *               name:
 *                 type: string
 *                 description: Name of the plant.
 *               life_cycle:
 *                 type: string
 *                 description: Life cycle of the plant (e.g., annual, biennial, perennial).
 *             required:
 *               - name
 *               - life_cycle
 *             example:
 *               name: "Tomato"
 *               life_cycle: "Annual"
 *     responses:
 *       201:
 *         description: Successfully added a new plant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the plant.
 *                 name:
 *                   type: string
 *                   description: Name of the plant.
 *                 life_cycle:
 *                   type: string
 *                   description: Life cycle of the plant.
 *               example:
 *                 _id: "123456789012345678901234"
 *                 name: "Tomato"
 *                 life_cycle: "Annual"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to add plant."
 */
// Add a new plant
router.post('/', plantsController.addPlant);


/**
 * @swagger
 * /plants/{id}:
 *   delete:
 *     summary: Delete a plant by ID
 *     tags:
 *       - Plants
 *     description: Deletes a plant from the system by its ID. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plant to delete.
 *         schema:
 *           type: string
 *           example: "60b8d295b16b92f8b3c3f827"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *     responses:
 *       200:
 *         description: Successfully deleted the plant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plant deleted successfully."
 *       404:
 *         description: Plant not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Plant not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete plant."
 */
// Delete a plant by ID
router.delete('/:id', plantsController.deletePlant);


/**
 * @swagger
 * /plants/{id}:
 *   put:
 *     summary: Update a plant by ID
 *     tags:
 *       - Plants
 *     description: Updates the details of a plant in the system by its ID. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plant to update.
 *         schema:
 *           type: string
 *           example: "60b8d295b16b92f8b3c3f827"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *       - in: body
 *         name: plant
 *         required: true
 *         description: The plant object to update.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Tomato"
 *             life_cycle:
 *               type: string
 *               example: "Annual"
 *     responses:
 *       200:
 *         description: Successfully updated the plant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The updated plant's ID.
 *                 name:
 *                   type: string
 *                   description: The updated name of the plant.
 *                 life_cycle:
 *                   type: string
 *                   description: The updated life cycle of the plant.
 *       404:
 *         description: Plant not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Plant not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update plant."
 */
// Update a plant by ID
router.put('/:id', plantsController.updatePlant);


/**
 * @swagger
 * /plants/getPlantByFarmAndName:
 *   post:
 *     summary: Get a plant by farm serial number and plant name
 *     tags:
 *       - Plants
 *     description: Retrieve a specific plant from a farm based on the farm's serial number and the plant's name. This endpoint requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token to authorize the request. Use the format 'Bearer <token>'."
 *       - in: body
 *         name: request
 *         required: true
 *         description: The details of the farm and plant to search for.
 *         schema:
 *           type: object
 *           properties:
 *             serialNumber:
 *               type: string
 *               example: "ABC123"
 *               description: "The serial number of the farm where the plant is located."
 *             plantName:
 *               type: string
 *               example: "Tomato"
 *               description: "The name of the plant to search for within the specified farm."
 *     responses:
 *       200:
 *         description: Successfully retrieved the plant details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the plant.
 *                   example: "Tomato"
 *                 life_cycle:
 *                   type: string
 *                   description: The life cycle of the plant.
 *                   example: "Annual"
 *                 plant_count:
 *                   type: integer
 *                   description: The number of plants of this type in the farm.
 *                   example: 150
 *                 harvest_date:
 *                   type: string
 *                   description: The harvest date of the plant.
 *                   example: "2024-06-01"
 *       404:
 *         description: Plant or farm not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Plant not found in the farm."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get plant."
 */
// Get a plant by ID
router.post('/getPlantByFarmAndName', plantsController.getPlantByFarmAndName);


/**
 * @swagger
 * /plants/addPlantToFarm:
 *   post:
 *     summary: Add a plant to a farm
 *     tags:
 *       - Plants
 *     description: Add a specified plant to a user's farm, including the plant count and automatically calculating the harvest date based on the plant's life cycle. Requires authentication using a Bearer token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token for authorization. Use the format 'Bearer <token>'."
 *       - in: body
 *         name: request
 *         required: true
 *         description: The details of the farm and plant to be added.
 *         schema:
 *           type: object
 *           properties:
 *             serialNumber:
 *               type: string
 *               example: "ABC123"
 *               description: "The serial number of the farm to which the plant will be added."
 *             plantName:
 *               type: string
 *               example: "Tomato"
 *               description: "The name of the plant to add to the farm."
 *             plant_count:
 *               type: integer
 *               example: 100
 *               description: "The number of plants to add to the farm."
 *     responses:
 *       200:
 *         description: Successfully added the plant to the farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated farm.
 *                 plants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the plant added to the farm.
 *                       plant_count:
 *                         type: integer
 *                         description: The number of plants added to the farm.
 *                       plant_health:
 *                         type: object
 *                         properties:
 *                           harvest_date:
 *                             type: string
 *                             description: The calculated harvest date for the plants.
 *                             example: "2024-06-01T00:00:00.000Z"
 *       404:
 *         description: Farm or plant not found.
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
 *                   example: "Failed to add plant to farm."
 */
// Add plant to user farm
router.post('/addPlantToFarm', plantsController.addPlantToFarm);


/**
 * @swagger
 * /plants/getPlantsAndHarvestDates:
 *   get:
 *     summary: Get plant names and harvest dates for a specific farm
 *     tags:
 *       - Plants
 *     description: Retrieve an array of plant names along with their respective harvest dates for a specific farm, based on the farm's serial number. Requires authentication via JWT token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token for authentication. Use the format 'Bearer <token>'."
 *       - in: body
 *         name: request
 *         required: true
 *         description: The serial number of the farm for which the plant details are requested.
 *         schema:
 *           type: object
 *           properties:
 *             serialNumber:
 *               type: string
 *               example: "ABC123"
 *               description: "The serial number of the farm whose plant data is requested."
 *     responses:
 *       200:
 *         description: Successfully retrieved an array of plants with names and harvest dates for the farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the plant.
 *                   harvest_date:
 *                     type: string
 *                     description: The calculated harvest date for the plant.
 *                     example: "2024-06-01T00:00:00.000Z"
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
 *                   example: "Failed to get plants and harvest dates."
 */
// get an array of objects of plants (names), and harvest date of each plant in a specific farm
router.get('/getPlantsAndHarvestDates', plantsController.getPlantsAndHarvestDates);


/**
 * @swagger
 * /plants/getAllPlantNames:
 *   get:
 *     summary: Get all plant names
 *     tags:
 *       - Plants
 *     description: Retrieve a list of all plant names in the database. The response will only include the plant names.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token for authentication. Use the format 'Bearer <token>'."
 *     responses:
 *       200:
 *         description: Successfully retrieved all plant names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the plant.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get plant names."
 */
// GET ALL PLANTS (NAMES ONLY)
router.get('/getAllPlantNames', plantsController.getAllPlantNames);


/**
 * @swagger
 * /plants/getAllPlantsByFarm:
 *   post:
 *     summary: Get all plants in a specific farm
 *     tags:
 *       - Plants
 *     description: Retrieve all plants in a specific farm by farm serial number, along with their name, count, and harvest date.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: "JWT token for authentication. Use the format 'Bearer <token>'."
 *       - in: body
 *         name: serialNumber
 *         description: The serial number of the farm for which you want to retrieve plants.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             serialNumber:
 *               type: string
 *               example: "FARM12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved all plants in the farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the plant.
 *                   plant_count:
 *                     type: integer
 *                     description: The count of the plant in the farm.
 *                   harvest_date:
 *                     type: string
 *                     format: date
 *                     description: The harvest date of the plant.
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
 *                   example: "Failed to get plants."
 */
// getAllPlantsByFarm
router.post('/getAllPlantsByFarm', plantsController.getAllPlantsByFarm);


/**
 * @swagger
 * /plants/checkPlantHealthByCamera:
 *   get:
 *     summary: Check plant health using the camera
 *     tags:
 *       - Plants
 *     description: This endpoint checks the health of plants in all farms by analyzing camera data and making predictions based on the most recent machine predictions. If any farm has a plant marked as "dead", it will be updated in the system.
 *     responses:
 *       200:
 *         description: Successfully checked plant health and updated farms with unhealthy plants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plant health checked successfully"
 *       500:
 *         description: Internal server error while checking plant health.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error checking health."
 */
// Check the plant health using the camera
router.get('/checkPlantHealthByCamera', plantsController.checkPlantHealthByCamera);


/**
 * @swagger
 * /plants/getArrayOfFarmsWithInfoForUser:
 *   get:
 *     summary: Get an array of farms with their plants' information for a user
 *     tags:
 *       - Plants
 *     description: This endpoint retrieves an array of objects containing the serial number, plant names, and plant count for each farm that the user owns.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's farms and their plant information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   serialNumber:
 *                     type: string
 *                     description: The serial number of the farm.
 *                     example: "12345"
 *                   name:
 *                     type: string
 *                     description: The name of the plant in the farm.
 *                     example: "Tomato"
 *                   plant_count:
 *                     type: integer
 *                     description: The number of plants in the farm.
 *                     example: 50
 *       500:
 *         description: Internal server error while retrieving farm data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get farms data of the user."
 */
/* 
Get an array of objects that has the following:
1) serialNumber of each farm the user has
2) name of each plant in these farms
3) plant_count of each plant in these farms
*/
router.get('/getArrayOfFarmsWithInfoForUser', plantsController.getArrayOfFarmsWithInfoForUser);

module.exports = router;