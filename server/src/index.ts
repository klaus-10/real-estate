import http from "http";
const app = require("./app");

const server = http.createServer(app);

console.clear();

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});
