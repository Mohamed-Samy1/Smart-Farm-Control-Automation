express = require("express");

const router = express.Router();

const itemsOwnershipsController = require('../controllers/items_ownerships');

//Adding Item
router.put('/changeItemOwner', itemsOwnershipsController.changeItemOwner);

//Get All Items
router.get('/', itemsOwnershipsController.getItemsOwnershipsHistory);

module.exports = router;