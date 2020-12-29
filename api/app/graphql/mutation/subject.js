import { statusCode } from "../../constant";
import { CategoryModel, SubcategoryModel } from "../../models";
import { CustomError } from "../../utility";

export const AddCategory = async (_, { name }) => {
  try {
    await CategoryModel.create({ name });
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Category has been created.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};
export const EditCategory = async (_, { categoryId, name }) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(categoryId, {
      name,
    });
    if (!category)
      throw new CustomError("Category not found!", statusCode.NOT_FOUND);
    return {
      code: statusCode.UPDATED,
      success: true,
      message: "Category has been updated.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const DeleteCategory = async (_, { categoryId }) => {
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category)
      throw new CustomError("Category not found!", statusCode.NOT_FOUND);
    //deleting all subcategory
    await SubcategoryModel.deleteMany({
      _id: { $in: category?.subcategory || [] },
    });
    // deleting category itself
    const ensureDeleted = await category.delete();
    if (!ensureDeleted) throw CustomError("Something went wrong");
    return {
      code: statusCode.DELETED,
      success: true,
      message: "Category has been deleted.",
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
    if (!category)
      throw new CustomError("Category not found!", statusCode.NOT_FOUND);
    const subcategory = await SubcategoryModel.create({
      name,
      category: categoryId,
    });
    category.subcategory.push(subcategory._id);
    await category.save();
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Subject has been created.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const EditSubcategory = async (_, { subcategoryId, name }) => {
  try {
    const subcategory = await SubcategoryModel.findByIdAndUpdate(
      subcategoryId,
      { name }
    );
    if (!subcategory)
      throw new CustomError("Subject not found!", statusCode.NOT_FOUND);
    return {
      code: statusCode.UPDATED,
      success: true,
      message: "Subject has been updated.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const DeleteSubcategory = async (_, { subcategoryId }) => {
  try {
    const subcategory = await SubcategoryModel.findByIdAndDelete(subcategoryId);
    if (!subcategory)
      throw new CustomError("Subject not found!", statusCode.NOT_FOUND);
    return {
      code: statusCode.DELETED,
      success: true,
      message: "Subject has been deleted.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const DeleteSubcategoryFromUser = async (_, { subcategoryId }, user) => {
  try {
    user.subcategory = user.subcategory.filter(
      (item) => item !== subcategoryId
    );
    await user.save();
    return {
      code: statusCode.DELETED,
      success: true,
      message: "Subject has been deleted.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};
