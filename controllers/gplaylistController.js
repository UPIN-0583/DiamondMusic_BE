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
