import fs, { readdir, writeFile, lstatSync } from "fs";
import util from "util";

const template = `// === GENERATEED CODE === do not modify by hand.
import express from "express";
import dotenv from "dotenv";
import fs, { lstatSync, existsSync } from "fs";
import util from "util";
#importlist

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

#applist

app.listen(3000);`;

const main = async () => {
  try {
    util.promisify(writeFile)(
      "./index.ts",
      template
        .replace(
          "#importlist",
          (await util.promisify(readdir)("./apps"))
          .filter((dir) => fs.lstatSync(`./apps/${dir}`).isDirectory() && fs.existsSync(`./apps/${dir}/index.ts`) )
          .map((dir) => {
              return `import ${dir} from './apps/${dir}';`;
            })
            .join("\n")
        )
        .replace(
          "#applist",
          (await util.promisify(readdir)("./apps"))
            .filter((dir) => fs.lstatSync(`./apps/${dir}`).isDirectory() && fs.existsSync(`./apps/${dir}/index.ts`) )
            .map((dir) => {
              return `app.use("/${dir}", ${dir});`;
            })
            .join("\n")
        )
    );
  } catch (e) {
    console.error("Error writing index file!", e);
  }
};

main();
