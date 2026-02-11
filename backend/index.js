require("dotenv").config();
// const fetch = require("node-fetch");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const API_KEY = process.env.VIDEOSDK_API_KEY;
const API_SECRET = process.env.VIDEOSDK_API_SECRET;

// health check
app.get("/", (req, res) => {
  res.send("VideoSDK Backend is running 🚀");
});

// token generation API
app.get("/token", (req, res) => {
  try {
    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod"],
    };

    const token = jwt.sign(payload, API_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Token generation failed" });
  }
});

// Create Room
app.post("/room", async (req, res) => {
  try {
    console.log(req.headers.authorization);

    const response = await fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    res.json({ roomId: data.roomId });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Room creation failed" });
  }
});

// Validate Room
app.get("/room/validate/:roomId", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.videosdk.live/v2/rooms/validate/${req.params.roomId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    res.sendStatus(response.ok ? 200 : 400);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
