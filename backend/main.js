import * as fs from "fs";
import * as https from "https";
import express from "express";
import podcasts_controller from "./controller/podcasts.js";
import reviews_controller from "./controller/reviews.js";
import auth_controller from "./controller/auth.js";
import { auth_middleware } from "./utilities/auth_middleware.js";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(auth_middleware);
app.use(bodyParser.json());
app.use(auth_controller);
app.use("/podcasts", podcasts_controller);
app.use("/reviews", reviews_controller);

if (process.env.NODE_ENV === "production") {
  app.listen(8080, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Listening on http://127.0.0.1:8080");
    }
  });
} else {
  // Read cert and key
  const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  };

  // Create HTTPS server
  https.createServer(options, app).listen(8080, () => {
    console.log("HTTPS server running at https://localhost:8080");
  });
}
