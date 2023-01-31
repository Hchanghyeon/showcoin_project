import * as coinModel from "../../models/coinModel.js";


// 거래대금 등락율 페이지 
export async function getCoin(req, res) {
  //const result = await communityModel.getCommunity();
  res.render("coin.ejs", { userId: req.userId });
}

// 모든 코인 다 가져오기
export async function getAllCoin(req, res) {
  const coinAll = await coinModel.getAllCoin();
  res.status(200).json({ coinAll });
}
