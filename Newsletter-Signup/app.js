// require installed npm packages
var express=require("express");
var bodyParser=require("body-parser");
var request=require("request");
var https=require("https");

var app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Respond to GET request of '/' route with signup page.
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

//POST request handler for '/' route :
// get data from request body.
// prepare input data for mailchimp API.
//Convert javaScript object into JSON object.
//prepare other object of other options required to call mailchimp API.
//Call API using HTTPS.request,pass options and input data objects.
//display result success or failure page based on response from API.
app.post("/",function(req,res){
  //get input from request body
  const fName=req.body.firstName;
  const lName=req.body.lastName;
  const email=req.body.inputEmail;

  //prepare input data for mailchimp API
  const data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:fName,
          LNAME:lName
        }
      }
    ]
  };

  //Convert javaScript object into JSON object.
  const jsonData=JSON.stringify(data);

  const url="<mailchimp server URL>";
  const options={
    method:"POST",
    auth:"<USER_NAME>:<API_KEY>"
  };

// request mailchip api to post data by providing authentication detail and options.
const request=  https.request(url,options,function(response){

// if mailchip server successfully process request and send status code 200 then display success page
  if(response.statusCode===200)
  {
  res.sendFile(__dirname+"/success.html");
}//if request not successfull display Failure page
  else
  {
  res.sendFile(__dirname+"/failure.html");
}
    //Get output Data provided by API and display it on console
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })

  })
//provide json input data to mailchimp API.
request.write(jsonData);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

//APP running on port number 3000
app.listen(3000,function(){console.log("listening at port number 3000");});
