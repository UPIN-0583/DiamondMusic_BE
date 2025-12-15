const { db } = require("../config/db");

const AIRecommendation = {
  // Get songs by genre name
  getSongsByGenreName: async (genreName) => {
    const result = await db`
      SELECT 
        s.song_id, 
        s.title, 
        s.duration, 
        s.audio_url, 
        s.image_url, 
        s.views,
        a.artist_id, 
        a.name as artist_name, 
        a.image_url as artist_image_url,
        g.genre_id,
        g.name as genre_name
      FROM songs s
      JOIN artists a ON s.artist_id = a.artist_id
      JOIN genres g ON s.genre_id = g.genre_id
      WHERE LOWER(g.name) = LOWER(${genreName})
      ORDER BY s.views DESC
    `;
    return result;
  },

  // Get all available genres
  getAllGenres: async () => {
    const result = await db`SELECT genre_id, name FROM genres`;
    return result;
  },

  // Get songs by multiple genre names
  getSongsByGenreNames: async (genreNames) => {
    const lowerGenreNames = genreNames.map((name) => name.toLowerCase());
    const result = await db`
      SELECT 
        s.song_id, 
        s.title, 
        s.duration, 
        s.audio_url, 
        s.image_url, 
        s.views,
        a.artist_id, 
        a.name as artist_name, 
        a.image_url as artist_image_url,
        g.genre_id,
        g.name as genre_name
      FROM songs s
      JOIN artists a ON s.artist_id = a.artist_id
      JOIN genres g ON s.genre_id = g.genre_id
      WHERE LOWER(g.name) = ANY(${lowerGenreNames})
      ORDER BY s.views DESC
    `;
    return result;
  },
};

module.exports = AIRecommendation;
