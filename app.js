const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app  = express();
const lists=["Buy Food","Cook Food","Eat Food"];
const worlList=[];


app.use(bodyParser.urlencoded({extended:true}));

// use ejs templetes
app.set("view engine", "ejs");

app.use(express.static("public"))



app.get("/", function(req,res){
    let currentdate = date.getDate();
    res.render("index", {listTitle: currentdate, newList: lists});
})

app.post("/", function(req,res){
    let item = (req.body.newItem);
    let list = (req.body.list);
    
    if (list === "work") {
        worlList.push(item);
        res.redirect("/work");
    } else {
        lists.push(item);
        res.redirect("/"); 
    }
})

app.get("/work", function(req,res){
    res.render("index", {listTitle: "work", newList: worlList});
})


app.listen(3000, function(){
    console.log("started");
})

