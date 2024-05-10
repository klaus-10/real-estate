import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import router from "./router";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
const swaggerOutput = require("./docs/swagger_output.json");

require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGOURI, { dbName: "real-estate" })
  .then((res) => console.log("Connection Succesful"))
  .catch((err) => console.log("Error in DB connection", err));

app.use("/", router());

module.exports = app;
