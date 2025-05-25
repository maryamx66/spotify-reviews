import express from "express";
import db from "../model/index.js";

// Define an express router to define our controller's routes on
const controller = express.Router();

controller.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      error: "You are not logged in!",
    });
  }
  let user_reviews = await db.review.findMany({
    where: {
      user_id: req.user.user_data.id,
    },
    select: {
      id: true,
      spotify_id: true,
    },
  });
  return res.json(user_reviews);
});

// This route is to get a specifit review
controller.get("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      error: "You are not logged in!",
    });
  }
  let review = await db.review.findFirst({
    where: {
      id: Number(req.params.id),
      user_id: req.user.user_data.id,
    },
  });
  return res.json(review);
});

// this route is used to create a new review

controller.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      error: "You are not logged in!",
    });
  }
  let new_review = await db.review.create({
    data: {
      user_id: req.user.user_data.id,
      spotify_id: req.body.spotify_id,
      review_text: req.body.review_text,
      rating: req.body.rating,
    },
  });
  return res.json(new_review);
});

// This route is used to delete a review

controller.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      error: "You are not logged in!",
    });
  }
  let existing_review = await db.review.findFirst({
    where: {
      id: Number(req.params.id),
      user_id: req.user.user_data.id,
    },
  });
  if (!existing_review) {
    return res.status(404).json({
      status: 404,
      error: "Review not found!",
      ok: false,
    });
  }

  await db.review.delete({
    where: {
      id: existing_review.id,
    },
  });
  return res.json({
    ok: true,
  });
});

// This route is used to update/ edit an existing review
controller.put("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      error: "You are not logged in!",
    });
  }
  let existing_review = await db.review.findFirst({
    where: {
      id: Number(req.params.id),
      user_id: req.user.user_data.id,
    },
  });
  if (!existing_review) {
    return res.status(404).json({
      status: 404,
      error: "Review not found!",
      ok: false,
    });
  }
  let new_review = await db.review.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      review_text: req.body.review_text,
      rating: req.body.rating,
    },
  });
  return res.json(new_review);
});

export default controller;
