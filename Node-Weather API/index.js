const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
  var city=req.body.cityName;
  var apiKey="####";
  var url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey;
  https.get(url,function(response){
    response.on('data',function(data){
      var weatherData=JSON.parse(data);
      res.write("current temprature of "+city+" is "+weatherData.main.temp);
      res.send();
    })
  });
})
app.listen(3000,function(){console.log("listening to port number 3000");});
