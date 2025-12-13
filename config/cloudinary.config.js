const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
  console.log("Connected to Cloudinary");
};

module.exports = connectCloudinary;
