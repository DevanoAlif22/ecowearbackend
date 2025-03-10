import bcrypt from "bcrypt";
import {
  register,
  getByEmail,
  getPartner,
  approvePartner,
} from "../models/authModel.js";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid"; // Import UUID

const registerSchema = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  id_role: Joi.number().valid(2, 3).required(),
  poin: Joi.number().valid(0).required(),
  jenis: Joi.string().optional().allow(null, ""),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const registerController = async (req, res) => {
  try {
    const { nama, email, password, jenis, id_role, poin } = req.body;

    // Validasi input
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "error", code: 400, message: error.message });

    if (Number(id_role) === 3 && !req.file) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Dokumen pendukung harus di isi",
      });
    }

    const checkEmail = await getByEmail(email);
    if (checkEmail !== null) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Email sudah digunakan" });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Path dokumen jika ada
    const dokumenPath = req.file ? req.file.path : null;
    const status = id_role === "3" ? "proses" : "aktif";

    const uuid_session = uuidv4();
    // Simpan ke database
    const data = await register({
      nama,
      email,
      uuid_session,
      status,
      jenis,
      password: hashedPassword,
      id_role: Number(id_role),
      poin: Number(poin),
      dokumen_pendukung: dokumenPath, // Simpan path file ke database
    });

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Berhasil membuat akun",
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "error", code: 400, message: error.message });

    // Cari user berdasarkan email
    const user = await getByEmail(email);
    if (user === null) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Email atau password salah",
      });
    } else if (user[0].status === "proses") {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Akun anda sedang dalam proses verifikasi",
      });
    }
    // Bandingkan password
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Email atau password salah",
      });
    }
    const uuid_session = user[0].uuid_session;
    const id = user[0].id;
    const id_role = user[0].id_role;
    const profil = user[0].profil;
    const nama = user[0].nama;
    const jenis = parseInt(user[0].id_role) === 3 ? user[0].jenis : "";
    res.status(200).json({
      status: "success",
      code: 201,
      data: {
        uuid_session,
        id,
        id_role,
        jenis,
        profil,
        nama,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getPartnerController = async (req, res) => {
  try {
    const data = await getPartner();
    res.status(201).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const approvePartnerController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await approvePartner(id);
    res.status(201).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
