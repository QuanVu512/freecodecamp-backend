const http = require("http");
const fsPromises = require("fs/promises");
const fs = require("fs");
const crypto = require("crypto");
const os = require("os");
const path = require("path");

async function main() {
  const fullPath = path.join(__dirname, "assets", "poem.txt");
  console.log(fullPath);

  // const parts = path.parse("/home/user/assets/poem.txt");
  // console.log(parts);
// console.log(process.version)
// console.log(process.platform)
// console.log(process.env.NODE_ENV)
// console.log(process.argv); 
// console.log(process.argv[2]);
// console.log(process.stdout.write('Hello from stdout\n' ));
// console.log(process.stderr.write('Hello from stderr\n'));
// const readable = fs.createReadStream("assets/poem.txt", { encoding: "utf8" });

// readable.on("data", (chunk) => {
//   console.log(chunk);
// });

// readable.on("end", () => {
//   console.log("Done reading");
// }); 
// const writable = fs.createWriteStream("assets/stream-output.txt");
// writable.write("First chunk\n");
// writable.write("Second chunk\n");
// writable.end();

const readable = fs.createReadStream("assets/poem.txt");
const writable = fs.createWriteStream("assets/stream-output.txt");
readable.pipe(writable);
};

main();
// Starter file — add your code here
