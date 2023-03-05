express = require("express");

const router = express.Router();

const farmsOwnershipsController = require('../controllers/farms_ownerships');

//Changging farm owner (Uncorrect behaviour)
router.put('/changeFarmOwner', farmsOwnershipsController.changeFarmOwner);

//Get All Items
router.get('/', farmsOwnershipsController.getFarmsOwnershipsHistory);

module.exports = router;