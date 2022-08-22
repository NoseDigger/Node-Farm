const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./moduels/replaceTemplate");
//////////            FIles                  /////////////////

// Blocking Synchronus Code not good practice
// const someInput = fs.readFileSync("./txt/input.txt", "utf-8");

// const txt = `This is some weird information ${someInput}\n Created on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", txt);
// console.log(`oshoo`);

//Non Blocking ASynchronus Code not good practice

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data2) => {
//       console.log(data2);
//       fs.writeFile(
//         "./txt/new-text.txt",
//         `${data1}\n${data2}`,
//         "utf-8",
//         (err) => {
//           console.log(`Your file have been written 😃`);
//         }
//       );
//       fs.readFile("./txt/new-text.txt", "utf-8", (err, data3) => {
//         console.log(data3);
//       });
//     });
//   });
// });
// console.log(`My name is kHan`);

//////////            Server                 /////////////////

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  let { query, pathname } = url.parse(req.url, true);
  const query1 = JSON.parse(JSON.stringify(query));
  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHTML = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    let output = templateOverview.replace(`{%PRODUCT_CARDS%}`, cardsHTML);
    res.end(output);
  }
  //Product Page
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[Number(query1.id)];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  //Api page
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  //Not Found Page
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listing to server");
});
console.log("bacha");
