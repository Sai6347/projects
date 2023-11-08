import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';

const app =express()

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"12345",
    database:"aita"
})

app.use(express.json())

app.use(cors())

app.get("/", (req,res) => {
    res.json("Hello now you are connected to the backend....")
})

app.get("/getEmp", (req,res) => {
    const q = "select * from employee"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/login", (req,res) => {
    const q = "select * from employee where ( `mobile`, `password`) values (?)"
    const values = [
        req.body.mobile,
        req.body.password
    ];
    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("Logged In Successfully")
    })
})

app.post("/addEmp", upload.single('file'), (req,res) => {
    const q = "insert into employee (`name`,`mobile`,`role`,`file`,`password`) values (?)"
    const values = [
        req.body.name,
        req.body.mobile,
        req.body.role,
        req.file.buffer,
        req.body.password
    ];
    db.query(q,[values], (err,data) => {
        if(err) return res.json(err)
        return res.json("Registration done Successfully")
    })
})

app.get("/getEmp/:id", (req, res) => {
    const empId = req.params.id;
    const q = "select * from employee where id = ?";

    db.query(q, [empId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.put("/editEmp/:id", upload.single('file'), (req, res) => {
    const empId = req.params.id;
    console.log("Before executing the SQL query");
    const q = "update employee set `name`= ?, `mobile` = ?, `role` = ?, `file` = ?, `password` = ? where id = ?";
    const values = [
        req.body.name,
        req.body.mobile,
        req.body.role,
        req.file.buffer,
        req.body.password,
        empId
    ];

    if (req.file) {
        console.log("New file is Added");
    }

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Details updated Successfully");
    });
});

app.delete("/deleteEmp/:id", (req,res) => {
    const empId = req.params.id;
    const q = "delete from employee where id = ?";

    db.query(q, [empId], (err,data) => {
        if(err) return res.json(err);
        return res.json("Employee Deleted Successfully");
    })
})

app.listen(8800, ()=>{
    console.log("Connected to backend");
})