express = require("express");
const router = express.Router();

const farmsOwnershipsController = require('../controllers/farms_ownerships');

/**
 * @swagger
 * /farms/changeFarmOwner:
 *   put:
 *     summary: Change the ownership of a farm
 *     tags:
 *       - FarmsOwnerships
 *     description: This endpoint allows changing the ownership of a farm by transferring it from the current owner to a new owner, based on the farm's serial number and the new owner's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The serial number of the farm.
 *                 example: "12345"
 *               newOwnerEmail:
 *                 type: string
 *                 description: The email of the new owner of the farm.
 *                 example: "newowner@example.com"
 *     responses:
 *       201:
 *         description: Successfully changed farm ownership.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 farmsOwnerships:
 *                   type: object
 *                   properties:
 *                     prevOwner_id:
 *                       type: string
 *                       description: The ID of the previous owner.
 *                     prevOwner_name:
 *                       type: string
 *                       description: The full name of the previous owner.
 *                     nextOwner_id:
 *                       type: string
 *                       description: The ID of the new owner.
 *                     nextOwner_name:
 *                       type: string
 *                       description: The full name of the new owner.
 *                     serialNumber:
 *                       type: string
 *                       description: The serial number of the farm.
 *       400:
 *         description: Failed to change farm ownership due to an error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Moving the farm ownership failed!"
 *       404:
 *         description: Farm or new owner not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The farm was not found!" 
 */
//Change farm ownership from one user to another 
router.put('/changeFarmOwner', farmsOwnershipsController.changeFarmOwner);


/**
 * @swagger
 * /farms/changeFarmOwner:
 *   put:
 *     summary: Change the ownership of a farm
 *     tags:
 *       - FarmsOwnerships
 *     description: This endpoint allows changing the ownership of a farm by transferring it from the current owner to a new owner, based on the farm's serial number and the new owner's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: The serial number of the farm.
 *                 example: "12345"
 *               newOwnerEmail:
 *                 type: string
 *                 description: The email of the new owner of the farm.
 *                 example: "newowner@example.com"
 *     responses:
 *       201:
 *         description: Successfully changed farm ownership.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 farmsOwnerships:
 *                   type: object
 *                   properties:
 *                     prevOwner_id:
 *                       type: string
 *                       description: The ID of the previous owner.
 *                     prevOwner_name:
 *                       type: string
 *                       description: The full name of the previous owner.
 *                     nextOwner_id:
 *                       type: string
 *                       description: The ID of the new owner.
 *                     nextOwner_name:
 *                       type: string
 *                       description: The full name of the new owner.
 *                     serialNumber:
 *                       type: string
 *                       description: The serial number of the farm.
 *       400:
 *         description: Failed to change farm ownership due to an error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Moving the farm ownership failed!"
 *       404:
 *         description: Farm or new owner not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The farm was not found!" 
 */
//Get All Items
router.get('/', farmsOwnershipsController.getFarmsOwnershipsHistory);

module.exports = router;