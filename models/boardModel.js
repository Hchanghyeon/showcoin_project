import Mongoose from "mongoose";

const { Schema } = Mongoose;

// mongoDB board_detail 스키마 연결
const boardDetailSchema = new Schema({
  boardNum : { type : Number },
  boardContents : { type : String },
  boardComments : { type : Array }
});

// mongoDB board_detail 컬렉션과 스키마 연결 -> Board로 사용
const Board = Mongoose.model("Board", boardDetailSchema, "board_detail");

// Board로(mongoDB board_detail) 요청 게시글 내용 조회
export async function getBoardDetail(boardNum){
  return await Board.find({boardNum : boardNum});
}

// board 생성
export async function createBoard(boardNum, boardContents, boardComments){
  return await Board.create({boardNum:boardNum, boardContents:boardContents, boardComments,boardComments});
}

// board_Detail 수정
export async function updateBoard(boardNum, boardContents){
  return await Board.updateOne({boardNum:boardNum},{$set:{boardContents:boardContents}});
}

// board_Detail 삭제
export async function deleteBoard(boardNum){
  return await Board.deleteOne({boardNum:boardNum});
}

// board_Detail 댓글 추가
export async function addComment(boardNum, writer, text){
  return await Board.updateOne({boardNum:boardNum},{$push:{boardComments:{writer:writer, text:text}}});
}