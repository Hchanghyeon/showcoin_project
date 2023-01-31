import * as userModel from "../../models/userModel.js";
import * as naverSmsApi from "../../services/naverSmsApi.js";
import { createJwtToken, createRefreshToken } from "../../services/jwt.js";
import bcrypt from "bcrypt";
import { config } from "../../config/config.js";

const { saltRounds } = config.bcrypt;

// 로그아웃 처리(사용자가 가진 쿠키 삭제하기)
export async function cookieClear(req, res) {
  res.clearCookie("accessToken");
  res.redirect("/");
}

// 회원가입 처리(사용자 등록)
export async function addUser(req, res) {
  const user = req.body;
  try {
    const hashed = await bcrypt.hash(user.userPassword, parseInt(saltRounds));
    user.userPassword = hashed;
    userModel.addUser(user);
    res.json({ user: "login" });
  } catch (e) {
    console.log(e);
    res.json({ user: "error" });
  }
}

// SMS 발송 로직
export async function smsAuth(req, res) {
  const userPhone = req.body;
  // SMS 발송 후 인증번호를 리턴 받기
  const AuthNum = await naverSmsApi.smsAuth(userPhone.phoneNum);
  // 리턴받은 인증번호를 세션에 저장
  req.session.AuthNum = AuthNum;
  // 저장한 세션을 179초(약 3분) 뒤 날리기
  setTimeout(() => {
    req.session.destroy();
  }, 179000);

  // 그냥 답장 용
  res.json({ AuthNum: "전송성공" });
}

// 사용자가 인증번호를 입력해서 제출 버튼 눌렀을 때
export async function smsAuthCheck(req, res) {
  const { num } = req.body;
  // 만약 세션이 있다면
  if (req.session.AuthNum) {
    // 비교해서 성공 실패 알려주기
    req.session.AuthNum === num
      ? res.json({ OK: "success" })
      : res.json({ OK: "fail" });
  } else {
    // 없어도 실패
    res.json({ OK: "fail" });
  }
}

// 사용자 로그인 로직
export async function userLogin(req, res) {
  const { userId, userPassword } = req.body;
  const user = await userModel.findByUserId(userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(userPassword, user.userPassword);
  if (!isValidPassword) {
    return res.status(401).json({ message: " Invalid user or password" });
  }
  const accessToken = createJwtToken(user.userId);
  // httpOnly는 보안때문에 설정 / 쿠키 시간은 1시간
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });
  res.status(200).json({ message: "성공" });
}
