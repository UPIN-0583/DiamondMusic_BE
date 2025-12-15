const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIRecommendation = require("../models/aiRecommendationModel");

// Available genres in database
const AVAILABLE_GENRES = [
  "Pop",
  "Rock",
  "Electronic",
  "Lo-fi",
  "Indie",
  "Jazz",
  "R&B",
  "Synthwave",
  "Alternative",
  "Chillhop",
];

// Initialize Gemini AI
const initGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenerativeAI(apiKey);
};

// AI prompt to analyze user message and suggest genres
const createGenrePrompt = (userMessage) => {
  return `Bạn là một AI chuyên gia về âm nhạc. Nhiệm vụ của bạn là phân tích tin nhắn của người dùng và gợi ý thể loại nhạc phù hợp.

Các thể loại nhạc có sẵn trong database: ${AVAILABLE_GENRES.join(", ")}

Tin nhắn của người dùng: "${userMessage}"

Hãy phân tích tâm trạng, sở thích hoặc yêu cầu trong tin nhắn và trả về JSON theo format sau:
{
  "genres": ["genre1", "genre2"],
  "reason": "Lý do bạn gợi ý những thể loại này bằng tiếng Việt"
}

Quy tắc:
1. Chỉ chọn từ các thể loại có sẵn trong database
2. Có thể gợi ý 1-3 thể loại phù hợp nhất
3. Nếu không thể xác định, hãy gợi ý "Pop" vì đây là thể loại phổ biến
4. Trả về CHÍNH XÁC tên thể loại (case-sensitive)
5. CHỈ trả về JSON, không có text khác

Ví dụ:
- "Tôi đang buồn" -> Lo-fi, R&B, Jazz
- "Tôi muốn nghe nhạc sôi động" -> Pop, Electronic, Rock
- "Tôi cần tập trung học bài" -> Lo-fi, Chillhop, Jazz
- "Tôi đang đi chơi với bạn bè" -> Pop, Electronic, Indie`;
};

const aiRecommendationController = {
  // Main endpoint: Get music recommendations based on user message
  getRecommendations: async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tin nhắn để nhận gợi ý nhạc",
        });
      }

      // Initialize Gemini AI
      const genAI = initGeminiAI();
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Generate AI response
      const prompt = createGenrePrompt(message);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse AI response
      let aiSuggestion;
      try {
        // Extract JSON from response (in case AI adds extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiSuggestion = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", text);
        // Fallback to Pop if parsing fails
        aiSuggestion = {
          genres: ["Pop"],
          reason: "Không thể phân tích yêu cầu, gợi ý nhạc Pop phổ biến",
        };
      }

      // Validate genres
      const validGenres = aiSuggestion.genres.filter((genre) =>
        AVAILABLE_GENRES.some((g) => g.toLowerCase() === genre.toLowerCase())
      );

      if (validGenres.length === 0) {
        validGenres.push("Pop");
      }

      // Get songs from database based on suggested genres
      const songs = await AIRecommendation.getSongsByGenreNames(validGenres);

      return res.status(200).json({
        success: true,
        data: {
          userMessage: message,
          suggestedGenres: validGenres,
          reason: aiSuggestion.reason,
          songs: songs,
          totalSongs: songs.length,
        },
      });
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xử lý gợi ý nhạc",
        error: error.message,
      });
    }
  },

  // Get available genres
  getAvailableGenres: async (req, res) => {
    try {
      const genres = await AIRecommendation.getAllGenres();
      return res.status(200).json({
        success: true,
        data: genres,
      });
    } catch (error) {
      console.error("Get Genres Error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách thể loại",
        error: error.message,
      });
    }
  },

  // Get songs by specific genre
  getSongsByGenre: async (req, res) => {
    try {
      const { genreName } = req.params;

      if (!genreName) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp tên thể loại",
        });
      }

      const songs = await AIRecommendation.getSongsByGenreName(genreName);

      return res.status(200).json({
        success: true,
        data: {
          genre: genreName,
          songs: songs,
          totalSongs: songs.length,
        },
      });
    } catch (error) {
      console.error("Get Songs By Genre Error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy bài hát theo thể loại",
        error: error.message,
      });
    }
  },
};

module.exports = aiRecommendationController;
