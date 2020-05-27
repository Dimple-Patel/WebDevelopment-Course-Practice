//require npm packages
const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//connect to mongodb database or create if not exist.
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});

//Define Article schema
const articleSchema=new mongoose.Schema({
  title:String,
  content:String
});
//create  Article collection using article schema
const Article=mongoose.model("Article",articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/articles")
//GET request handler to get all recird from Article collection
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
//POST request handler to save new article in Article collection
.post(function(req,res){
  //create new article from input data
  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });
  //ssave record in database
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})
//delete request handler for all articles it delete all record from Article collection.
.delete(function(req,res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:articleTitle")
//GET request handler for a specific article.it get single record from Article collection using request parameter.
.get(function(req,res){

  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})
// PUT request handler for any record in Article collection.it replace entire record with new means it completely replace resources.
.put(function(req,res){

  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})
//PATCH request handler to modify content of any existing article
.patch(function(req, res){

  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
    }else{
        res.send(err);
      }
    }
  );
})
//DELETE request handler for a specific article to delete it from Article collection
.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

//App listening on port number 3000
app.listen(3000,function(){
  console.log("server running on port number 3000");
});
