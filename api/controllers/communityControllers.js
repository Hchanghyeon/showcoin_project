import * as communityModel from "../../models/communityModel.js";
import * as boardModel from "../../models/boardModel.js";

// 커뮤니티(자유 게시판) 메인페이지
export async function getCommunity(req, res) {

    // 모델에 연결된 getCommunity함수 실행
    const result = await communityModel.getCommunity();
    // 받은 결과 렌더링
    res.render('community.ejs', {'community' : result, 'userId' : req.userId});
}

export async function getBoardDetail(req, res) {
    const { boardNum } = req.params;

    // 게시글을 볼 때 조회수 +1
    await communityModel.updateBoardView(boardNum);

    const community_result = await communityModel.getBoard(boardNum);
    const boardDetail_result = await boardModel.getBoardDetail(boardNum);

    // 받은 결과 렌더링
    res.render('boardDetail.ejs', {'Detail' : boardDetail_result[0], 'community' : community_result[0], 'userId' : req.userId});
}

export async function getBoardForm(req, res) {
    // 받은 결과 렌더링
    res.render('boardForm.ejs', {'userId' : req.userId});
}

export async function getBoardUpdateForm(req, res) {
    const { boardNum } = req.params;
    const community_result = await communityModel.getBoard(boardNum);
    const boardDetail_result = await boardModel.getBoardDetail(boardNum);
    console.log(boardDetail_result[0]);
    // 받은 결과 렌더링
    res.render('boardUpdateForm.ejs', {'Detail' : boardDetail_result[0], 'community' : community_result[0], 'userId' : req.userId});
}

export async function BoardWrite(req, res) { 
    let boardTitle = req.body.Title;
    let boardContents = req.body.Content;

    let lastBoardNum = await communityModel.getLastBoardNum();
    let boardNum;
    if (lastBoardNum.length === 0) {
        boardNum = 1;
    }
    else {
        boardNum = lastBoardNum[0].boardNum + 1;
    }
    let boardWriter = req.userId; // 유저 id
    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    let boardDate = year + '.' + month + '.' + date;
    let boardView = 0;
    let boardComment = 0;
    let boardComments = [];
    let boardLike = 0;

    await communityModel.createBoard(boardNum, boardTitle, boardWriter, boardDate, boardView, boardComment, boardLike);
    await boardModel.createBoard(boardNum, boardContents, boardComments);

    // 작성 후 커뮤니티 페이지로 리다이렉트
    res.redirect("/community");
}

export async function updateBoard(req, res) { 
    let boardTitle = req.body.Title;
    let boardContents = req.body.Content;
    const { boardNum } = req.params;

    await communityModel.updateBoard(boardNum, boardTitle);
    await boardModel.updateBoard(boardNum, boardContents);

    // 작성 후 커뮤니티 페이지로 리다이렉트
    res.redirect("/community");
}

export async function updateLike(req, res) { 
    const { boardNum } = req.params;

    // 추천수 +1
    await communityModel.updateLike(boardNum);
    // 조회수 -1 리다이렉트 하면 조회도같이 올라감..
    await communityModel.updateViewDown(boardNum);

    // 작성 후 커뮤니티 페이지로 리다이렉트
    res.redirect("/community/detail/" + boardNum);
}

export async function deleteBoard(req, res) { 
    const { boardNum } = req.params;

    await communityModel.deleteBoard(boardNum);
    await boardModel.deleteBoard(boardNum);

    // 작성 후 커뮤니티 페이지로 리다이렉트
    res.redirect("/community");
}

export async function addComment(req, res) { 
    const { boardNum } = req.params;

    // 조회수 -1 리다이렉트 하면 조회도같이 올라감..
    await communityModel.updateViewDown(boardNum);
    // 댓글 추가
    let writer = req.userId; // 유저 id
    let text = req.body.Comment;

    await boardModel.addComment(boardNum, writer, text);

    // 댓글추가 후 댓글 수 +1
    await communityModel.updateComment(boardNum);


    // 작성 후 커뮤니티 페이지로 리다이렉트
    res.redirect("/community/detail/" + boardNum);
}
