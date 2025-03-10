import { getCategories, getCategoryById } from "../models/categoryModel.js";

export const getCategoriesController = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(201).json({
      status: "success",
      code: 201,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
export const getCategoryByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ubah id ke Integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid ID FOrmat" });
    }

    const category = await getCategoryById(id);
    res.status(200).json({
      status: "success",
      code: 201,
      data: category,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
};
