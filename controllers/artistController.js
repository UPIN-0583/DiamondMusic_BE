const Artist = require("../models/artistModel");

exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.getAll();
    res.json({
      success: true,
      artists,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
