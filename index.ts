import express from "express";
import { cwd } from "process";

const app = express();

app.get("/", async (req, res) => {
  res.json({
    hello: "world!",
    dirname: __dirname,
    cwd: cwd(),
  });
});

app.listen(3000);
