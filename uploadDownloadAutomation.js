const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a single image
async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "automated_uploads",
      upload_preset: process.env.UPLOAD_PRESET,
    });
    console.log("Image uploaded successfully:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Function to download a single image
async function downloadImage(imageUrl, downloadPath) {
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

// Main function to automate the upload and download process for an array of images
async function automateImages(imagePaths) {
  try {
    const uploadedUrls = [];

    // Upload each image in the array
    for (const filePath of imagePaths) {
      const uploadedImageUrl = await uploadImage(filePath);
      uploadedUrls.push(uploadedImageUrl);
    }

    // Download each uploaded image
    for (const [index, imageUrl] of uploadedUrls.entries()) {
      const downloadPath = `downloaded_image_${index + 1}.jpg`; // Corrected with backticks
      await downloadImage(imageUrl, downloadPath);
      console.log(`Image downloaded successfully to: ${downloadPath}`); // Corrected with backticks
    }
  } catch (error) {
    console.error("Error in the automation process:", error);
  }
}

// Example usage: Array of image file paths
const imagePaths = [
  "inv3.png",
  "ug2.png",
  "ug1.png",
];

automateImages(imagePaths);
