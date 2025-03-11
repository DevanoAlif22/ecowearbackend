import multer from "multer";
import fs from "fs";
import path from "path";

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("src/uploads", "dokumenpendukung");

    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Simpan dengan timestamp
  },
});

const uploadRegister = multer({ storage });

export default uploadRegister;
