const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cron = require("node-cron");
dotenv.config();

const errorHandler = require("./utils/error-handler");
const { initializeMQTT } = require("./services/mqtt");
const { checkPlantHealthByCamera } = require("./controllers/plants");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(errorHandler);
app.use(morgan("tiny"));

//Routes import
const userRoutes = require("./routes/users");
const farmRoutes = require("./routes/farms");
const dataRoutes = require("./routes/data");
const plantRoutes = require("./routes/plants");
const alertRoutes = require("./routes/alerts");
const notificationRoutes = require("./routes/notifications");
const farmsOwnershipsRoutes = require("./routes/farmOwnerships");

const { urlencoded } = require("express");

//Routes use
app.use("/users", userRoutes);
app.use("/farms", farmRoutes);
app.use("/data", dataRoutes);
app.use("/plants", plantRoutes);
app.use("/alerts", alertRoutes);
app.use("/notifications", notificationRoutes);
app.use("/farmsOwnerships", farmsOwnershipsRoutes);

// Schedule the checkPlantHealthByCamera function to run every 6 hours
// cron.schedule("*/1 * * * *", () => {
//   const req = {}, res = { status: () => ({ json: () => {} }) };
//   checkPlantHealthByCamera(req, res);
// });

const PORT = process.env.PORT || 3000;
const mongoDB = process.env.DB_URL;

//For deprecation warning - v1
mongoose.set("strictQuery", false);

//Database connection
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database was connected successfully!");
    // Initialize MQTT after the database connection is established
    //initializeMQTT();
  })
  .catch((err) => console.log(err));

//Server running
app.listen(PORT, () => {
  console.log(`Server is up and running!`);
});

// Call the checkPlantHealthByCamera function every 6 hours
//  const req = {}, res = {};
//  checkPlantHealthByCamera(req, res);
//  setInterval(checkPlantHealthByCamera, 6 * 60 * 60 * 1000);
