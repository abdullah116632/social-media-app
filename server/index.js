import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

//securty packges
import helmet from "helmet";
import dbConnection from "./config/dbConfig.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));


const app = express();

// Serve files from the views directory
app.use(express.static(path.join(__dirname, "views")));

// app.use((req, res, next) => {
//   console.log(`Request for: ${req.url}`);  // Logs the URL being requested
//   next(); // Passes control to the next middleware or route
// });

const PORT = process.env.PORT || 8800;

dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});