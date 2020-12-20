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
} from "../../models";
import {
  emailSender,
  jwtDecode,
  CustomError,
  ForgetEmailSender,
} from "../../utility";
import { statusCode, emailType } from "../../constant";

export const Login = async (
  _,
  { email, password, isBusiness, vcard },
  ctx,
  req
) => {
  try {
    UserModel.validator({ email });
    const foundUser = await UserModel.findByCredentials(email, password);
    if (isBusiness && foundUser.role !== "business") {
      throw new CustomError("User not found.", statusCode.ACCESS_DENIED);
    } else if (!isBusiness && foundUser.role !== "shopper") {
      throw new CustomError("User not found.", statusCode.ACCESS_DENIED);
    }
    if (foundUser.status === "restricted")
      throw new CustomError(
        "You are restricted. Please contact support..",
        statusCode.BLOCKED
      );
    if (!foundUser.isEmailVarified)
      throw new CustomError("Please verify your email", statusCode.BAD_REQUEST);
    const token = foundUser.generateAuthToken();

    let featured = [];
    if (!isBusiness) {
      featured = await ProductModel.find().sort({ updatedAt: -1 }).limit(5);
    }

    let serviceFee = await ServiceFeeModel.find();

    let vcards = [];
    if (vcard) {
      vcards = await VCardModel.find({ user: foundUser._id });
    }

    return {
      code: statusCode.OK,
      success: true,
      message: "You're now logged in.",
      user: foundUser,
      token,
      featured,
      serviceFee,
      vcards,
    };
  } catch (err) {
    return {
      code: err.code || statusCode.INTERNAL_ERROR,
      success: false,
      message: err.message,
    };
  }
};

// export const Register = async (_, { userInput }) => {
//   try {
//     const _id = new mongoose.Types.ObjectId();
//     UserModel.validator(userInput);
//     const foundUser = await UserModel.findOne({ email: userInput.email });
//     if (foundUser)
//       throw new CustomError(
//         "User exists with this email.",
//         statusCode.BAD_REQUEST
//       );
//     // saving data to shopper or business model
//     userInput = {
//       ...userInput,
//       _id,
//       uniqueId: customId({
//         name: "123456",
//         email: "78910",
//       }),
//     };
//     if (userInput.role === "shopper") {
//       userInput.shopper = _id;
//       const shopper = new ShopperModel({ _id });
//       await shopper.save();
//     } else {
//       userInput.business = _id;
//       const business = new BusinessModel({ apiKey: uuidv4(), _id });
//       business.save();
//       // console.log(business);
//     }
//     // save register user
//     const userData = new UserModel(userInput);
//     await userData.save();
//     const token = userData.generateAuthToken();
//     // verification email
//     await emailSender({
//       type: emailType.SIGNUP,
//       emailName: "Signup",
//       email: userInput.email,
//       name: `${userInput.firstname} ${userInput.lastname}`,
//       link: `verify-email?security_code=${token}`,
//     });
//     return {
//       code: statusCode.CREATED,
//       success: true,
//       message: "Registered successfully.",
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.INTERNAL_ERROR,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const ForgetPassword = async (_, { email }) => {
//   try {
//     UserModel.validator({ email });
//     const foundUser = await UserModel.findOne({ email });
//     if (!foundUser)
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     const token = foundUser.generateAuthToken();
//     // resending verification email
//     await emailSender({
//       type: emailType.FORGOT_PASSWORD,
//       email: foundUser.email,
//       emailName: "Forget password",
//       link: `reset-password?security_code=${token}`,
//       name: `${foundUser.firstname} ${foundUser.lastname}`,
//     });
//     return {
//       code: statusCode.OK,
//       success: true,
//       message: "We've sent a link to reset your password.",
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.INTERNAL_ERROR,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const ResendVerifyEmail = async (_, { email }) => {
//   try {
//     UserModel.validator({ email });
//     const foundUser = await UserModel.findOne({ email });
//     if (!foundUser)
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     const token = foundUser.generateAuthToken();
//     await emailSender({
//       type: emailType.EMAIL_VERIFICATION,
//       emailName: "Verification",
//       email: foundUser.email,
//       link: `verify-email?security_code=${token}`,
//       name: `${foundUser.firstname} ${foundUser.lastname}`,
//     });
//     return {
//       code: statusCode.OK,
//       success: true,
//       message: "Verification email has been sent.",
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const ResetPassowrd = async (_, { securityCode, newPassword }, req) => {
//   try {
//     // validating security code
//     const user = jwtDecode(securityCode);
//     if (!user || req.id !== user.ip)
//       throw new CustomError(
//         "Invalid security code.",
//         statusCode.VALIDATION_ERROR
//       );
//     // validating data
//     UserModel.validator({ password: newPassword });
//     // checking if user exist
//     const foundUser = await UserModel.findById(user._id);
//     if (!foundUser)
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     foundUser.password = newPassword;
//     await foundUser.save();
//     return {
//       code: statusCode.UPDATED,
//       success: true,
//       message: "Passowrd reset successfully.",
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };
// export const VerifyEmail = async (_, { securityCode }, req) => {
//   try {
//     // validating security code
//     const user = jwtDecode(securityCode);
//     if (!user || req.id !== user.ip)
//       throw new CustomError(
//         "Invalid security code.",
//         statusCode.VALIDATION_ERROR
//       );
//     // checking if user exist
//     const foundUser = await UserModel.findById(user._id);
//     if (!foundUser) throw new Error("User not found!");
//     foundUser.isEmailVarified = true;
//     await foundUser.save();
//     return {
//       code: statusCode.UPDATED,
//       success: true,
//       message: "Your email is verified.",
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const PassowrdUpdate = async (
//   _,
//   { oldPassword, newPassword },
//   { user }
// ) => {
//   try {
//     // comparing old password
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch)
//       throw new CustomError(
//         "Old passowrd mismatch.",
//         statusCode.VALIDATION_ERROR
//       );
//     // new password validation
//     UserModel.validator({ password: newPassword });
//     user.password = newPassword;
//     await user.save();
//     return {
//       code: statusCode.UPDATED,
//       message: "Password updated.",
//       success: true,
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.BAD_REQUEST,
//       message: err.message,
//       success: false,
//     };
//   }
// };
// export const ProfileUpdate = async (_, { profileData }, { user }) => {
//   try {
//     // const keys = Object.keys(profileData);
//     // keys.map((item) => (user[item] = profileData[item]));
//     Object.assign(user, profileData)
//     await user.save();
//     return {
//       code: statusCode.UPDATED,
//       message: "Profile updated.",
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

// export const CompleteProfile = async (_, { profileData }) => {
//   try {
//     const { firstname, lastname, password, id } = profileData;
//     UserModel.validator({ password });
//     if (!mongoose.isValidObjectId(id))
//       throw new CustomError("ID is incorrect!", statusCode.VALIDATION_ERROR);
//     const user = await UserModel.findById(id);
//     if (!user || user.isEmailVarified || user.role === "shopper")
//       throw new CustomError("The link is invalid!", statusCode.BAD_REQUEST);
//     if (firstname) user.firstname = firstname;
//     if (lastname) user.lastname = lastname;
//     if (password) user.password = password;
//     user.isEmailVarified = true;
//     await user.save();
//     return {
//       code: statusCode.ADDED,
//       message: "User added.",
//       success: true,
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.BAD_REQUEST,
//       message: err.message,
//       success: false,
//     };
//   }
// };

// export const IsProfileComplete = async (_, { id }) => {
//   try {
//     if (!mongoose.isValidObjectId(id))
//       throw new CustomError("ID is incorrect!", statusCode.VALIDATION_ERROR);
//     const user = await UserModel.findById(id);
//     if (!user) throw new CustomError("User not found.", statusCode.NOT_FOUND);
//     if (user.isEmailVarified)
//       throw new CustomError("Link already used!", statusCode.BAD_REQUEST);
//     return {
//       code: statusCode.OK,
//       message: "Profile completed.",
//       isComplete: true,
//       success: true,
//     };
//   } catch (err) {
//     return {
//       code: err.code || statusCode.INTERNAL_ERROR,
//       message: err.message,
//       isComplete: false,
//       success: false,
//     };
//   }
// };

// export const UpdateBusinessStatus = async (_, { userId, status }, { user }) => {
//   try {
//     const record = await BusinessModel.findById(userId);
//     if (!record) {
//       throw new CustomError("Business record not found!", statusCode.NOT_FOUND);
//     }

//     await BusinessModel.updateOne({ _id: userId }, { marchentStatus: status });

//     await emailSender({
//       type: emailType.ACTIVE_BUSINESS_ACCOUNT,
//       emailName: "Activate business account",
//       email: user.email,
//       name: `${user.firstname} ${user.lastname}`,
//     });
//     return {
//       code: statusCode.UPDATED,
//       message: "Merchant status updated.",
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

// export const UpdateBusinessInfo = async (_, { businessInput }, { user }) => {
//   try {
//     const businessData = await BusinessModel.findById(user._id);
//     if (!businessData) {
//       throw new CustomError("Business record not found!", statusCode.NOT_FOUND);
//     }
//     const keys = Object.keys(businessInput);
//     keys.map((item) => (businessData[item] = businessInput[item]));
//     await businessData.save();
//     return {
//       code: statusCode.UPDATED,
//       message: "Business info updated.",
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

// export const RegenerateApikey = async (_, input, { user }) => {
//   try {
//     const businessData = await BusinessModel.findById(user._id);
//     if (!businessData) {
//       throw new CustomError("Business record not found!", statusCode.NOT_FOUND);
//     }
//     businessData.apiKey = uuidv4();
//     await businessData.save();
//     return {
//       code: statusCode.UPDATED,
//       message: "Api key has been regenerated.",
//       newApikey: businessData.apiKey,
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

// export const SetSpendLimit = async (_, { spendLimit, id }) => {
//   try {
//     if (!mongoose.isValidObjectId(id))
//       throw new CustomError("ID isn't correct.", statusCode.BAD_REQUEST);
//     const shopper = await ShopperModel.findById(id);
//     if (!shopper) {
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     }
//     shopper.spendLimit = spendLimit;
//     await shopper.save();
//     return {
//       code: statusCode.UPDATED,
//       message: `Spend limit has been updated.`,
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

// export const SetInstragramVerified = async (_, { id }) => {
//   try {
//     if (!mongoose.isValidObjectId(id))
//       throw new CustomError("ID isn't correct.", statusCode.BAD_REQUEST);
//     const user = await UserModel.findById(id);
//     if (!user) {
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     }
//     user.isInstagramVerified = true;
//     await user.save();
//     return {
//       code: statusCode.UPDATED,
//       message: `Instagram status has been updated.`,
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

// export const UpdateBilling = async (_, args, { user }) => {
//   try {
//     const shopper = await ShopperModel.findOne({ _id: user._id });
//     if (!shopper) {
//       throw new CustomError("User not found!", statusCode.NOT_FOUND);
//     }
//     shopper.billing = args;
//     await shopper.save();

//     console.log(shopper);

//     return {
//       code: statusCode.UPDATED,
//       message: `Billing has been updated`,
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

// const file = {};
// file.filename = "main.js";
// file.mimetype = "text/javascript";
// file.buffers = `
//     class SlashIT {
//       constructor(config) {
//         this.init(config);
//       }

//       init(config) {
//         this.btn = document.getElementById(config.btnId);
//         this.apiKey = config.apiKey;
//         if (config.btnText) {
//           this.btn.innerHTML =
//             '<img style="margin-right: 5px" width="25px" src="https://ezcorps.s3.ap-south-1.amazonaws.com/750-1599581372750-logo.png"/> ' +
//             config.btnText;
//         }
//         this.btn.style =
//           "display: flex; align-items: center; justify-content: center;font-size: 20px;border: 1px solid #da00ff;border-radius: 3px;padding: 5px 15px;background: #c808e8de; color: #fff;";
//       }

//       checkout(data) {
//         data.apiKey = this.apiKey;
//         data.src = window.location.href;
//         window.location.assign(
//           "https://ez-pm.herokuapp.com/pay-auth/" + btoa(JSON.stringify(data))
//         );
//       }

//       on(listener, callback) {
//         if (listener === "checkout") {
//           this.btn.onclick = () => {
//             return callback();
//           };
//         } else {
//           return null;
//         }
//       }
//     }
//     `;
// await uploadToAws(file);
