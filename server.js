//common js 구문
//모듈 import --> require("모듈")
//express 
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");


//서버 생성
const app = express();
//프로세서의 주소 포트번호
const port = 8080;
//브라우저의 cors이슈를 막기 위해 설정
app.use(cors());
// json형식 데이터를 처리하도록 설정
app.use(express.json());
app.use("/upload",express.static("upload"));

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'upload/');
    },
    filename: (req,file,cb)=>{
        const newFilename = file.originalname;
        cb(null,newFilename);
    }
})
//upload 객체 생성
const upload = multer({storage: storage});


app.post("/upload",upload.single("file"), (req, res)=>{
    res.send({
        imageURL:req.file.filename
    })
})



// mysql연결 생성
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3306",
    database: "hotel"
})
//선 연결
conn.connect();
// conn.query("쿼리문",콜백함수)
app.get("/special", (req, res)=>{
    conn.query("select * from event where e_category = 'special'",
    (error, result, fields)=>{
        res.send(result)
    })
})

app.get("/special/:no", (req, res)=>{
    const {no} = req.params;
    conn.query(`select * from event where e_category = 'special' and e_no=${no}`,
    (error, result, fields)=>{
        res.send(result)
    })
})

app.listen(port, ()=>{
    console.log("서버가 동작하고 있습니다.")
})