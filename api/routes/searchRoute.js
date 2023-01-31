import express from "express";
import * as searchController from "../controllers/searchControllers.js";
import { isAuth, isAuthShow } from "../../services/jwt.js";

const router = express.Router();

// 네이버 검색량 순위 페이지
router.get("/", isAuthShow, searchController.getSearchPage);

export default router;
