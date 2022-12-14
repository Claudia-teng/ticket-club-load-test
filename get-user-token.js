const axios = require("axios");
const fs = require("fs");

const MAX_CLIENTS = 20000;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;

let clientCount = 19000;
let interval = setInterval(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
const tokens = {};
let finishedPeople = 19000;

async function createClient() {
  clientCount++;
  if (clientCount > MAX_CLIENTS) {
    return clearInterval(interval);
  }
  console.log("clientCount", clientCount);

  let token;
  try {
    const loginInfo = {
      email: `loadtest${clientCount}@test.com`,
      password: "loadtest",
    };
    const data = await axios.post(`https://claudia-teng.com/user/signin`, loginInfo);
    token = data.data.data.access_token;
    finishedPeople++;
    tokens[finishedPeople] = token;
    console.log("finishedPeople", finishedPeople);

    if (finishedPeople === MAX_CLIENTS) {
      fs.writeFile("tokens.json", JSON.stringify(tokens), function (err) {
        if (err) console.log("err", err);
      });
    }
  } catch (err) {
    console.log("err", err);
  }
}
