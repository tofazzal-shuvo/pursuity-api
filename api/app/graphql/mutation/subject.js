import { statusCode } from "../../constant";
import { CategoryModel, SubcategoryModel } from "../../models";
import { CustomError } from "../../utility";

export const AddCategory = async (_, { name }) => {
  try {
    await CategoryModel.create({ name });
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Category has been added.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const AddSubcategory = async (_, { categoryId, name }) => {
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) new CustomError("Category not found!", statusCode.NOT_FOUND);
    const subcategory = await SubcategoryModel.create({ name });
    category.subcategory.push(subcategory._id);
    await category.save();
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Subject has been added.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};
