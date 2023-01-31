import fetch from "node-fetch";
import * as coinModel from '../models/coinModel.js';

const client_id = ""; // API 요청 ID
const client_secret = ""; // API 요청 비밀 키
const api_url = "https://openapi.naver.com/v1/datalab/search"; // API 요청 주소


// 오늘 날짜 구하는 메서드
function getToday() {
  let d = new Date();
  return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}


// 한달 전 날짜 구하는 메서드
function getMonthAgo() {
  let now = new Date();
  let d = new Date(now.setMonth(now.getMonth() - 3));	// 한달 전
  return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());

}

// 한달 전 날짜
let startDate = getMonthAgo();
// 오늘 날짜
let endDate = getToday();
let request_body = '';

// NaverAPI로 보낼 Request Body 세팅
export function readyToSend(item) {
  request_body = {
    startDate, // 시작날짜
    endDate, // 종료날짜 
    timeUnit: "month", // 달 기준으로
    keywordGroups: [
      {
        groupName: item,  // 검색할 그룹 이름
        keywords: [item],  // 검색할 키워드
      },
    ],
  };
}

// NaverAPI로 요청
export async function requestData() {
  let options = { // Request 요청 option 설정
    method: "POST",
    body: JSON.stringify(request_body),
    headers: {
      "X-Naver-Client-Id": client_id, // naver ID
      "X-Naver-Client-Secret": client_secret, // naver key
      "Content-Type": "application/json", // json 형식으로
    },
  };
  let data = await fetch(api_url, options); // 요청
  data = await data.json(); // 받아온 데이터 json으로 변환
  return data;
}
