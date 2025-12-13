const { db } = require("../config/db");

const GPlaylist = {
  // api for get all global_playlists
  getAll: async () => {
    const result = await db`select * from playlists_global`;
    return result;
  },
};

module.exports = GPlaylist;
