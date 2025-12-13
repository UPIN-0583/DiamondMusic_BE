const { db } = require("../config/db");

const Album = {
  // api for get all albums
  getAll: async () => {
    const result = await db`select * from albums`;
    return result;
  },
};

module.exports = Album;
