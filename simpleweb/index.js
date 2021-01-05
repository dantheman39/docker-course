const express = require("express"); 

const app = express();

const home = (req, res) => {
  res.send("Bye there");
};

app.get("/", home);

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
