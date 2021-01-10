import { statusCode } from "../../constant";
import { CategoryModel } from "../../models";

export const FetchSubjectsForAdmin = async (_, { limit = 100, offset = 0 }) => {
  try {
    const count = await CategoryModel.countDocuments({});
    const result = await CategoryModel.find({})
      .populate("subcategory")
      .skip(limit ? offset * limit : 0)
      .limit(limit);

    return {
      code: statusCode.OK,
      count,
      result,
      message: "Fetch successfully..",
      success: true,
    };
  } catch (err) {
    return {
      code: statusCode.INTERNAL_ERROR,
      count: 0,
      result: [],
      message: "Something went wrong.",
      success: false,
    };
  }
};

export const FetchSubjectsForUser = async (_, { limit = 100, offset = 0 }) => {
  try {
    const count = await CategoryModel.countDocuments({});
    const result = await CategoryModel.find({})
      .populate("subcategory")
      .skip(limit ? offset * limit : 0)
      .limit(limit);

    return {
      code: statusCode.OK,
      count,
      result,
      message: "Fetch successfully.",
      success: true,
    };
  } catch (err) {
    return {
      code: statusCode.INTERNAL_ERROR,
      count: 0,
      result: [],
      message: "Something went wrong.",
      success: false,
    };
  }
};
