const { db } = require("../config/db");

const Artist = {
  // api for get all artists
  getAll: async () => {
    const result = await db`select * from artists`;
    return result;
  },

  getArtistSongs: async (artist_id) => {
    const result = await db`
      select s.*, a.name as artist_name, a.image_url as artist_image 
      from songs s 
      join artists a on s.artist_id = a.artist_id 
      where s.artist_id = ${artist_id}
    `;
    return result;
  },
};

module.exports = Artist;
