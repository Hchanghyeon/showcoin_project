import Mongoose from "mongoose";
import {config} from "../config/config.js"

// Mongoose 연결 함수
export async function connectDB() {
    return Mongoose.connect(config.mdb.host, {
        useNewUrlParser:true, // URL 접속 파싱에 대한 옵션
        useUnifiedTopology: true, // 뭔지는 모르겠지만 연결할 때 다들 쓰는 옵션
    });
}