const { io } = require("socket.io-client");
const axios = require("axios");

const URL = "https://claudia-teng.com";
const MAX_CLIENTS = 230;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
let finishedPeople = 0;
let records = [];

let clientCount = 0;
let interval = setInterval(createClient, CLIENT_CREATION_INTERVAL_IN_MS);

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
    const data = await axios.post(`https://claudia-teng.com/api/user/signin`, loginInfo);
    token = data.data.data.access_token;

    const socket = io(URL, {
      auth: {
        token,
      },
    });

    let start = new Date().getTime();
    socket.emit("check limit", 2);
    socket.on("check limit", (data) => {
      console.log("check limit", data);

      finishedPeople++;
      let time = (new Date().getTime() - start) / 1000;
      records.push(time);
      console.log("finishedPeople", finishedPeople);

      if (finishedPeople === MAX_CLIENTS) {
        let totalSeconds = records.reduce((a, b) => a + b);
        console.log("AVG", totalSeconds / MAX_CLIENTS);
        console.log("MAX", Math.max(...records));
        console.log("MIN", Math.min(...records));
      }
    });
  } catch (err) {
    console.log("err", err);
  }
}
