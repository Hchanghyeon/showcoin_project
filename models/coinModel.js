import Mongoose from "mongoose";

const { Schema } = Mongoose;

// mongoDB market_code 스키마 연결
const coinSchema = new Schema({
  market: { type: String }, // 종목 구분 코드
  market_korean: { type: String },
  opening_price: { type: Number }, // 시가
  high_price: { type: Number }, // 고가
  low_price: { type: Number }, // 저가
  trade_price: { type: Number }, // 종가(현재가)
  prev_closing_price: { type: Number }, // 전일 종가
  change: { type: String }, // EVEN : 보합 / RISE : 상승 / FALL : 하락
  change_price: { type: Number }, // 변화액의 절대값
  change_rate: { type: Number }, // 변화율의 절대값
  signed_change_price: { type: Number }, // 부호가 있는 변화액
  signed_change_rate: { type: Number }, // 부호가 있는 변화율
  acc_trade_price: { type: Number }, // 누적 거래재금
  acc_trade_price_24h: { type: Number }, // 24시간 누적 거래대금
  acc_trade_volume: { type: Number }, // 누적 거래량
  acc_trade_volume_24h: { type: Number }, // 24시간 누적 거래량
  highest_52_week_price: { type: Number }, // 52주 신고가
  highest_52_week_date: { type: String }, // 52주 신고가 달성일
  lowest_52_week_price: { type: Number }, // 52주 신저가
  lowest_52_week_date: { type: String }, // 52주 신저가 달성일
});

const coin = Mongoose.model("coin", coinSchema, "coin");

// Upbit에서 가져온 코인 리스트 업뎃하기
export async function updateCoin(
  market,
  market_korean,
  opening_price,
  high_price,
  low_price,
  trade_price,
  prev_closing_price,
  change,
  change_price,
  change_rate,
  signed_change_price,
  signed_change_rate,
  acc_trade_price,
  acc_trade_price_24h,
  acc_trade_volume,
  acc_trade_volume_24h,
  highest_52_week_price,
  highest_52_week_date,
  lowest_52_week_price,
  lowest_52_week_date
) {
  return await coin.updateOne(
    { market: market },
    {
      market: market,
      opening_price: opening_price,
      market_korean: market_korean,
      high_price: high_price,
      low_price: low_price,
      trade_price: trade_price,
      prev_closing_price: prev_closing_price,
      change: change,
      change_price: change_price,
      change_rate: change_rate,
      signed_change_price: signed_change_price,
      signed_change_rate: signed_change_rate,
      acc_trade_price: acc_trade_price,
      acc_trade_price_24h: acc_trade_price_24h,
      acc_trade_volume: acc_trade_volume,
      acc_trade_volume_24h: acc_trade_volume_24h,
      highest_52_week_price: highest_52_week_price,
      highest_52_week_date: highest_52_week_date,
      lowest_52_week_price: lowest_52_week_price,
      lowest_52_week_date: lowest_52_week_date,
    },
    { upsert: true }
  );
}

// 24시간 등락율 상위 25개 가져오기
export async function trade24hTop25() {
  return await coin
    .find(
      {},
      { market: 1, acc_trade_price_24h: 1, signed_change_rate: 1, _id: 0 }
    )
    .sort({ acc_trade_price_24h: -1 })
    .limit(25);
}

// 모든 코인 가져오기
export async function getAllCoin() {
  return await coin.find({});
}

// 모든 코인 이름 가져오기 (_id 빼고 market과 market_korean만)
export async function getAllNameCoin() {
  return await coin.find({},{_id:0, market:1, market_korean:1});
}

// 거래금액 상위 정렬하여 3개만 가져오기
export async function getSortTradeCoin() {
  return await coin.find().sort({"acc_trade_volume_24h":-1}).limit(3);
}

// 변동률 정렬하여 3개만 가져오기
export async function getChangeRateCoin() {
  return await coin.find().sort({"change_rate":-1}).limit(3);
}




