import bcrypt from "bcryptjs";
import { SuperUserModel, UserModel, AppConfigModel } from "../../models";
import { statusCode } from "../../constant";
import { jwtDecode } from "../../utility";
// import { sendMail } from "../../utility/sendGrid";
import {
  forgetPassMailOptions,
  emailVerifMailOptions,
  addUserOptions,
} from "../../utility/mail";

// export const AdminLogin = async (_, { email, password }) => {
//   try {
//     // data validation
//     SuperUserModel.validator({ email, password });
//     // check if user exist
//     const foundUser = await SuperUserModel.findByCredentials(email, password);
//     // if(!foundUser.isEmailVarified)throw new Error("Email isn't verified.")
//     const token = foundUser.generateAuthToken();
//     await foundUser.save();

//     const settings = await AppConfigModel.findOne({});
    
//     return {
//       code: statusCode.OK,
//       success: true,
//       message: "Login successfully.",
//       user: foundUser,
//       token,
//       settings,
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const AdminRegister = async (_, { userInput }) => {
//   try {
//     // data validation
//     SuperUserModel.validator(userInput);
//     // check if user exist
//     const foundUser = await SuperUserModel.findOne({ email: userInput.email });
//     if (foundUser) throw new Error("User exists with this email.");
//     //passing to user model
//     const userData = new SuperUserModel(userInput);
//     await userData.save();
//     return {
//       code: statusCode.CREATED,
//       success: true,
//       message: "Registered successfully.",
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const AdminForgetPassword = async (_, { email }) => {
//   try {
//     SuperUserModel.validator({ email });
//     const foundUser = await SuperUserModel.findOne({ email });
//     if (!foundUser) throw new Error("User not found!");
//     const token = foundUser.generateAuthToken();
//     const mailOptions = forgetPassMailOptions(email, token);
//     // sendMail(mailOptions);
//     return {
//       code: statusCode.OK,
//       success: true,
//       message: "Please check email for further instruction.",
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const AdminResendVerifyEmail = async (_, { email }) => {
//   try {
//     SuperUserModel.validator({ email });
//     const foundUser = await SuperUserModel.findOne({ email });
//     if (!foundUser) throw new Error("User not found!");
//     const token = foundUser.generateAuthToken();
//     const mailOptions = emailVerifMailOptions(email, token);
//     // sendMail(mailOptions);
//     return {
//       code: statusCode.OK,
//       success: true,
//       message: "Verification email send.",
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const AdminResetPassowrd = async (
//   _,
//   { securityCode, newPassword },
//   req
// ) => {
//   try {
//     // validating security code
//     const user = jwtDecode(securityCode);
//     if (!user || req.id !== user.ip) throw new Error("Invalid security code.");
//     // validating data
//     SuperUserModel.validator({ password: newPassword });
//     // checking if user exist
//     const foundUser = await SuperUserModel.findById(user._id);
//     if (!foundUser) throw new Error("User not found!");
//     foundUser.password = newPassword;
//     await foundUser.save();
//     return {
//       code: statusCode.UPDATED,
//       success: true,
//       message: "Passowrd reset successfully.",
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };
// export const AdminVerifyEmail = async (_, { securityCode }, req) => {
//   try {
//     // validating security code
//     const user = jwtDecode(securityCode);
//     if (!user || req.id !== user.ip) throw new Error("Invalid security code.");
//     // checking if user exist
//     const foundUser = await SuperUserModel.findById(user._id);
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
//       code: statusCode.BAD_REQUEST,
//       success: false,
//       message: err.message,
//     };
//   }
// };

// export const AdminPassowrdUpdate = async (
//   _,
//   { oldPassword, newPassword },
//   { user }
// ) => {
//   try {
//     console.log(oldPassword, user);
//     // comparing old password
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) throw new Error("Old passowrd mismatch.");
//     // new password validation
//     SuperUserModel.validator({ password: newPassword });
//     user.password = newPassword;
//     await user.save();
//     return {
//       code: statusCode.UPDATED,
//       message: "Password updated successfully",
//       success: true,
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       message: err.message,
//       success: false,
//     };
//   }
// };

// export const AdminProfileUpdate = async (_, { profileData }, { user }) => {
//   try {
//     const { firstname, lastname, avater } = profileData;
//     if (firstname) user.firstname = firstname;
//     if (lastname) user.lastname = lastname;
//     if (avater) user.avater = avater;
//     await user.save();
//     return {
//       code: statusCode.UPDATED,
//       message: "Profile updated.",
//       success: true,
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       message: err.message,
//       success: false,
//     };
//   }
// };

// export const AddUserByAdmin = async (_, { email }) => {
//   try {
//     SuperUserModel.validator({ email });
//     const foundUser = await UserModel.findOne({ email });
//     if (foundUser) throw new Error("User exists with this email.");
//     const user = UserModel({ email, role: "business" });
//     await user.save();
//     const mailOptions = addUserOptions(email, user._id);
//     // sendMail(mailOptions);
//     return {
//       code: statusCode.ADDED,
//       message: "Email has been sent to user.",
//       success: true,
//       id: user._id,
//     };
//   } catch (err) {
//     return {
//       code: statusCode.BAD_REQUEST,
//       message: err.message,
//       success: false,
//     };
//   }
// };
