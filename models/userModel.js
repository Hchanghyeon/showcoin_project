import { sequelize } from "../db/mysql.js";
import SQ from 'sequelize';
const DataTypes = SQ.DataTypes;

// mysql Sequelize로 맵핑 시키기
export const User = sequelize.define('users', {
  userId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  userPassword : {
    type : DataTypes.STRING(100),
    allowNull: false,
  }
}, { timestamps:false});

// 사용자 등록
export async function addUser(user){
  return User.create(user).then(data => {console.log(data); return data;}).catch((err) => {console.log(err)});
}

// 사용자 ID로 찾기
export async function findByUserId(userId){
  return User.findOne({ where:{userId}});
}

// User List 가져오기
export async function getUserList(){
  return User.findAll({});
}

