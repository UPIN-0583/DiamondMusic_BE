const { db } = require("../config/db");

const Playlist = {
  // api for get user playlists
  getAll: async (user_id) => {
    const result =
      await db`select p.playlist_id, p.name, p.description, p.cover_url, (
  select json_agg(
  json_build_object(
  'song_id', ps.song_id,
  'added_at', ps.added_at,
  'title', s.title,
  'duration', s.duration,
  'audio_url', s.audio_url,
  'views', s.views,
  'artist_name', a.name 
  )
  ) as songs
  from playlist_songs ps 
  join songs s on ps.song_id = s.song_id
  join artists a on s.artist_id = a.artist_id 

) from playlists p where user_id = ${user_id}`;
    return result;
  },

  // api to add playlist for user
  addPlaylist: async (user_id, name) => {
    const result =
      await db`insert into playlists (user_id, name) values (${user_id}, ${name}) returning *`;
    return result;
  },

  // api to add song to playlist
  addToPlaylist: async (playlist_id, song_id) => {
    const result =
      await db`insert into playlist_songs (playlist_id, song_id) values (${playlist_id}, ${song_id}) returning *`;
    return result;
  },

  // api to remove song from playlist
  removeFromPlaylist: async (playlist_id, song_id) => {
    const result =
      await db`delete from playlist_songs where playlist_id = ${playlist_id} and song_id = ${song_id} returning *`;
    return result;
  },
};

module.exports = Playlist;
