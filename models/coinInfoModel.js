import Mongoose from "mongoose";

const { Schema } = Mongoose;

// 코인이름을 한글 이름으로 변경하여 저장하려는 스키마 생성
const coinSchema = new Schema({
  market_warning: { type: String },
  market: { type: String },
  korean_name: { type: String },
  english_name: { type: String },
});

// 코인 스키마 모델 설정
const market_code = Mongoose.model("market_code", coinSchema, "market_code");

// 코인 정보 불러오기
export async function getCoinInfo(market) {
  return await market_code.find({ market });
}
