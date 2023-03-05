const { ItemsOwnerships } = require("../models/items_ownerships");
const { Item } = require('../models/item');
const { User } = require("../models/user");

exports.changeItemOwner = async (req, res) => {
  
  //find the item with provided serial number
  const item = await Item.findOne({ serialNumber: req.body.serialNumber });

  if(!item) {
    return res
      .status(404)
      .json({message: "No item with this serial number was found!"});
  }
  // find the current owner of the item using item id
  const previousOwner = await User.findOne( { "farms.farmItems._id": item._id } );
  
  if (!previousOwner) {
    return res
      .status(404)
      .json({message: "The item owner was not found!"});
  }

  // find the next owner using his email
  const nextOwner = await User.findOne({ email: req.body.newOwnerEmail });

  if (!nextOwner) {
    return res
      .status(404)
      .json( { message: "Couldn't find the new owner using email!" } );
  }

  //Check if there is a farm with this offical number
  let userFarms = nextOwner.farms;
  let farmExist = userFarms.find(f => f.officalNumber === req.body.officalNumber);

  if (!farmExist) {
    return res
      .status(404)
      .send("This farm offical number was not found!");
    }

  //Delete the item from the farm
  User.findOneAndUpdate(
    { _id: previousOwner._id }, 
    { $pullAll: { 
      "farms.$[].farmItems": [{ _id: item._id }] 
    } }
  ).exec();

  const ItemAddedID = { _id: item._id };

  //Add the item to the farm
  User.findOneAndUpdate(
    { email: req.body.newOwnerEmail }, 
    { $push: { "farms.$[].farmItems": ItemAddedID } }
  ).exec();

  // Add the information to items ownerships collection
  const newOwnerName = nextOwner.firstName + " " + nextOwner.lastName;
  const prevOwnerName = previousOwner.firstName + " " + previousOwner.lastName;

  let itemOwnerships = new ItemsOwnerships({
    item_id: item._id,
    item_serialNumber: req.body.serialNumber,
    nextOwner_id: nextOwner._id,
    nextOwner_name: newOwnerName,
    prevOwner_id : previousOwner._id,
    prevOwner_name: prevOwnerName,
    farm_officalNumber: req.body.officalNumber
  });

  //Add the record to the database
  itemOwnerships = await itemOwnerships.save();

  if (!itemOwnerships) return res.status(400).send("Moving the item ownership failed!");

  res.status(201).json({ itemOwnerships });
};

exports.getItemsOwnershipsHistory = async (req, res) => {
  const itemsOwnershipsList = await ItemsOwnerships.find();

  if(!itemsOwnershipsList) {
    return res.status(500).json({ success: false });
  } 

  res.status(200).send(itemsOwnershipsList);
};