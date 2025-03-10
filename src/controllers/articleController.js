import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
  updateArticle,
  getListArticle,
} from "../models/articleModel.js";
import Joi from "joi";

const createArticleVal = Joi.object({
  author: Joi.string().max(250).required(),
  judul: Joi.string().max(250).required(),
  isi: Joi.string().required(),
  referensi: Joi.string().required(),
  dilihat: Joi.number().integer().min(0).default(0),
});

export const createArticleController = async (req, res) => {
  try {
    const { error } = createArticleVal.validate(req.body);
    if (error)
      return res.status(400).json({
        status: "error",
        code: 400,
        message: error.details[0].message,
      });

    const gambarPath = req.file ? req.file.path : null;
    req.body.gambar = gambarPath;
    req.body.dilihat = 0;
    const user = await createArticle(req.body);
    res.status(201).json({ status: "success", code: 201, data: user });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const getArticlesController = async (req, res) => {
  try {
    const articles = await getArticles();
    res.status(201).json({ status: "success", code: 201, data: articles });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getListArticleController = async (req, res) => {
  try {
    const articles = await getListArticle();
    res.status(201).json({ status: "success", code: 201, data: articles });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getArticleByIdController = async (req, res) => {
  try {
    const articleId = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(articleId)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const article = await getArticleById(articleId);
    res.status(200).json({ status: "success", code: 201, data: article });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const deleteArticleController = async (req, res) => {
  try {
    const articleId = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(articleId)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const article = await deleteArticle(articleId);
    res.status(200).json({ status: "success", code: 201, data: article });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};

export const updateArticleController = async (req, res) => {
  try {
    const articleId = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(articleId)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID Format" });
    }

    const article = await updateArticle(articleId, req.body);
    res.status(200).json({ status: "success", code: 201, data: article });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
