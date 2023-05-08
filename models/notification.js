const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: String,
  isRead: Boolean
}, { timestamps: true });

exports.Notification = mongoose.model("Notification", notificationSchema);
exports.notificationSchema = notificationSchema;