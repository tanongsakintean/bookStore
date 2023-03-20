const express = require("express");
const router = require("./routes");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/", router);

app.listen(3001, () => {
  console.log("localhost is running on port 3000");
});
