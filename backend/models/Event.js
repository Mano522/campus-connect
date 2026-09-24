const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;