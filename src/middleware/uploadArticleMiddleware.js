import multer from "multer";
import fs from "fs";
import path from "path";

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("src/uploads", "article");
    //  ini kan hasilnya ini src\uploads\article\1740138275884.jpg
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const uploadArticle = multer({ storage });

export default uploadArticle;
