const { io } = require("socket.io-client");
const axios = require("axios");

const URL = "https://claudia-teng.com";
const MAX_CLIENTS = 100;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
let finishedPeople = 0;
let records = [];

let clientCount = 0;
let interval = setInterval(createClient, CLIENT_CREATION_INTERVAL_IN_MS);

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

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
      finishedPeople++;
      let time = (new Date().getTime() - start) / 1000;
      records.push(time);
      console.log("finishedPeople", finishedPeople);
      console.log("check limit", data);
      if (finishedPeople === MAX_CLIENTS) {
        let totalSeconds = records.reduce((a, b) => a + b);
        console.log("AVG", totalSeconds / MAX_CLIENTS);
        console.log("MAX", Math.max(...records));
        console.log("MIN", Math.min(...records));
      }
    });

    // socket.on("self select seat", (data) => {
    //   console.timeEnd("time");
    //   if (!data.error) {
    //     console.log("self select seat", data);
    //   } else {
    //     console.log("error", data.error);
    //   }
    // });

    // const areaId = getRandomArbitrary(9, 1);
    // const row = getRandomArbitrary(9, 1);
    // const column = getRandomArbitrary(9, 1);

    // setTimeout(() => {
    //   const seatInfo = {
    //     sessionId: 2,
    //     areaId,
    //     row,
    //     column,
    //     rowIndex: row - 1,
    //     columnIndex: column - 1,
    //   };
    //   socket.emit("select seat", seatInfo);
    // }, 10000);
  } catch (err) {
    console.log("err", err);
  }
}
