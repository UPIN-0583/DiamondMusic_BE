const User = require("../models/userModel");

exports.userRegister = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = await User.register(username, password, email);

    res.json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        avatar_url: newUser.avatar_url,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await User.login(email, password);
    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user_id = req.user_id;
    const userInfo = await User.getInfo(user_id);
    res.json({
      success: true,
      userInfo,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserLikedSongs = async (req, res) => {
  try {
    const user_id = req.user_id;
    console.log(user_id);
    const favouriteSongs = await User.getLikedSongs(user_id);
    res.json({
      success: true,
      favouriteSongs,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.addFavouritedSong = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { song_id } = req.body;
    const newLikedSong = await User.addFavouritedSong(user_id, song_id);
    res.json({
      success: true,
      message: "Added to favourited",
      newLikedSong,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeFavouritedSong = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { song_id } = req.body;
    const removeSong = await User.removeFavouriteSong(user_id, song_id);
    res.json({
      success: true,
      message: "Remove favourited success",
      removeSong,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserLikedArtists = async (req, res) => {
  try {
    const user_id = req.user_id;
    console.log(user_id);
    const favouriteArtists = await User.getLikedArtists(user_id);
    res.json({
      success: true,
      favouriteArtists,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.addFavouritedArtist = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { artist_id } = req.body;
    const newLikedArtist = await User.addFavouritedArtist(user_id, artist_id);
    res.json({
      success: true,
      message: "Added to favourited",
      newLikedArtist,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeFavouritedArtist = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { artist_id } = req.body;
    const removeArtist = await User.removeFavouriteArtist(user_id, artist_id);
    res.json({
      success: true,
      message: "Remove favourited success",
      removeArtist,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
