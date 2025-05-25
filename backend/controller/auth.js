import express from "express";
import { create_jwt } from "../utilities/jwt.js";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.FRONTEND_URL;

const controller = express.Router();

controller.get("/login", (req, res) => {
  let scope =
    "user-read-private user-read-email user-library-read user-read-playback-position";

  let params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
});

controller.get("/callback", async (req, res) => {
  let auth_token = req.query.code;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      code: auth_token,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  });

  let response_data = await response.json();

  let user_req = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      authorization: `Bearer ${response_data.access_token}`,
    },
  });
  let user_data = await user_req.json();

  let payload = {
    user_data,
    tokens: {
      access_token: response_data.access_token,
      refresh_token: response_data.refresh_token,
    },
  };

  let token = create_jwt(payload);

  res.json({ token });
});

// this route is to check if the user's token is valid to return the logged in user's data
controller.get("/me", async (req, res) => {
  let user_res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      authorization: `Bearer ${req.user?.tokens.access_token}`,
    },
  });

  if (user_res.status !== 200) {
    return res.status(400).json({
      status: 400,
      error: "Invalid access token!",
    });
  }

  return res.json(req.user);
});

controller.get("/refresh", async (req, res) => {
  const token_response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      refresh_token: req.user?.tokens.refresh_token,
      grant_type: "refresh_token",
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  });

  if (token_response.status !== 200) {
    return res.status(400).json({
      status: 400,
      error: "Invalid token",
    });
  }

  let response_data = await token_response.json();
  let user_req = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      authorization: `Bearer ${response_data.access_token}`,
    },
  });
  let user_data = await user_req.json();

  let payload = {
    user_data,
    tokens: {
      access_token: response_data.access_token,
      refresh_token:
        response_data.refresh_token || req.user.tokens.refresh_token,
    },
  };

  let token = create_jwt(payload);
  return res.json({ token });
});

export default controller;
