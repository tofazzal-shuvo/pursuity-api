import { statusCode } from "../../constant";
import { TutorOfferModel } from "../../models";

export const AddOffers = async (_, { offer }, user) => {
  try {
    const tutorOffer = await TutorOfferModel({...offer, tutor: user});
    // user.offers.push(tutorOffer)
    // agmi
    // await user.save()
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Offer has been added.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const DeleteOffer = async (_, { id }, user) => {
  try {
    const tutorOffer = await TutorOfferModel.findByIdAndDelete(id);
    if (!tutorOffer)
      throw new CustomError("Offer not found!", statusCode.NOT_FOUND);
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Offer has been deleted.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};
