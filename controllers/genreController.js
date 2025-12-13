const Genre = require("../models/genreModel");

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.getAll();
    res.json({
      success: true,
      genres,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
