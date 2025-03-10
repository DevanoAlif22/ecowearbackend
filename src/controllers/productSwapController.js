import {
  get,
  getById,
  getByCategoryAll,
  getByCategoryList,
  createProduct,
  createGallery,
  deleteById,
  updateProduct,
  deleteGalleryById,
  addGallery,
  createComment,
  deleteCommentById,
  getList,
  getByPartner,
  getByUser,
  checkComment,
  approveComment,
  testimonyPartner,
  testimonyUser,
  getCommentByUser,
} from "../models/productSwapModel.js";
import Joi from "joi";

// Validasi input dengan Joi
const createProductVal = Joi.object({
  id_kategori: Joi.number().integer().required(),
  id_user: Joi.number().integer().required(),
  nama: Joi.string().max(100).required(),
  deskripsi: Joi.string().required(),
  ukuran: Joi.string().required(),
  alamat: Joi.string().required(),
  is_png: Joi.array().items(Joi.number().valid(0, 1)).required(),
});
const updateProductVal = Joi.object({
  id_kategori: Joi.number().integer().required(),
  id_user: Joi.number().integer().required(),
  nama: Joi.string().max(100).required(),
  deskripsi: Joi.string().required(),
  ukuran: Joi.string().required(),
  alamat: Joi.string().required(),
});
const createCommentVal = Joi.object({
  id_produk: Joi.number().integer().required(),
  id_user: Joi.number().integer().required(),
  isi: Joi.string().required(),
  alamat: Joi.string().required(),
});
export const createCommentController = async (req, res) => {
  try {
    req.body.id_produk = parseInt(req.body.id_produk, 10);
    req.body.id_user = parseInt(req.body.id_user, 10);
    const { error } = createCommentVal.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: error.details[0].message,
      });
    }

    const data = await getById(req.body.id_produk);
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Found" });
    }
    const gambarPath = req.file ? req.file.path : null;
    req.body.gambar = gambarPath;
    const newComment = await createComment(req.body);
    res.status(201).json({ status: "success", code: 201, data: newComment });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const createProductController = async (req, res) => {
  try {
    console.log(req.body);
    req.body.id_kategori = parseInt(req.body.id_kategori, 10);
    req.body.id_user = parseInt(req.body.id_user, 10);
    const { error } = createProductVal.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: error.details[0].message,
      });
    }

    const { id_kategori, id_user, nama, deskripsi, ukuran, alamat } = req.body;
    const status = "proses";
    const newProduct = await createProduct({
      id_kategori,
      id_user,
      nama,
      deskripsi,
      ukuran,
      alamat,
      status,
    });

    const galleryPaths = req.files.map((file) => file.path);
    await createGallery(galleryPaths, req.body.is_png, newProduct.id);

    res.status(201).json({ status: "success", code: 201, data: newProduct });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const createGalleryProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getById(parseInt(id, 10));
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Found" });
    }

    const galleryPaths = req.files.map((file) => file.path);
    await addGallery(galleryPaths, req.body, parseInt(id, 10));
    res.status(201).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    req.body.id_kategori = parseInt(req.body.id_kategori, 10);
    req.body.id_user = parseInt(req.body.id_user, 10);

    const { error } = updateProductVal.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "errorx",
        code: 400,
        message: error.details[0].message,
      });
    }

    const data = await getById(parseInt(req.params.id, 10));
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Found" });
    }

    req.body.id_kategori = parseInt(req.body.id_kategori, 10);
    req.body.id_user = parseInt(req.body.id_user, 10);

    const newProduct = await updateProduct(
      req.body,
      parseInt(req.params.id, 10)
    );

    res.status(201).json({ status: "success", code: 201, data: newProduct });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const deleteByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const id_user = req.body.id_user;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const data = await getById(id);
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Found" });
    }

    await deleteById(id, id_user);
    res.status(200).json({ status: "success", code: 200, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getController = async (req, res) => {
  try {
    const data = await get();
    res.status(200).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getByPartnerController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await getByPartner(id);
    res.status(201).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getByUserController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await getByUser(id);
    res.status(201).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getListController = async (req, res) => {
  try {
    const data = await getList();
    res.status(200).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getByCategoryAllController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const data = await getByCategoryAll(id);
    res.status(200).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getByCategoryListController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const data = await getByCategoryList(id);
    res.status(200).json({ status: "success", code: 201, data: data });
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

export const deleteGalleryByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const id_user = parseInt(req.body.id_user, 10);
    const id_product = parseInt(req.body.id_produk, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const data = await getById(id_product);
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Found" });
    }

    await deleteGalleryById(id, id_product, id_user);
    res.status(200).json({ status: "success", code: 200, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const deleteCommentByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const id_user = parseInt(req.body.id_user, 10);

    await deleteCommentById(id, id_user);
    res.status(200).json({ status: "success", code: 200, data: "berhasil" });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const testimonyPartnerController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const id_user = parseInt(req.body.id_user, 10);

    const gambarPath = req.file ? req.file.path : null;

    await testimonyPartner(id, id_user, gambarPath);
    res.status(200).json({ status: "success", code: 200, data: "berhasil" });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const testimonyUserController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const id_user = parseInt(req.body.id_user, 10);

    const gambarPath = req.file ? req.file.path : null;

    await testimonyUser(id, id_user, gambarPath);
    res.status(200).json({ status: "success", code: 200, data: "berhasil" });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const approveCommentController = async (req, res) => {
  try {
    console.log(req.body);
    const id_comment = parseInt(req.params.id, 10);
    const id_user = parseInt(req.body.id_user, 10);
    console.log("id_comment");
    console.log(id_comment);

    const data = await checkComment(id_comment, id_user);
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Data Not Foundz" });
    }

    const updateProduct = await approveComment(
      data.id_produk,
      id_comment,
      id_user
    );
    res.status(201).json({ status: "success", code: 201, data: updateProduct });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getCommentByuserController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await getCommentByUser(id);
    res.status(201).json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
