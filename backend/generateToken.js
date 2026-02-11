const dotenv = require("dotenv")
dotenv.config()

const jwt = require("jsonwebtoken");

const API_KEY = process.env.VIDEOSDK_API_KEY;
const API_SECRET = process.env.VIDEOSDK_TOKEN;

const payload = {
  apikey: API_KEY,
  permissions: ["allow_join", "allow_mod"], // optional
};

const token = jwt.sign(payload, API_SECRET, {
  expiresIn: "24h",
  algorithm: "HS256",
});

console.log(token);
