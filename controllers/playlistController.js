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

exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;
    const addedSong = await Playlist.addToPlaylist(playlist_id, song_id);
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
