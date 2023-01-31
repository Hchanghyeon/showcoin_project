import Mongoose from "mongoose";

const { Schema } = Mongoose;

// mongoDB market_code 스키마 연결
const marketCodeSchema = new Schema({
  market_warning : { type : String },
  market : { type : String },
  korean_name : { type : String },
  english_name : { type : String }
});

const market_code = Mongoose.model("code", marketCodeSchema, "market_code");

export async function getCode(){
  return await market_code.find({market: {$regex:/^KRW/}}, {market:1, _id:0});
}