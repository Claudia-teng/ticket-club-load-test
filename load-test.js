const { io } = require("socket.io-client");
const axios = require("axios");

const URL = "https://claudia-teng.com";
const MAX_CLIENTS = 100;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const record = [];

let clientCount = 0;
let interval = setInterval(createClient, CLIENT_CREATION_INTERVAL_IN_MS);

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function createClient() {
  clientCount++;
  console.log("clientCount", clientCount);
  if (clientCount >= MAX_CLIENTS) {
    return clearInterval(interval);
  }

  let token;
  try {
    const loginInfo = {
      email: `loadtest${clientCount}@test.com`,
      password: "loadtest",
    };
    let start = new Date().getTime();
    const data = await axios.post(`https://claudia-teng.com/api/user/signin`, loginInfo);
    console.log("time", (new Date().getTime() - start) / 1000);
    token = data.data.data.access_token;

    // const socket = io(URL, {
    //   auth: {
    //     token,
    //   },
    // });

    // let start = new Date().getTime();
    // socket.emit("check limit", 2);
    // socket.on("check limit", (data) => {
    //   console.log("time", (new Date().getTime() - start) / 1000);
    //   console.log("check limit", data);
    // });

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
