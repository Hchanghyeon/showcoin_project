import { config } from "../config/config.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import session from "express-session";

export async function smsAuth(userPhoneNum) {

  // 랜덤 인증 번호 6자리 생성하기
  let randomNum = '';
  for (let i = 0; i < 6; i++) {
    randomNum += Math.floor(Math.random() * 10)
  }

  // 모듈들을 불러오기. 오류 코드는 맨 마지막에 삽입 예정
  const finErrCode = 404;
  
  // 날짜 생성
  const date = Date.now().toString();

  // 환경변수로 저장했던 중요한 정보들 가져오기
  const serviceId = config.naver.serviceId;
  const secretKey = config.naver.secretKey;
  const accessKey = config.naver.accessKey;
  const my_number = config.naver.number;


  // 그 외 url 관련
  const method = "POST";
  const space = " ";
  const newLine = "\n";	
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
  const url2 = `/sms/v2/services/${serviceId}/messages`;

  // naver에 body를 보낼 때 암호화 해서 보내야하기 때문에 CryptoJS를 이용하여 암호화 시킨다
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);
  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64); // 암호화 시킨 데이터 string으로 변환


  // fetch를 사용하려했으나 네이버 예제가 axios로 되어있어 axios로 처리
  await axios({
    method: method,
    // request는 uri였지만 axios는 url이다
    url: url,
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": date,
      "x-ncp-iam-access-key": accessKey,
      "x-ncp-apigw-signature-v2": signature,
    },
    // request는 body였지만 axios는 data다
    data: {
      type: "SMS",
      countryCode: "82",
      from: my_number,
      // 원하는 메세지 내용
      content: `ShowCoin 회원가입 인증번호 [${randomNum}]`,
      messages: [
        // 신청자의 전화번호
        { to: `${userPhoneNum}` },
      ],
    },
  }).then((res) => {
      console.log("완료");
      
    }).catch((err) => {
      console.log(err);
    });

    return randomNum;
}
