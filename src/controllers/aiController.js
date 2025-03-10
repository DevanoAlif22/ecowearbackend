import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyC0MUjmv1vUiY-vMu-zw-oDhU01G3jFydg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getPromptController = async (req, res) => {
  try {
    const userQuery = req.body.content;

    // Petunjuk sistem dalam bahasa Indonesia
    const systemPrompt = `Anda adalah pakar fashion dan keberlanjutan yang hanya menjawab pertanyaan tentang:
- Tren dan gaya fashion
- Fashion berkelanjutan dan ramah lingkungan
- Dampak lingkungan dari industri fashion
- Produksi pakaian yang etis
- Sejarah dan pengaruh fashion
- Bahan dan tekstil dalam pakaian
- Daur ulang dan upcycling dalam fashion

Jika pertanyaan tidak terkait dengan topik-topik tersebut, jawab hanya dengan: "Konten yang dikirim diluar tema"

PENTING: Semua jawaban HARUS dalam bahasa Indonesia, jawab dengan satu paragraf saja dan tidak ada simbol-simbol seperti *

Tolong jawab pertanyaan ini jika terkait dengan topik di atas: ${userQuery}`;

    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    res.status(200).json({ status: "success", code: 200, data: aiResponse });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
