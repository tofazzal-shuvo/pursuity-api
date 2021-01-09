import { statusCode } from "../../constant";
import { TutorOfferModel } from "../../models";

export const AddOffers = async (_, { offer }, user) => {
  try {
    // const importantInput = ["title", "description", "hourlyRate", "subject"];
    // importantInput.map((item) => {
    //   if (!offer[item])
    //     throw new CustomError(
    //       `${item} not provided.`,
    //       statusCode.VALIDATION_ERROR
    //     );
    // });
    const tutorOffer = await TutorOfferModel(offer);
    return {
      code: statusCode.CREATED,
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
