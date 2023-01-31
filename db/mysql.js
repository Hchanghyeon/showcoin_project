// import mysql from "mysql2";
import { config } from "../config/config.js";
import SQ from 'sequelize';

// 구조분해할당으로 데이터베이스 정보 가져오기 
const {host, user, database, password, port} = config.db;

// Sequeilze로 DB연결
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect:'mysql',
  port,
});