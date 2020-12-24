import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import customId from "custom-id";
import { v4 as uuidv4 } from "uuid";
import {
  UserModel,
  ProductModel,
  ShopperModel,
  BusinessModel,
  ServiceFeeModel,
  VCardModel,
  StudentModel,
  TutorModel,
} from "../../models";
import {
  emailSender,
  jwtDecode,
  CustomError,
  forgetPasswordMailSender,
  registerMailSender,
  resendVeficationLinkMailSender,
} from "../../utility";
import { statusCode, emailType, roles } from "../../constant";

export const Login = async (_, { email, password }) => {
  try {
    UserModel.validator({ email });
    const foundUser = await UserModel.findByCredentials(email, password);
    if (foundUser.status === "Blocked")
      throw new CustomError(
        "You are blocked. Please contact support..",
        statusCode.BLOCKED
      );
    if (!foundUser.isEmailVarified)
      throw new CustomError("Please verify your email", statusCode.BAD_REQUEST);
    const token = foundUser.generateAuthToken();
    foundUser.password = null;
    return {
      code: statusCode.OK,
      success: true,
      message: "You're now logged in.",
      user: foundUser,
      token,
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const Register = async (_, { userInput }) => {
  try {
    UserModel.validator(userInput);
    const _id = new mongoose.Types.ObjectId();
    const foundUser = await UserModel.findOne({ email: userInput.email });
    if (foundUser)
      throw new CustomError(
        "User exists with this email.",
        statusCode.BAD_REQUEST
      );
    // saving data to student or tutor model
    if (userInput.role === roles.student) {
      userInput.student = _id;
      await StudentModel.create({ _id, user: _id });
    } else {
      userInput.tutor = _id;
      await TutorModel.create({ _id, user: _id });
    }
    const userData = await UserModel.create({ ...userInput, _id });
    const token = userData.generateAuthToken();
    await registerMailSender({ email: userInput.email, token });
    return {
      code: statusCode.CREATED,
      success: true,
      message: "Registered successfully. Please check your email.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const ForgetPassword = async (_, { email }) => {
  try {
    UserModel.validator({ email });
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser)
      throw new CustomError("User not found!", statusCode.NOT_FOUND);
    const token = foundUser.generateAuthToken();
    // sending link
    forgetPasswordMailSender({ email, token });
    return {
      code: statusCode.OK,
      success: true,
      message: "We've sent a link to reset your password.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

export const ResendVerifyEmail = async (_, { email }) => {
  try {
    UserModel.validator({ email });
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser)
      throw new CustomError("User not found!", statusCode.NOT_FOUND);
    const token = foundUser.generateAuthToken();
    resendVeficationLinkMailSender({ email, token });
    return {
      code: statusCode.OK,
      success: true,
      message: "Verification email has been sent.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.BAD_REQUEST,
      success: false,
      message: err.message,
    };
  }
};

export const ResetPassowrd = async (_, { securityCode, newPassword }) => {
  try {
    // validating security code
    const user = jwtDecode(securityCode);
    // if (!user || req.id !== user.ip)
    //   throw new CustomError(
    //     "Invalid security code.",
    //     statusCode.VALIDATION_ERROR
    //   );
    // validating data
    UserModel.validator({ password: newPassword });
    // checking if user exist
    const foundUser = await UserModel.findById(user?._id);
    if (!foundUser)
      throw new CustomError("User not found!", statusCode.NOT_FOUND);
    foundUser.password = newPassword;
    await foundUser.save();
    return {
      code: statusCode.UPDATED,
      success: true,
      message: "Passowrd reset successfully.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.BAD_REQUEST,
      success: false,
      message: err.message,
    };
  }
};
export const VerifyEmail = async (_, { securityCode }, req) => {
  try {
    // validating security code
    const user = jwtDecode(securityCode);
    // if (!user || req.id !== user.ip)
    //   throw new CustomError(
    //     "Invalid security code.",
    //     statusCode.VALIDATION_ERROR
    //   );
    // checking if user exist
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) throw new Error("User not found!");
    foundUser.isEmailVarified = true;
    await foundUser.save();
    return {
      code: statusCode.UPDATED,
      success: true,
      message: "Your email is verified.",
    };
  } catch (err) {
    return {
      code: err.code || statusCode.BAD_REQUEST,
      success: false,
      message: err.message,
    };
  }
};

export const PassowrdUpdate = async (
  _,
  { oldPassword, newPassword },
  { user }
) => {
  try {
    // comparing old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      throw new CustomError(
        "Old passowrd mismatch.",
        statusCode.VALIDATION_ERROR
      );
    // new password validation
    UserModel.validator({ password: newPassword });
    user.password = newPassword;
    await user.save();
    return {
      code: statusCode.UPDATED,
      message: "Password has been updated.",
      success: true,
    };
  } catch (err) {
    return {
      code: err.code || statusCode.BAD_REQUEST,
      message: err.message,
      success: false,
    };
  }
};
export const ProfileUpdate = async (_, { profileData }, { user }) => {
  try {
    // const keys = Object.keys(profileData);
    // keys.map((item) => (user[item] = profileData[item]));
    Object.keys(profileData).map((item) => {
      if (!profileData[item]) delete profileData[item];
    });
    Object.assign(user, profileData);
    await user.save();
    return {
      code: statusCode.UPDATED,
      message: "Profile updated.",
      success: true,
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      message: err.message,
      success: false,
    };
  }
};

// export const UpdateUserStatus = async (_, { status, id }) => {
//   try {
//     if (!mongoose.isValidObjectId(id))
//       throw new CustomError("ID isn't correct.", statusCode.BAD_REQUEST);
//     const user = await UserModel.findById(id);
//     if (!user) {
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     }
//     user.status = status;
//     await user.save();
//     return {
//       code: statusCode.UPDATED,
//       message: `User has been ${user.status}.`,
//       success: true,
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.INTERNAL_ERROR,
//       message: err.message,
//       success: false,
//     };
//   }
// };
