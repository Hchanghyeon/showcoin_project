import dotenv from "dotenv";
dotenv.config();

// .env 파일안에 있는 값인지 검증하는 함수
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}

// config 객체
export const config = { 
  jwt: {
    // jwt 비밀키
    secretKey : required("JWT_SECRET"),
    // jwt 만료시간
    expiresInSec: required("JWT_EXPIRES_SEC"),
  },
  bcrypt: {
    // bcrypt salt 값
    saltRounds : required("BCRYPT_SALT_ROUNDS"),
  },
  db: {
    // MYSQL
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
    port: required("DB_PORT"),
  },
  mdb: {
    // MongoDB
    host: required("MDB_HOST"),
  },
  naver: {
    // NAVER 관련 정보
    serviceId : required("NSMSID"),
    secretKey : required("NSMSSECRETKEY"),
    accessKey : required("NSMSACCESSKEY"),
    number : required("NSMSNUMBER")
  }
};
