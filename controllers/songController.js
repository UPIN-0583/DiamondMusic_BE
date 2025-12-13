const Song = require("../models/songModel.js");

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.getAll();
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
