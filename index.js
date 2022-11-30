// This is the .js file
const express = require('express');
const https = require("https");
// https was selected from this link -> https://nodejs.org/api/https.html#httpsgetoptions-callback
const bodyParser = require('body-parser');
//Require the body-parser package


const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({
  extended: true
}));
// The following code is what is required everytime we want to use body-parser
// app.use express works with bodyParser and can use its methods of .text() or .urlencoded()
// bodyParser.urlencoded() --> is what is used when you want to parse data coming in an html form
// {extended:true} what body-parser requires us to declare
// Must be below the port = 3000


//The Root directory
app.get("/", function(req_appget_root, res_appget_root) {

  const url = 'https://api.openweathermap.org/data/2.5/forecast?q=Toronto&units=metric&appid=44c58cbcd1a0cd3dff2c408b42a53f25#'
  https.get(url, (res_httpsget_url) => {
    // console.log(res) // logging the response that is coming when doing the https.get request based on the URL. This is not a a JSON file
    console.log('The Status Code is ' + res_appget_root.statusCode) // logging only the statusCode of the response. a 200 satusCode means we are doing good

    res_httpsget_url.on('data', (d) => { //The res_httpsget_url.on or response.on is used to view the recieved data from an API, from https.get
      // process.stdout.write(d); //Searching the on method for the data from the response back. Data recieved in a raw format
      // console.log(d); //loggin all the data recieved from the API in a "hex" format
      const data_2 = JSON.parse(d); //parse the data into javascript object & conver it into a pretty format. If you experince an error then kill it pkill -f node
      // console.log(data_1); // console log the data
      // data_2 = JSON.stringify(data_1);  //This method turns the JS object into a string, which is what recived it at
      console.log('The Temp in Toronto is ' + data_2.list[3].main.temp + ' Degrees Celsius'); // console log specifc data by getting the path from online API tools


      res_appget_root.write('<h1> Welcome to the Root "/" direcotry. To select a City go to http://127.0.0.1:3000/index.html</h1>');
      res_appget_root.write('<h2> The Temp in Toronto is ' + data_2.list[3].main.temp + ' Degrees Celsius</h2>');
      // A single .send method all are the .write methods
      res_appget_root.send();
      // This is the "res_appget_root" from the app.get


    });

  });

});


//The City Specific Directory
// Steps:
// 1. User goes to http://127.0.0.1:3000/index.html. This will activate app.get("/index.html"........
// 2. app.get("/index.html"........ will direct the user towards the index.html page
// 3. In the index.html page. The user will fill out a form using the <form> tag
// 4. Once the <form> is complete. The action attribute will define where the submitted data will go and in which method
// 5. The data is to be submited as a POST request -> method="post"
// 6. In app.post we catch the POST requested data from the action attrubute in index.html
// 7. To catch the POST requested data app.post must have "/index.html" & action = "/index.html"

app.get("/index.html", function(req_appget_index, response_appget_index) {
  // app.get is a method provided by express and it allows our server to react when a browser attempts to access the server by making a get request

  response_appget_index.sendFile(__dirname + "/index.html"); //When we go to "/City" we will be directed to /index.html
  // __dirname is used so if run the server you will be directed to the correct path of the html page
});

app.post("/index.html", function(req_apppost_index, res_apppost_index) {
  // The app.post handles the back end calculations. and that calculation will be Posted at /index.html"

  console.log(req_apppost_index.body.CityName); //-> is used to view all all the inputs from the customer or from the POST-> body.CityName from index.html


  const city = req_apppost_index.body.CityName
  const appid = "44c58cbcd1a0cd3dff2c408b42a53f25"
  const unit = "metric"
  const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=' + unit + '&appid=' + appid
  https.get(url, (res_httpsget_url) => {
    // console.log(res) // logging the response that is coming when doing the https.get request based on the URL. This is not a a JSON file
    console.log('The Status Code is ' + res_httpsget_url.statusCode) // logging only the statusCode of the response. a 200 satusCode means we are doing good

    res_httpsget_url.on('data', (d) => { //The res.on or response.on is used to view the recieved data from an API, from https.get
      // process.stdout.write(d); //Searching the on method for the data from the response back. Data recieved in a raw format
      // console.log(d); //loggin all the data recieved from the API in a "hex" format
      const data_1 = JSON.parse(d); //parse the data into javascript object & conver it into a pretty format. If you experince an error then kill it pkill -f node
      // console.log(data_1); // console log the data
      // data_2 = JSON.stringify(data_1);  //This method turns the JS object into a string, which is what recived it at
      console.log('The Temp in ' + city + ' is ' + data_1.list[3].main.temp + ' Degrees Celsius'); // console log specifc data by getting the path from online API tools

      // Resource for image https://openweathermap.org/weather-conditions#Icon-list
      // <h1> is written with img to make the image go on a single like alone
      // response.write("<h1><img src=" + "http://openweathermap.org/img/wn/"+data_1.list[0].weather[0].icon +"@2x.png"   + "></h1>");
      res_apppost_index.write('<h1> The Temp in ' + city + ' is ' + data_1.list[3].main.temp + ' Degrees Celsius </h1>'); // This is realted to the app.get
      res_apppost_index.write('<h1> The Temp in ' + city + ' feels like ' + data_1.list[0].main.feels_like + ' Degrees Celsius </h1>'); // This is realted to the app.get
      res_apppost_index.write("<img src=" + "http://openweathermap.org/img/wn/" + data_1.list[0].weather[0].icon + "@2x.png" + ">");
      // A single .send method all are the .write methods
      res_apppost_index.send();
    });

  });


});



app.listen(port, function() {
  console.log("server started on port 3000")
});






// Notes
/// 1. about the methods to type in the functions:
//// This is the "res" from the https.get request
//// function(req, res) is the sane as (req,res) =>
//// function(res) is the sane exactly as (res) =>
//// function(d) is the sane exactly as (d) =>
