import express from "express";
import * as communityControllers from "../controllers/communityControllers.js";
import {isAuth, isAuthShow} from "../../services/jwt.js";
const router = express.Router();

// /communit 경로로 들어오면 컨트롤러 연결
router.get("/", isAuthShow, communityControllers.getCommunity);
router.get("/detail/:boardNum", isAuthShow, communityControllers.getBoardDetail);

router.get("/boardform", isAuthShow, communityControllers.getBoardForm);
router.get("/boardupdateform/:boardNum", isAuthShow, communityControllers.getBoardUpdateForm);
router.post("/boardwrite", isAuthShow, communityControllers.BoardWrite);
router.put("/updateBoard/:boardNum", isAuthShow, communityControllers.updateBoard)
router.get("/updateLike/:boardNum", isAuthShow, communityControllers.updateLike)
router.delete("/deleteBoard/:boardNum", isAuthShow, communityControllers.deleteBoard)
router.put("/addComment/:boardNum", isAuthShow, communityControllers.addComment)

export default router;