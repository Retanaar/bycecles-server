import express from "express";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./libs/logging";
import http from "http";
import RouteBycecle from "./routes/bycecles";

const router = express();

console.log(config.mongo.url);
mongoose
  .connect(config.mongo.url, { w: "majority", retryWrites: true })
  .then(() => {
    Logging.log("Database connected");
    startServer();
  })
  .catch((error) => {
    Logging.error("Unable to connect");
    Logging.error(error);
  });

/** Start server if mangoose connected */
const startServer = () => {
  router.use((req, res, next) => {
    /** Log Request */
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      Logging.info(
        `Outcoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  /** Rules of our API */
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "PATCH, PUT, POST, GET, DELETE");
    if (req.method === "OPTION") {
      return res.status(200).json({});
    }
    next();
  });

  router.use("/bycecles", RouteBycecle);

  /** Healthcheck */
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "pong" })
  );
  /** Error Handling */
  router.use((req, res, next) => {
    const error = new Error("not found");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });
  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.log(`Server started on port: ${config.server.port}`)
    );
};
