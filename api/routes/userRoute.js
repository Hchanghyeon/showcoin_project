
import express from "express";
import * as userControllers from "../controllers/userControllers.js";
import {isAuth} from "../../services/jwt.js";
const router = express.Router();


// 로그아웃 처리
router.get("/cookieClear",userControllers.cookieClear);

// 유저 로그인
router.post("/userLogin",userControllers.userLogin);

// 유저 등록
router.post("/register",userControllers.addUser);

// 유저 SMS 메시지 발송
router.post("/register/smsAuth", userControllers.smsAuth);

// 유저 인증번호 체크
router.post("/register/smsAuthCheck", userControllers.smsAuthCheck);

export default router;