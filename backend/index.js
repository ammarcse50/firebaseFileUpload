const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

// MongoDB connection
const url =
  "mongodb+srv://upload:upload@cluster0.t9lecvs.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Define Mongoose schema
const userSchema = new mongoose.Schema({
  imgUrl: {
    type: String, // URL for the image
    required: true
 
  },
  videoUrl: {
    type: String, // URL for the video
    required:true
  },
});

// Create Mongoose model
const FileModel = mongoose.model("UploadTest", userSchema);

// POST route to upload files
app.post("/fileUpload", async (req, res) => {
  try {
    const { imgUrl, videoUrl } = req.body;
    
    console.log(imgUrl);
    // // Validate incoming data
    // if (!imgUrl || !videoUrl) {
    //   return res.status(400).json({ error: "Image and video URLs are required" });
    // }

    // Create new document
    await FileModel.create({ imgUrl, videoUrl });


    // Respond with success
    res.status(201).json({ message: "Files uploaded successfully", newFile });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload files", details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
