const { db } = require("../config/db");

const Song = {
  // api for get all songs
  getAll: async () => {
    const result =
      await db`select a.artist_id, a.name, a.image_url as artist_image_url, s.song_id, s.title, s.duration, s.audio_url, s.image_url, s.views from songs s join artists a on s.artist_id = a.artist_id`;
    return result;
  },
};

module.exports = Song;
