const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alerts');

// Add alert
router.post('create/:farm_id', alertController.addAlert);

// Get alert by ID
router.get('/:id', alertController.getAlertById);

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get all unacknowledged alerts
router.get('/unacknowledged', alertController.getUnacknowledgedAlerts);

// Get all acknowledged alerts
router.get('/acknowledged', alertController.getAcknowledgedAlerts);

// Delete alert by ID
router.delete('/:id', alertController.deleteAlertById);

module.exports = router;


/*

1-  Login                                                                                                 DONE
2-  Register                                                                                              DONE
3-  endpoint <---- Array of objects of all farms of the user includes  (name, number of plants)           DONE
4-  Add Farm ----> farm name, farm type, serial number                                                    DONE 
6-  endpoint <---- All sensors data of the farm (by farm serial number from body)                         DONE
7-  endpoint <---- Object of name of the plant, and harvest date                                          DONE 
8-  Add Plant to farm (farm ID and plant ID)                                                              DONE


--------------------------------------

1) get user ---> recieve token instead of user ID in params.                                              DONE
2) change all function to recieve tokens instead of user ID in params                                     DONE
3) User will add the name of the farm after purchase                                                      DONE  
4) Modify plants controller
*/