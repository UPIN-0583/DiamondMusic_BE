const { db } = require("../config/db");

const Playlist = {
  // api for get user playlists
  getAll: async (user_id) => {
    const result = await db`
      select p.playlist_id, p.name, p.user_id,
      (
        select coalesce(json_agg(
          json_build_object(
            'song_id', s.song_id,
            'title', s.title,
            'artist', a.name,
            'artist_id', a.artist_id,
            'image', a.image_url,
            'url', s.audio_url,
            'id', s.song_id::text,
            'duration', s.duration
          )
        ), '[]'::json)
        from playlist_songs ps
        join songs s on ps.song_id = s.song_id
        join artists a on s.artist_id = a.artist_id
        where ps.playlist_id = p.playlist_id
      ) as songs
      from playlists p
      where p.user_id = ${user_id}
    `;
    return result;
  },

  // api to add playlist for user
  addPlaylist: async (user_id, name) => {
    const result =
      await db`insert into playlists (user_id, name) values (${user_id}, ${name}) returning *`;
    return result;
  },

  // api to rename playlist
  renamePlaylist: async (playlist_id, user_id, name) => {
    const result =
      await db`update playlists set name = ${name} where playlist_id = ${playlist_id} and user_id = ${user_id} returning *`;
    return result;
  },

  // api to delete playlist
  deletePlaylist: async (playlist_id, user_id) => {
    // Assuming cascade delete or handle playlist_songs delete
    await db`delete from playlist_songs where playlist_id = ${playlist_id}`;
    const result =
      await db`delete from playlists where playlist_id = ${playlist_id} and user_id = ${user_id} returning *`;
    return result;
  },

  // api to add song to playlist
  addToPlaylist: async (playlist_id, song_id) => {
    // Check if exists
    const check =
      await db`select * from playlist_songs where playlist_id = ${playlist_id} and song_id = ${song_id}`;
    if (check.length > 0) return [];

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

  // api to create playlist with songs
  createPlaylistWithSongs: async (user_id, name, song_ids) => {
    // Create playlist first
    const playlistResult =
      await db`insert into playlists (user_id, name) values (${user_id}, ${name}) returning *`;
    const playlist = playlistResult[0];

    if (!playlist || !song_ids || song_ids.length === 0) {
      return { playlist, addedSongs: 0 };
    }

    // Add all songs to the playlist
    let addedCount = 0;
    for (const song_id of song_ids) {
      try {
        await db`insert into playlist_songs (playlist_id, song_id) values (${playlist.playlist_id}, ${song_id})`;
        addedCount++;
      } catch (err) {
        // Skip duplicates or errors
        console.log(`Could not add song ${song_id}:`, err.message);
      }
    }

    return { playlist, addedSongs: addedCount };
  },
};

module.exports = Playlist;
