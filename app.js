const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const https = require("https");
const { post } = require("request");

const request = require("request");
const { Z_ASCII } = require("zlib");

//sets our local folder as this static folder
// and allows our server to use our css
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log("yurr");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  let first = req.body.fname;
  let last = req.body.last;

  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first,
          LNAME: last,
        },
      },
    ],
  };
  let jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "sol:f61d20267e44787af484170a118ae783-us6",
  };
  const url = "https://us6.api.mailchimp.com/3.0/lists/8df1c89bc8";

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

//api key
//f61d20267e44787af484170a118ae783-us6
//list id
// 8df1c89bc8
