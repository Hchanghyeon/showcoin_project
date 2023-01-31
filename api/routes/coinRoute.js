import express from "express";
import * as coinControllers from "../controllers/coinControllers.js";
import { isAuth, isAuthShow } from "../../services/jwt.js";
const router = express.Router();

router.get("/", isAuthShow, coinControllers.getCoin);
router.get("/getAllCoin", isAuthShow, coinControllers.getAllCoin);

export default router;
