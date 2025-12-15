const { db } = require("../config/db");

const GPlaylist = {
  // api for get all global_playlists with image
  getAll: async () => {
    const result = await db`
      select 
        p.playlist_id, 
        p.name, 
        p.description,
        p.image_url
      from playlists_global p
    `;
    return result;
  },

  getGPlaylistSongs: async (id) => {
    // Use playlist_id to ensure consistent songs for each playlist
    // Instead of random, use modulo to get deterministic subset based on playlist id
    const offset = (parseInt(id) % 5) * 10; // Different offset per playlist
    const result = await db`
      select s.song_id, s.title, s.duration, s.audio_url, s.image_url, s.views, 
             a.artist_id, a.name, a.image_url as artist_image
      from songs s
      join artists a on s.artist_id = a.artist_id
      order by s.song_id
      limit 10 offset ${offset}
    `;
    return result;
  },
};

module.exports = GPlaylist;
