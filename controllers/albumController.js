const Album = require("../models/albumModel");

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.getAll();
    res.json({
      success: true,
      albums,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
