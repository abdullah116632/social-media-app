import express from "express";
import { login, register, generateSignature } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/generate-signature", generateSignature)

export default router;