const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const lodash = require("lodash")
require('dotenv').config();

const app  = express();


app.use(bodyParser.urlencoded({extended:true}));

// use ejs templetes
app.set("view engine", "ejs");

app.use(express.static("public"))
const currentdate = date.getDate();

// mogoDB atlas connect using url
const uri = process.env.MONGO_URI;

mongoose.connect(uri);

const item = {
    name: String
}

const itemsModle = new mongoose.model("items", item);
// const item1  = new itemsModle({
//     name: "Welcome to our ToDoList"
// });

const defaultItem = [];

const customItem = {
    name: String,
    items: [item]
};

const customLists = mongoose.model('customLists', customItem);


app.get("/", function(req,res){
    itemsModle.find({},function(err,doc){
            if (doc.length === 0) {
                itemsModle.insertMany(defaultItem)
            }
               
            res.render("index", {listTitle: currentdate, newList: doc});

    })
    
   
})
app.get("/:customName", function(req,res){
    const siteName = lodash.capitalize(req.params.customName);

    customLists.findOne({name:siteName}, function(err,data){
        if(!err) {
            if(!data) {
                const customItem = new customLists({
                    name:siteName,
                    items:defaultItem
                })
                customItem.save();
                res.redirect("/" + siteName);
            }
            else {
                res.render("index", {listTitle: data.name, newList: data.items});
            }
        }
    })
})

app.post("/", function(req,res){
    const typeItem = req.body.newItem;
    const titleName = req.body.list;
    let currentdate = date.getDate();

    const newItem = new itemsModle({
        name:typeItem
    })

    if(titleName === currentdate) {
        newItem.save();
        res.redirect("/");
    }
    else{
        customLists.findOne({name:titleName},function(err, data){
            data.items.push(newItem)
            data.save();
            res.redirect("/"+titleName);
        })
    }
})

app.post("/delete",function(req,res){
    const checkedId = req.body.checkbox;
    const hiddenName = req.body.hiddenName;
    if (hiddenName===currentdate) {
        itemsModle.findByIdAndRemove(checkedId,function(err){
            if(!err) {
                res.redirect("/");
            }
        });
        
    } else {
        customLists.findOneAndUpdate({name: hiddenName},{$pull: {items:{_id:checkedId}}},function(err,data){
            if(!err) {
                res.redirect("/" + hiddenName);
            }
        }); 
    }
    
})




app.listen(3000, function(){
    console.log("started");
})

 