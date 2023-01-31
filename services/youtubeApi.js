import Youtube from "youtube-node";
let youtube = new Youtube();

let word = "비트코인"; // 검색어 지정
let limit = 10; // 출력 갯수
let key = ""; // Youtube API key

export async function getYoutubeApi() {
  youtube.setKey(key); // 키 저장
  // 파라미터 세팅
  youtube.addParam("order", "viewCount");
  youtube.addParam("type", "video");
  youtube.addParam("videoLicense", "creativeCommon");
  youtube.addParam("safeSearch","none");


  // 불러온 결과 값을 토대로 반환 시켜야하기 때문에 콜백함수안에서 return이 불가능하여 promise로 변경 처리
  const getData = () => {
    return new Promise((resolve, reject) => {
      youtube.search(word, limit, function (err, result) {
        // 검색 실행
        if (err) {
          reject(error);
        } // 에러일 경우 에러공지하고 빠져나감
        else {
          
          let videoList = [];
          let items = result["items"]; // 결과 중 items 항목만 가져옴

          for (var i in items) {
            let it = items[i];
            let title = it["snippet"]["title"];
            let video_id = it["id"]["videoId"];
            let channelTitle = it['snippet']['channelTitle'];
            let url = "https://www.youtube.com/embed/" + video_id;
            let video = {
              title,
              url,
              channelTitle
            };
            videoList.push(video);
          }
          resolve(videoList);
        }
      });
    });
  };

  // 데이터 받아오기
  const data = await getData();

  return data;
}
