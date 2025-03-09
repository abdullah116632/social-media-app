import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { basicSearch } from "../controllers/search.js";

const router = express.Router();

router.get("/", userAuth, basicSearch);

export default router;