//Require installed npm packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash"); //JavaScript library provides various utility functions

//create object of express
const app = express();

//set ejs as view engine
app.set('view engine', 'ejs');

//bodyParser Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
//urlencoded form of bodyparser : A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({extended: true}));

//To serve static files such as images, CSS files, and JavaScript files in a directory named public, use the express.static built-in middleware function in Express.
app.use(express.static("public"));

//connect to local todolistDB mongoDB database or create if not exist.
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true,useUnifiedTopology: true});

//define schema for Item collection
const itemsSchema = {
  name: String
};

//create Item collection from itemSchema
//Item collection contain name of all task of Today list.all item for default display page.
const Item = mongoose.model("Item", itemsSchema);

//define schema for List collection
const listSchema = {
  name: String,
  items: [itemsSchema]
};

//create List collection using ListSchema in which each dosument contain name and array of Items.
//This collection contain detail of all customList and its items except Today list.
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "Check on checkbox to delete an item."
});
// default item list
const defaultItems = [item1, item2, item3];


// GET request handler for "/" route
app.get("/", function(req, res) {
  //get all documents from Item collection
  Item.find({}, function(err, foundItems){
    //Add defaultItems into collection if it is empty.
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    }
    //if Item collection is not empty, render list.ejs using listTitle "Today" and foundItems
    else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

//use Express Route parameter to handle GET request for any customList.
app.get("/:customListName", function(req, res){
  //Converts the first character of customListName to upper case and the remaining to lower case.
  const customListName = _.capitalize(req.params.customListName);

  //find record from List collection where name=customListName
  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      //if record not found create new List of that name and store default items in it.
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

//handle POST request for "/" path.
//request come to this route when user click on + button from any list Today or custom list.
app.post("/", function(req, res){
  //get input data from req.body
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

//check input data.if listName = Today then store item into Items collection
//else find listName in List collection and push new item in item array of List collection.
  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//handle POST request when user checked on checkbox of any item from any list Today or customList
app.post("/delete", function(req, res){
   //_id of each item is bind with value of checkbox so get it using req.body.checkbox.
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  //if listName is Today, find and remove item from Item collection
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    //find and update array of items in List collection.
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});


//app running on port number 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
