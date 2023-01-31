import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { sequelize } from "./db/mysql.js";
import { connectDB } from "./db/mongoose.js";
import userRoute from "./api/routes/userRoute.js";
import communityRoute from "./api/routes/communityRoute.js";
import coinRoute from "./api/routes/coinRoute.js";
import searchRoute from "./api/routes/searchRoute.js";
import session from "express-session";
import { isAuth, isAuthShow } from "./services/jwt.js";
import * as youtubeApi from "./services/youtubeApi.js";
import methodOverride from "method-override";
import * as collect from "./api/request/coin.js";
import * as naverSearch from "./services/naverSearchTrend.js";
import * as naverDataModel from "./models/naverDataModel.js";
import * as coinModel from "./models/coinModel.js";

const port = 3000;
const app = express();

// 기본 미들웨어
app.use(express.json()); // 클라이언트에서 서버로 json으로 넘어오는 데이터 파싱
app.use(express.urlencoded({ extended: false })); // 클라이언트에서 서버로 post요청할 때 안에 담긴 데이터를 파싱
app.use(cookieParser()); // 쿠키 파싱하는 라이브러리
app.use(morgan("tiny")); // 요청 로그 보는 라이브러리
app.use(express.static("public")); // public 폴더 외부에서도 볼 수 있게 설정 
app.use( // 세션 관련 설정
  session({
    secret: "keyboard cat", // 암호화 키
    resave: false,
    saveUninitialized: true,
  })
);
//메소드 오버라이드 등록 form태그에서 action경로 뒤에 ?_methode=PUT/DELETE 사용가능
app.use(methodOverride("_methode"));

// View 설정
app.set("view engine", "ejs");

// 라우팅
app.get("/", isAuthShow, async (req, res) => {
  const youtubeList = await youtubeApi.getYoutubeApi(); // youtube추천 api 리스트 불러오기
  const sortTradeCoin = await coinModel.getSortTradeCoin(); // 거래량 상위 코인 리스트 불러오기
  const changeRateCoin = await coinModel.getChangeRateCoin(); // 변동률 상위 코인 리스트 불러오기
  const naverFamous = await naverDataModel.getNaverFamous(); // naver 검색어 순위 리스트 불러오기
  res.render("index.ejs", {
    userId: req.userId, // 로그인 된 UserId 넘기기
    youtubeList,
    sortTradeCoin,
    changeRateCoin,
    naverFamous,
  });
});

app.use("/user", userRoute);
app.use("/community", communityRoute);
app.use("/coin", coinRoute);
app.use("/search", searchRoute);

// 에러처리
app.use((req, res, next) => {
  // 위의 모든 라우팅을 거치고도 찾는게 없을 때 404에러 발생
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  // 에러가 발생하면 이 미들웨어 타게 설정
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// 5분마다 원화로 거래가능한 종목의 정보 조회 300*1000
collect.collect(); // 1회성 수집
setInterval(collect.collect, 300 * 1000); // 5분마다 수집

// mysql 연결
sequelize.sync().then((client) => {
  console.log("SuccessFully connected to mysql");
});

// mongoose 연결
connectDB()
  .then(() => {
    console.log("SuccessFully connected to mongodb");
  })
  .catch((e) => console.error(e));

/* naverData API 코인 리스트 토대로 검색량 순위 가져와서 DB에 저장하는 부분
try {
  // 코인 리스트 가져오기 
  const coinList = await coinModel.getAllNameCoin();
  let result = Promise.all( // promise 순차처리 
    coinList.map(async (item) => {
      naverSearch.readyToSend(item.market_korean);
      const naverData = await naverSearch.requestData();
      let avg = 0;
      for(let i=0; i < naverData.results[0].data.length; i++){
        avg = avg + naverData.results[0].data[i].ratio;
      }
      avg = avg / naverData.results[0].data.length;
      console.log(avg);
      const inputData = {
        coinCode: item.market,
        coinName: item.market_korean,
        date: naverData.results[0].data[0].period,
        ratio: avg,
      };
      await naverDataModel.naverData(
        inputData.coinCode,
        inputData.coinName,
        inputData.date,
        inputData.ratio
      );
    })
  );
} catch (e) {
  console.log(e);
}
*/
app.listen(port, () => {
  console.log("server is running");
});
