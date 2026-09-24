require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Event = require("./models/Event");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MONGODB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection Error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/events", async (req, res) => {
  const newEvent = req.body;

  if (!newEvent || !newEvent.title || !newEvent.category) {
    return res.status(400).json({
      message: "Title and category are required",
    });
  }

  try {
    const payload = {
      id: typeof newEvent.id === "number" ? newEvent.id : Date.now(),
      title: newEvent.title,
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
    };

    const savedEvent = await Event.create(payload);

    res.status(201).json({
      message: "Event added successfully",
      event: savedEvent,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  const eventId = Number(req.params.id);

  if (Number.isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    const deletedEvent = await Event.findOneAndDelete({ id: eventId });

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  const eventId = Number(req.params.id);

  if (Number.isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { id: eventId },
      { ...req.body, id: eventId },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    res.json({
      message: "Event Updated Successfully!!",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});