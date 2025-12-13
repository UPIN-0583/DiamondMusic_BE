const { db } = require("../config/db");

const Genre = {
  // api for get all genres
  getAll: async () => {
    const result = await db`select * from genres`;
    return result;
  },
};

module.exports = Genre;
