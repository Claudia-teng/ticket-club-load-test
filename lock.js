const { io } = require("socket.io-client");
const axios = require("axios");

const URL = "https://claudia-teng.com";
const MAX_CLIENTS = 100;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
let finishedPeople = 0;
let records = [];

let clientCount = 0;
let interval = setInterval(createClient, CLIENT_CREATION_INTERVAL_IN_MS);

async function createClient() {
  clientCount++;
  console.log("clientCount", clientCount);
  if (clientCount > MAX_CLIENTS) {
    return clearInterval(interval);
  }

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
    });

    socket.on("self select seat", (data) => {
      if (!data.error) {
        console.log("self select seat", data);
      } else {
        console.log("error", data.error);
      }

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

    setTimeout(() => {
      const seatInfo = {
        sessionId: 2,
        areaId: 1,
        row: 1,
        column: 1,
        rowIndex: 0,
        columnIndex: 0,
      };
      socket.emit("select seat", seatInfo);
    }, 10000);
  } catch (err) {
    console.log("err", err);
  }
}
