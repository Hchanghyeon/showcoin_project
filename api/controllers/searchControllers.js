import * as naverDataModel from "../../models/naverDataModel.js";

// 네이버 검색량 순위 페이지 보여주기
export async function getSearchPage(req, res) {
  const naverFamous = await naverDataModel.getAllNaverFamous();
  res.render("search.ejs", { userId: req.userId, naverFamous });
}
