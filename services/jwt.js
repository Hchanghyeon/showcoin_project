import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import * as userModel from "../models/userModel.js";

// config.js에서 키값, 만료 값 가져오기
const { secretKey, expiresInSec } = config.jwt;

// 에러 메시지
const AUTH_ERROR = { message: "Authentication Error" };

// jwt accessToken 생성
export function createJwtToken(id) {
  return jwt.sign({ id }, secretKey, { expiresIn: expiresInSec });
}

// jwt refreshToken 생성
export function createRefreshToken() {
  return jwt.sign({}, secretKey, { expiresIn: "14d" });
}

// 쿠키 인증기반
export const isAuth = async (req, res, next) => {
  // 쿠키에서 accessToken 가져오기
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json(AUTH_ERROR);
  }
    // 쿠키에서 가져온 accessToken 인증
  jwt.verify(accessToken, secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userModel.findByUserId(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.userId; // req.customData
    next();
  });
};

// 쿠키 인증기반 로그인 처리만
export const isAuthShow = async (req, res, next) => {
  // 쿠키에서 accessToken 가져오기
  const { accessToken } = req.cookies;
  if (!accessToken) {
    req.userId = "";
    next();
  } else {
    // 쿠키에서 가져온 accessToken 인증
    jwt.verify(accessToken, secretKey, async (error, decoded) => {
      if (error) {
        return res.status(401).json(AUTH_ERROR);
      }
      const user = await userModel.findByUserId(decoded.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      req.userId = user.userId; // req.customData
      next();
    });
  }
};
