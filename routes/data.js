const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data');


/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get all data records
 *     tags:
 *       - Data
 *     description: This endpoint retrieves all the data records from the Data collection.
 *     responses:
 *       200:
 *         description: Successfully retrieved all data records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the data record.
 *                   name:
 *                     type: string
 *                     description: The name of the data record.
 *                   value:
 *                     type: string
 *                     description: The value associated with the data record.
 *       500:
 *         description: Failed to retrieve the data records. Possible issues with the token or data access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Could not get the data, please check if you passed the correct token"
 */
// Get all data
router.get('/', dataController.getAllData);


/**
 * @swagger
 * /data:
 *   post:
 *     summary: Get all data of a specific farm
 *     tags:
 *       - Data
 *     description: This endpoint retrieves all data records associated with a specific farm, identified by its serial number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The serial number of the farm to retrieve data for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the data for the specified farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the data record.
 *                   name:
 *                     type: string
 *                     description: The name of the data record.
 *                   value:
 *                     type: string
 *                     description: The value associated with the data record.
 *       404:
 *         description: Farm with the specified serial number not found or does not belong to the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Farm with this serialNumber was not found."
 *       500:
 *         description: Failed to retrieve the farm data due to an internal error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred retrieving the farm data."
 */
// Get all data of a specific farm
router.post('/', dataController.getFarmData);

// Handle manual control of devices
router.post('/manualControl', dataController.manualControl);

module.exports = router;