express = require("express");

const router = express.Router();

const itemsController = require('../controllers/items');

//Adding Item
router.post('/addItem', itemsController.addItem);

//Get Specific Item
router.get('/:id', itemsController.getItem);

//Update a Specific Item
router.put('/:id', itemsController.updateItem);

//Delete a Specific Item
router.delete('/:id', itemsController.deleteItem);

//Get All Items
router.get('/', itemsController.getEveryItem);

module.exports = router;