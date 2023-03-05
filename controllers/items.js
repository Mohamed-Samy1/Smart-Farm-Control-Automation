
const { Item } = require("../models/item");

//Post a new general item
exports.addItem = async (req, res) => {
    let item = new Item({
      serialNumber: req.body.serialNumber,
      name: req.body.name,
      isIOT: req.body.isIOT,
      isPlant: req.body.isPlant,
      isDisabled: req.body.isDisabled,
      category: req.body.category
    });
    item = await item.save();

    if (!item) return res.status(400).send("This item cannot be created!");

    res.status(201).json({ item });
};

//Get All Items Details
exports.getEveryItem = async (req, res) => {
  const itemsList = await Item.find();

  if(!itemsList) {
    return res.status(500).json({ success: false });
  } 

  res.status(200).send(itemsList);
};

//Get a specific item by id
exports.getItem = async (req, res) => {
  const item = await Item.findById(req.params.id);;

  if (!item) {
    return res
      .status(404)
      .json({ message: "The item with the given serial number was not found!" });
  }
  res.status(200).send(item);
};

//Update an existing item by id
exports.updateItem = async (req, res) => {
  const itemExist = await Item.findById(req.params.id);
  if (!itemExist) {
    return res
      .status(404)
      .json({ message: "The item with the given ID was not found!" });
  }

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isIOT: req.body.isIOT,
      isPlant: req.body.isPlant,
      isDisabled: req.body.isDisabled,
      category: req.body.category
    },
    { new: true }
  );

  if (!item) return res.status(400).send("This item cannot be updated!");

  res.status(200).send(item);
};

//Delete an existing item by Id
exports.deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.id)
    .then((item) => {
      if (item) {
        return res
          .status(200)
          .json({ success: true, message: "the item was deleted sucessfully!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};
