import Mongoose from "mongoose";

const { Schema } = Mongoose;

// naver에서 coinList로 api 요청한 데이터 불러와 저장한 스키마
const naverDataSchema = new Schema({
  coinCode: { type: String },
  coinName: { type: String },
  date: { type: String },
  ratio: { type: Number },
});

const naver = Mongoose.model("naver", naverDataSchema, "naver");

// 매번 API 요청할 때 마다 새로 업데이트 하기
export async function naverData(coinCode, coinName, date, ratio) {
  return await naver.updateOne(
    { coinCode },
    {
      coinCode,
      coinName,
      date,
      ratio,
    },
    { upsert: true } // upsert 적용시 해당 스키마가 없으면 업데이트가 아니라 insert를 시킴
  );
}

// ratio 순으로 정렬해서 3개만 가져오기
export async function getNaverFamous() {
  return await naver.find().sort({ ratio: -1 }).limit(3);
}

// ratio 순으로 정렬해서 가져오기
export async function getAllNaverFamous() {
  return await naver.find().sort({ ratio: -1 });
}
