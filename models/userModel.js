const { db } = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = {
  // api to register
  register: async (username, password, email) => {
    // check missing
    if (!username || !password || !email) {
      throw new Error("Thiếu thông tin");
    }

    // validating
    if (!validator.isEmail(email)) {
      throw new Error("Email không hợp lệ");
    }

    // check existed
    const isExist = await db`select * from users where email = ${email}`;
    if (isExist.length > 0) {
      throw new Error("Email đã tồn tại");
    }

    // strong password
    if (password.length < 8) {
      throw new Error("Password phải hơn 8 ký tự");
    }

    // hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db`
      insert into users (username, password, email)
      values (${username}, ${hashedPassword}, ${email})
      returning *;
    `;

    return result[0];
  },

  // api to login
  login: async (email, password) => {
    // check missing
    if (!email || !password) {
      throw new Error("Thiếu thông tin");
    }
    // validating
    if (!validator.isEmail(email)) {
      throw new Error("Email không hợp lệ");
    }

    // check existed
    const isExist = await db`select * from users where email = ${email}`;
    if (isExist.length === 0) {
      throw new Error("Email chưa đăng ký");
    }

    const user = isExist[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { user_id: isExist[0].user_id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      };
    } else {
      throw new Error("Sai mật khẩu");
    }
  },

  // api for get user infomations
  getInfo: async (user_id) => {
    const result = await db`
  SELECT 
  u.user_id,
  u.username,
  u.email,
  u.avatar_url,
  (
    SELECT json_agg(
      json_build_object(
        'artist_id', a.artist_id,
        'name', a.name,
        'image_url', a.image_url
      )
    )
    FROM follows f
    JOIN artists a ON f.artist_id = a.artist_id
    WHERE f.follower_id = u.user_id
  ) AS following,
  (
    SELECT json_agg(
      json_build_object(
        'playlist_id', l.playlist_id,
        'name', l.name,
        'cover_url', l.cover_url
      )
    )
    FROM playlists l
    WHERE l.user_id = u.user_id
  ) AS playlist
FROM users u
WHERE u.user_id = ${user_id}
`;
    return result[0];
  },

  // api to get favourite songs
  getLikedSongs: async (user_id) => {
    const result =
      await db`select s.song_id, s.title, a.name, a.image_url, s.duration, s.audio_url, s.views from likes l join songs s on l.song_id = s.song_id 
    join artists a on a.artist_id = s.artist_id where user_id = ${user_id}`;
    return result;
  },

  // api to add favourite songs
  addFavouritedSong: async (user_id, song_id) => {
    const result =
      await db`insert into likes (user_id, song_id) values (${user_id}, ${song_id}) returning *`;
    return result[0];
  },

  // api to remove favourite song
  removeFavouriteSong: async (user_id, song_id) => {
    const result =
      await db`delete from likes where user_id = ${user_id} and song_id = ${song_id} returning * `;
    return result[0];
  },

  // api to get favourite artists
  getLikedArtists: async (user_id) => {
    const result =
      await db`select a.artist_id, a.name, a.bio, a.image_url, a.country from artists a join favourite_artist f 
  on a.artist_id = f.artist_id where f.user_id = ${user_id}`;
    return result;
  },

  // api to add favourite artist
  addFavouritedArtist: async (user_id, artist_id) => {
    const result =
      await db`insert into favourite_artist (user_id, artist_id) values (${user_id}, ${artist_id}) returning *`;
    return result[0];
  },

  // api to remove favourite artist
  removeFavouriteArtist: async (user_id, artist_id) => {
    const result =
      await db`delete from favourite_artist where user_id = ${user_id} and artist_id = ${artist_id} returning * `;
    return result[0];
  },
};

module.exports = User;
