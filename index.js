const { urlencoded } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Person = require("./models/person");
const imageToBase64 = require("image-to-base64");
const multer = require("multer");
const path = require("path");
let date_ob = new Date();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "public"))); //for uploading files to server

const fsStoage = multer.diskStorage({
  //we can also use cloud storage but for now we are using our disc only
  destination: (req, file, cb) => {
    //where the file will be saved
    cb(null, "./images"); //cd is a callback function inbuild in multer
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname); //we are naming our downloaded file ..to avoid saving files of same name we use date as well
  },
});

app.use(multer({ storage: fsStoage }).single("img")); //in this we used .single() because we only wanted for a single file

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/post",(req,res)=>{
 res.render("post");
})
app.get("/data", (req, res) => {
  Person.find().then((data) => {
    res.render("data", { parr: data });
  });
});

app.post("/save", (req, res) => {
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  const date1 =
  hours +":"
  + minutes+":"
  + seconds+ " "
  + date 
  + "-" + month
  +"-"+ year;
   // console.log(req.file)
  imageToBase64("images/" + req.file.filename)
    .then((response) => {
      const abc = new Person({
        name: req.body.name,
        post: req.body.post,
        date: date1,
        img: response,
      });
      abc.save().then((savedDoc) => {
        res.redirect("/data");
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

mongoose
  .connect("mongodb://localhost:27017/person")
  .then(() => {
    console.log("connectedd to db");
    app.listen(3000, () => {
      console.log("exppress server staresdrfs");
    });
  })
  .catch(() => {
    console.log("could not connect to db");
  });
