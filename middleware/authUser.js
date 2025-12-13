const jwt = require("jsonwebtoken");

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized login again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user_id = token_decode.user_id;

    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = authUser;
