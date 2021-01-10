import { statusCode } from "../../constant";
import { TutorOfferModel } from "../../models";

export const FetchTutorOffer = async (_, __, user) => {
  try {
    const count = await TutorOfferModel.countDocuments({});
    const result = await TutorOfferModel.find({tutor: user._id})

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
