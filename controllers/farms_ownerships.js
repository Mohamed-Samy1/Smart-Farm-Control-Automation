const { FarmsOwnerships } = require('../models/farms_ownerships');
const { User } = require('../models/user');

exports.changeFarmOwner = async (req, res) => {

  // find the current owner of the farm using farm offical number
  const previousOwner = await User.findOne( { "farms.officalNumber": req.body.officalNumber } );
  
  if (!previousOwner) {
    return res
      .status(404)
      .json({ message: "The farm was not found!"} );
  }

  // find the next owner using his email
  const nextOwner = await User.findOne({ email: req.body.newOwnerEmail });

  if (!nextOwner) {
    return res
      .status(404)
      .json( { message: "Couldn't find the new owner using email!" } );
  }

  //Delete the farm from userfarms
  const previousOwnerFarmsBefore = previousOwner.farms;
  let previousOwnerFarmsAfter = previousOwnerFarmsBefore.filter(f => f.officalNumber !== req.body.officalNumber);
  let farmToBeAddedToTheUser = previousOwnerFarmsBefore.filter(f => f.officalNumber === req.body.officalNumber);

  User.findOneAndUpdate(
    { _id: previousOwner._id }, 
    { farms: previousOwnerFarmsAfter }
    ).exec();

  //Add farm to the new owner
  User.findOneAndUpdate(
    { _id: nextOwner._id },
    { $push: { farms: farmToBeAddedToTheUser } },
  ).exec();

  // Add the information to items ownerships collection
  const newOwnerName = nextOwner.firstName + " " + nextOwner.lastName;
  const prevOwnerName = previousOwner.firstName + " " + previousOwner.lastName;

  let farmsOwnerships = new FarmsOwnerships({
    prevOwner_id: previousOwner._id,
    prevOwner_name: prevOwnerName,
    nextOwner_id:nextOwner._id,
    nextOwner_name: newOwnerName,
    farm_officalNumber: req.body.officalNumber
  });

  //Add the record to the database
  farmsOwnerships = await farmsOwnerships.save();

  if (!farmsOwnerships) return res.status(400).send("Moving the farm ownership failed!");

  res.status(201).json({ farmsOwnerships });
}

exports.getFarmsOwnershipsHistory = async (req, res) => {
  const farmsOwnershipsList = await FarmsOwnerships.find();

  if(!farmsOwnershipsList) {
    return res.status(500).json({ success: false });
  } 

  res.status(200).send(farmsOwnershipsList);
};

  
  

