const axios = require("axios");

async function insertUsers() {
  for (let i = 10011; i <= 11000; i++) {
    try {
      const info = {
        name: `loadtest${i}`,
        email: `loadtest${i}@test.com`,
        password: "loadtest",
      };
      await axios.post(`https://claudia-teng.com/user/signup`, info);
      console.log("i", i);
    } catch (err) {
      console.log("err", err);
    }
  }
}

insertUsers();
