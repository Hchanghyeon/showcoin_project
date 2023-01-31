import wait from "waait";
import request from "request";
import * as marketCodeModel from "../../models/market_codeModel.js";
import * as coinModel from "../../models/coinModel.js";
import * as coinInfoModel from "../../models/coinInfoModel.js";
import fs from "fs";

// 업비트 rest-api 초당 요청횟수 제한 10회 : 1초 = 1000ms
// 제한에 안 걸리게 110ms대기
// 원화로 거래가능한 종목 114개
// 150ms마다 요청 시 114 * 300 / 1000 = 34초
export async function collect() {
  console.log("코인 데이터 수집을 시작했습니다.");
  let code = await marketCodeModel.getCode();


  for (let i = 0; i < code.length; i++) {
    const options = {
      method: "GET",
      url: "https://api.upbit.com/v1/ticker?markets=" + code[i].market,
      headers: { Accept: "application/json" },
    };

    await request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      let coin_json = JSON.parse(body);
      let market = coin_json[0].market;
      let opening_price = coin_json[0].opening_price;
      let high_price = coin_json[0].high_price;
      let low_price = coin_json[0].low_price;
      let trade_price = coin_json[0].trade_price;
      let prev_closing_price = coin_json[0].prev_closing_price;
      let change = coin_json[0].change;
      let change_price = coin_json[0].change_price;
      let change_rate = coin_json[0].change_rate;
      let signed_change_price = coin_json[0].signed_change_price;
      let signed_change_rate = coin_json[0].signed_change_rate;
      let acc_trade_price = coin_json[0].acc_trade_price;
      let acc_trade_price_24h = coin_json[0].acc_trade_price_24h;
      let acc_trade_volume = coin_json[0].acc_trade_volume;
      let acc_trade_volume_24h = coin_json[0].acc_trade_volume_24h;
      let highest_52_week_price = coin_json[0].highest_52_week_price;
      let highest_52_week_date = coin_json[0].highest_52_week_date;
      let lowest_52_week_price = coin_json[0].lowest_52_week_price;
      let lowest_52_week_date = coin_json[0].lowest_52_week_date;

      console.log(i + " : " + coin_json[0].market);

      const market_korean = await coinInfoModel.getCoinInfo(market);
    
      coinModel.updateCoin(
        market,
        market_korean[0].korean_name,
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
      );
    });

    await wait(300);
  }

  let data = await coinModel.trade24hTop25();
  let csv = "";

  csv += "name,parent,value,rate\r\n";
  csv += "Coin,,,\r\n";

  for (let i = 0; i < data.length; i++) {
    let market = data[i].market;
    let acc_trade_price_24h = data[i].acc_trade_price_24h;
    let signed_change_rate = data[i].signed_change_rate;

    csv +=
      market.split("-")[1] +
      ",Coin," +
      Math.round(acc_trade_price_24h).toString() +
      "," +
      (Math.round(signed_change_rate * 100) / 100).toString() +
      "\r\n";
  }

  fs.writeFileSync("public/csv/coin.csv", csv);
  console.log("코인 데이터 수집을 완료했습니다.");
}
