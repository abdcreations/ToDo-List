//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://abdcreations:%40Abdcreations124@cluster0.7fk74.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add new items"
});
const item3 = new Item({
  name: "Click the checkbox to delete"
});

const defaultItems = [item1, item2, item3];




app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){

    if(foundItems.length===0) {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        } else {
          console.log("success");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  })

  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const newItem = Item({
    name:itemName
  });

  newItem.save();
  res.redirect("/");


});

app.post("/delete",function(req,res){
  const ID = req.body.checkbox;
  // Item.deleteOne({_id: "ID"},function(err){
  //   if(err) console.log(err);
  //   else console.log("deleted");
  // })
  Item.findByIdAndRemove(ID,function(err) {
    if(!err) res.redirect("/");
  })
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
