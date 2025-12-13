const { db } = require("../config/db");

const Artist = {
  // api for get all artists
  getAll: async () => {
    const result = await db`select * from artists`;
    return result;
  },
};

module.exports = Artist;
