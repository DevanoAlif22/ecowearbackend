import {
  get,
  getById,
  getBodyById,
  checkById,
  updateProfileById,
} from "../models/profileUserModel.js";
import Joi from "joi";

const updateProfileVal = Joi.object({
  nama: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  nomor_telepon: Joi.string()
    .pattern(/^[0-9]+$/)
    .max(15)
    .required(),
  bio: Joi.string().allow(null, ""),
  profil: Joi.string().allow(null, ""),
  badan: Joi.string().allow(null, ""),
  nomor_rekening: Joi.string()
    .pattern(/^[0-9]+$/)
    .max(20)
    .optional(),
  nama_rekening: Joi.string().max(100).optional(),
  poin: Joi.string().max(100).optional(),
});

export const getController = async (req, res) => {
  try {
    const data = await get();
    res.status(200).json({ status: "success", code: 200, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const updateByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { error } = updateProfileVal.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "errorx",
        code: 400,
        message: error.details[0].message,
      });
    }

    const data = await checkById(id);
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Found" });
    }

    // salah disini
    const gambarPathProfil = req.files.profil
      ? req.files.profil[0].path
      : data.profil;
    req.body.profil = gambarPathProfil;
    const profilCheck = req.files.profil ? true : false;
    req.body.profil = gambarPathProfil;
    const gambarPathBadan = req.files.badan
      ? req.files.badan[0].path
      : data.badan;
    req.body.badan = gambarPathBadan;
    const badanCheck = req.files.badan ? true : false;

    const updateProfile = await updateProfileById(
      req.body,
      id,
      profilCheck,
      badanCheck
    );

    res.status(201).json({ status: "success", code: 201, data: updateProfile });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const data = await getById(id);
    res.status(200).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getBodyByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const data = await getBodyById(id);
    res.status(200).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
