const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");

//서버 생성
const app = express();
//프로세서의 주소
const port = 8080;
//브라우저의 CORS이슈를 막기 위해 사용
app.use(cors())
//json 형식의 데이터를 처리하도록 설정
app.use(express.json());
// upload폴더 클라이언트에서 접근 가능하도록 설정
app.use("/upload",express.static("upload"));
//storage 생성
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
//upload경로로 post요청시 응답 구현하기
app.post("/upload",upload.single("file"), (req, res)=>{
    res.send({
        imageURL:req.file.filename
    })
})
//mysql연결 생성
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3306",
    database: "hotel"
})
conn.connect();
//get요청 -> members 값으로 받아옴 mysql
app.get("/members", (req, res)=>{
    conn.query("select * from event", function(error, result, fields){
        res.send(result);
    })

})
//서버 주소:id 값으로 요청
app.get("/members/:id", (req, res)=>{
    const {id} = req.params;
    conn.query(`select * from member where m_no = ${id}`, function(error, result, fields){
    res.send(result);
    })
})
//서버 구동
app.listen(port, ()=>{
    console.log("서버가 동작하고 있습니다.");
})  