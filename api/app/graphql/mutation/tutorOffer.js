import mongoose from "mongoose";
import { statusCode } from "../../constant";
import { TutorModel, TutorOfferModel } from "../../models";

export const AddOffers = async (_, { offer }, { user }) => {
  try {
    const tutor = await TutorModel.findById(user._id);

    const tutorOffer = await TutorOfferModel.create({
      ...offer,
      tutor: user._id,
    });
    tutor.offers.push(tutorOffer._id);
    // console.log(tutor);
    await tutor.save();
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Lesson has been added.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const DeleteOffer = async (_, { id }, { user }) => {
  try {
    const tutorOffer = await TutorOfferModel.findByIdAndDelete(id);
    if (!tutorOffer)
      throw new CustomError("Lesson not found!", statusCode.NOT_FOUND);
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Lesson has been deleted.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const EditTutorOffer = async (_, { id, payload }) => {
  try {
    const subcategory = await TutorOfferModel.findByIdAndUpdate(id, payload);
    console.log(subcategory);
    if (!subcategory)
      throw new CustomError("Lesson not found!", statusCode.NOT_FOUND);
    return {
      code: statusCode.UPDATED,
      success: true,
      message: "Lesson has been updated.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};
