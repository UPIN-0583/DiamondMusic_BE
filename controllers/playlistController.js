const Playlist = require("../models/playlistModel");

exports.getPlaylists = async (req, res) => {
  try {
    const user_id = req.user_id;
    const playlists = await Playlist.getAll(user_id);
    res.json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.addPlaylist = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { name } = req.body;
    const playlist = await Playlist.addPlaylist(user_id, name);
    if (!playlist) {
      return res.json({
        success: false,
        message: "Failed to add playlist",
      });
    }
    res.json({
      success: true,
      message: "Playlist added successfully",
      playlist,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.renamePlaylist = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { playlist_id, name } = req.body;
    const playlist = await Playlist.renamePlaylist(playlist_id, user_id, name);

    if (!playlist || playlist.length === 0) {
      return res.json({
        success: false,
        message: "Failed to rename playlist or playlist not found",
      });
    }

    res.json({
      success: true,
      message: "Renamed successfully",
      playlist: playlist[0],
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { playlist_id } = req.body;
    const playlist = await Playlist.deletePlaylist(playlist_id, user_id);

    if (!playlist || playlist.length === 0) {
      return res.json({
        success: false,
        message: "Failed to delete playlist or not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
      playlist: playlist[0],
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;
    const addedSong = await Playlist.addToPlaylist(playlist_id, song_id);

    if (!addedSong || addedSong.length === 0) {
      return res.json({
        success: false,
        message: "Song already in playlist or failed",
      });
    }

    res.json({
      success: true,
      message: "Added to playlist",
      addedSong,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.remveFromPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;
    const removedSong = await Playlist.removeFromPlaylist(playlist_id, song_id);
    res.json({
      success: true,
      message: "Remove from playlist success",
      removedSong,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPlaylistWithSongs = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { name, song_ids } = req.body;

    if (!name) {
      return res.json({
        success: false,
        message: "Playlist name is required",
      });
    }

    const result = await Playlist.createPlaylistWithSongs(
      user_id,
      name,
      song_ids || []
    );

    res.json({
      success: true,
      message: `Created playlist with ${result.addedSongs} songs`,
      playlist: result.playlist,
      addedSongs: result.addedSongs,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
