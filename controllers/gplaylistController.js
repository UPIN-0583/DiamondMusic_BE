const GPlaylist = require("../models/gplaylistModel");

exports.getGPlaylists = async (req, res) => {
  try {
    const playlists = await GPlaylist.getAll();
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

exports.getPlaylistDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await GPlaylist.getGPlaylistSongs(id);
    res.json({
      success: true,
      songs,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
