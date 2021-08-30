const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/state/cache", (req, res) => {
  console.log(req);
  res.send({status: 204});
})
  
const PORT = process.env.PORT || 3000;
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));