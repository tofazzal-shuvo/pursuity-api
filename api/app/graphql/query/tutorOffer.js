import { statusCode } from "../../constant";
import { TutorOfferModel } from "../../models";

export const FetchTutorOffer = async (_, __, { user }) => {
  console.log(user);

  try {
    const count = await TutorOfferModel.countDocuments({});
    const result = await TutorOfferModel.find({ tutor: user._id }).populate(
      "subject"
    );
    console.log(user);
    return {
      code: statusCode.OK,
      count,
      result,
      message: "Fetch successfully.",
      success: true,
    };
  } catch (err) {
    console.log(err);

    return {
      code: statusCode.INTERNAL_ERROR,
      count: 0,
      result: [],
      message: "Something went wrong.",
      success: false,
    };
  }
};
