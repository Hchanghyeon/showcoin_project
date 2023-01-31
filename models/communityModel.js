import Mongoose from "mongoose";

const { Schema } = Mongoose;

// mongoDB board 스키마 연결
const communitySchema = new Schema({
  boardNum : { type : Number },
  boardTitle : { type : String },
  boardWriter : { type : String },
  boardDate : { type : String },
  boardView : { type : Number },
  boardComment : { type : Number },
  boardLike : { type : Number }
});

// mongoDB board 컬렉션과 스키마 연결 -> Community로 사용
const Community = Mongoose.model("Community", communitySchema, "board");

// Community(mongoDB board) 내용 모두 조회 [게시글 정보]
export async function getCommunity(){
  return await Community.find({});
}

// Community(mongoDB board) 게시글 번호로 조회
export async function getBoard(boardNum){
  return await Community.find({boardNum : boardNum});
}

// 가장 마지막 boardNum 가져오기
export async function getLastBoardNum(){
  return await Community.find({},{boardNum:1, _id:0}).sort({boardNum:-1}).limit(1);
}

// board 생성
export async function createBoard(boardNum, boardTitle, boardWriter, boardDate, boardView, boardComment, boardLike){
  return await Community.create({boardNum:boardNum, boardTitle:boardTitle, boardWriter:boardWriter, boardDate:boardDate, boardView:boardView, boardComment:boardComment, boardLike:boardLike});
}

// board View 수정
export async function updateBoardView(boardNum){
  return await Community.updateOne({boardNum:boardNum},{$inc:{boardView:1}});
}

// board View 수정
export async function updateViewDown(boardNum){
  return await Community.updateOne({boardNum:boardNum},{$inc:{boardView:-1}});
}

// board 수정
export async function updateBoard(boardNum, boardTitle){
  return await Community.updateOne({boardNum:boardNum},{$set:{boardTitle:boardTitle}});
}

// board Like 수정
export async function updateLike(boardNum){
  return await Community.updateOne({boardNum:boardNum},{$inc:{boardLike:1}});
}

// board Comment 수정
export async function updateComment(boardNum){
  return await Community.updateOne({boardNum:boardNum},{$inc:{boardComment:1}});
}

// board 삭제
export async function deleteBoard(boardNum){
  return await Community.deleteOne({boardNum:boardNum});
}