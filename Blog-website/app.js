//require installes npm packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// initialise some variables with default content so pages don't looks empty
const homeStartingContent = "Excellent content is the backbone of successful branding. With online platforms, where there’s an abundance of information and so many options, the significance of high-quality materials is even greater. Producing superb content for your blog and website puts you at a clear advantage within your field."
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//set ejs as view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to BlogDB database of local mongodb or create if not exist
mongoose.connect("mongodb://localhost:27017/BlogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//define schema for Post collection
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

//create Post collection from postSchema
const Post = mongoose.model("Post", postSchema);

//handle GET request for '/' route
app.get("/", function(req, res) {

  //get all record from Post collection and pass it to home.ejs for display
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

//when user type /compose in url new page will be display. it allows to create new blog post.
app.get("/compose", function(req, res) {
  res.render("compose");
});

//when user click on publish button of compose page form submit data to this route.and this function save new post into database
app.post("/compose", function(req, res) {
  //prepare new instance of post from input data
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //store into database
  post.save(function(err) {

    if (!err) {
      res.redirect("/");
    }
  });
});

//when user click on Read more request come to this handler.and its URL contain _id of post as parameter
app.get("/posts/:postId", function(req, res) {
  //find post from Post collection by ID.
  Post.findById({
    _id: req.params.postId
  }, function(err, result) {
    //display post title and content into single page using post.ejs
    res.render("post", {
      title: result.title,
      content: result.content
    });
  });
  // posts.forEach(function(post){
  //   if((_.lowerCase(req.params.topic))===(_.lowerCase(post.title)))
  //   {
  //   res.render("post",{postTitle:post.title,postBody:post.postBody});
  // }
  // });
});

//handle get request of /about route and render about.ejs
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

//handle get request of /contact route and render contact.ejs
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

//app listening on port number 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
