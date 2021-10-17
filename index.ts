// === GENERATEED CODE === do not modify by hand.
import express from "express";
import dotenv from "dotenv";
import fs, { lstatSync, existsSync } from "fs";
import util from "util";
import app1 from './apps/app1'
import app2 from './apps/app2'

dotenv.config();

const app = express();

app.get("/", async (req, res) => {
  res.json({
    hello: "world!",
    apps: (await util.promisify(fs.readdir)("./apps"))
        .filter(dir => lstatSync('./apps/' + dir).isDirectory() && existsSync('./apps/' + dir + '/' + 'index.ts'))
        .map(dir => ({
            name: dir,
            path: process.env.BASE_URL + "/" + dir
        })),
  });
});

app.use("/app1", app1)
app.use("/app2", app2)

app.listen(3000);