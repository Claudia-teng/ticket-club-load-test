const axios = require("axios");
const MAX_CLIENTS = 10;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;

let interval = setInterval(selectSeat, CLIENT_CREATION_INTERVAL_IN_MS);
let clientCount = 0;
let finishedPeople = 0;
const records = [];

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function selectSeat() {
  clientCount++;
  if (clientCount > MAX_CLIENTS) {
    return clearInterval(interval);
  }
  console.log("clientCount", clientCount);

  try {
    const loginInfo = {
      email: `loadtest${clientCount}@test.com`,
      password: "loadtest",
    };
    const data = await axios.post(`https://claudia-teng.com/api/user/signin`, loginInfo);
    let token = data.data.data.access_token;

    const areaId = getRandomArbitrary(9, 1);
    const row = getRandomArbitrary(9, 1);
    const column = getRandomArbitrary(9, 1);
    const seatInfo = {
      sessionId: 2,
      areaId,
      row,
      column,
      rowIndex: row - 1,
      columnIndex: column - 1,
    };
    let start = new Date().getTime();
    const response = await axios.post(`https://claudia-teng.com/api/seat/select`, seatInfo, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res", response.data);

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
  } catch (err) {
    console.log(err, "err");
  }
}
