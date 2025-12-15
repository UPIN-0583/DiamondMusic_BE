const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const { initDB } = require("./config/db.js");
const connectCloudinary = require("./config/cloudinary.config.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectCloudinary();
initDB();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const songRouter = require("./routes/songRoute.js");
const playlistRouter = require("./routes/playlistRoute.js");
const gplaylistRouter = require("./routes/gplaylistRoute.js");
const genreRouter = require("./routes/genreRoute.js");
const artistRouter = require("./routes/artistRoute.js");
const albumRouter = require("./routes/albumRoute.js");
const userRouter = require("./routes/userRoute.js");
const aiRecommendationRouter = require("./routes/aiRecommendationRoute.js");
const lyricsRouter = require("./routes/lyricsRoute.js");

app.use("/api/song", songRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/gplaylist", gplaylistRouter);
app.use("/api/genre", genreRouter);
app.use("/api/artist", artistRouter);
app.use("/api/album", albumRouter);
app.use("/api/user", userRouter);
app.use("/api/ai", aiRecommendationRouter);
app.use("/api/lyrics", lyricsRouter);

app.listen(5000, () => {
  console.log("Server is running at port", PORT);
});
