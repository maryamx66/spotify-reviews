import express from "express";

// Define an express router to define our controller's routes on
const controller = express.Router();

// GET - User's podcasts
controller.get("/", async (req, res) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(400).json({
      status: 400,
      error: "Invalid authorization token!",
    });
  }

  // Make request to Spotify API
  let api_response = await fetch("https://api.spotify.com/v1/me/shows", {
    headers: {
      authorization: `Bearer ${req.user.tokens.access_token}`,
    },
  });

  let api_data = await api_response.json();
  if (api_data.error) {
    // Forward the error from Spotify API
    return res.status(api_response.status).json(api_data.error);
  }

  // Forward "items" from Spotify API response
  // In addition to items, spotify returns extra
  // information about how many podcasts user has, etc
  // We "remove" those by only returning the shows array
  return res.json(api_data.items);
});

export default controller;
