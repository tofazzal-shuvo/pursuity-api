import { SubcategoryModel, TutorModel, UserModel } from "../../models";
import { statusCode, userRole } from "../../constant";

export const FetchUserById = async (_, { id }) => {
  try {
    const result = await UserModel.findById(id).populate({
      path: "student tutor",
      populate: {
        path: "subjectsForTutor",
        model: "subcategories",
      },
    });
    return {
      code: statusCode.OK,
      user: result,
      message: "Fetch successfully.",
      success: true,
    };
  } catch (err) {
    return {
      code: statusCode.INTERNAL_ERROR,
      message: err.message,
      success: false,
    };
  }
};

export const FetchTutor = async (
  _,
  { limit = 100, offset = 0, filter = {} }
) => {
  try {
    let options = {};
    // find user
    options.age = { $gte: filter.minAge || 0, $lte: filter.maxAge || 100000 };
    if (filter.gender) options.gender = filter.gender;
    options.role = userRole.tutor;
    const user = await UserModel.find(options);
    // find subjects
    const subjects = await SubcategoryModel.find({
      name: { $regex: filter.subject || "", $options: "i" },
    });
    // find tutor
    options = {};
    if (filter.tutorLavel) options.tutorLavel = filter.tutorLavel;
    if (filter?.day?.length > 0)
      options.availability = { $elemMatch: { day: { $in: filter.day } } };
    options.hourlyRate = {
      $gte: filter.minHourlyRate || 0,
      $lte: filter.maxHourlyRate || 1000000,
    };
    options.user = { $in: user };
    options.subjectsForTutor = { $in: subjects };
    const count = await TutorModel.countDocuments(options);
    const result = await TutorModel.find(options)
      .populate("user subjectsForTutor")
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

// export const FetchUsers = async (_, { limit = 100, offset = 0, role = "" }) => {
//   let count = 0;
// let result;
//   try {
//     const options = {};
//     if (role) options.role = role;

//     if (role === "shopper") {
//       count = await UserModel.countDocuments(options);
//       const aggregate = [
//         { $match: options },
//         { $skip: offset ? offset * limit : 0 },
//         { $limit: limit },
//         {
//           $lookup: {
//             from: "shoppers",
//             localField: "shopper",
//             foreignField: "_id",
//             as: "shopper",
//           },
//         },
//         { $unwind: "$shopper" },

//         {
//           $lookup: {
//             from: "transactions",
//             localField: "_id",
//             foreignField: "shopper",
//             as: "transactions",
//           },
//         },

//         {
//           $addFields: {
//             transactions: {
//               $cond: {
//                 if: { $isArray: "$transactions" },
//                 then: { $size: "$transactions" },
//                 else: 0,
//               },
//             },
//           },
//         },
//       ];

//       result = await UserModel.aggregate(aggregate);
//     } else {
//       count = await UserModel.countDocuments(options);
//       result = await UserModel.find(options)
//         .populate([
//           {
//             path: "shopper",
//           },
//           {
//             path: "business",
//             populate: {
//               path: "banks",
//               match: {
//                 preferred: true,
//               },
//             },
//           },
//         ])
// .skip(limit ? offset * limit : 0)
// .limit(limit);
//     }

//     return {
//       code: statusCode.OK,
//       count,
//       result,
//       message: "Fetch successfully.",
//       success: true,
//       hasNext: hasNext({ limit, offset, count }),
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       code: statusCode.INTERNAL_ERROR,
//       count: 0,
//       result: [],
//       message: "Something went wrong.",
//       success: false,
//     };
//   }
// };

// export const FetchCustomer = async (
//   _,
//   { limit = 10, offset = 0 },
//   { user }
// ) => {
//   try {
//     const order = await OrderModel.distinct("shopper", { business: user._id });
//     const count = await UserModel.countDocuments({ shopper: order });
//     const result = await UserModel.find({ shopper: order })
//       .skip(limit ? offset * limit : 0)
//       .limit(limit);

//     // aggregate approach
//     // const data = await UserModel.aggregate([
//     // { $match: { business: user._id } },
//     // { $group: { _id: "$shopper" } },
//     // {$project: {"_id": "$_id", "user": "$shopperData"}},
//     //   {
//     //     $lookup: {
//     //       from: "Order",
//     //       localField: "_id",
//     //       foreignField: "shopper",
//     //       as: "shopperData",
//     //     },
//     //   },
//     // ]);
//     // console.log(data);

//     return {
//       code: statusCode.OK,
//       count,
//       result,
//       message: "Fetch successfully.",
//       success: true,
//       hasNext: hasNext({ limit, offset, count }),
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       code: statusCode.INTERNAL_ERROR,
//       count: 0,
//       result: [],
//       message: "Something went wrong.",
//       success: false,
//     };
//   }
// };

// export const FindShopperByEmail = async (
//   _,
//   { email, limit = 100, offset = 0 }
// ) => {
//   try {
//     const options = {
//       email: { $regex: email, $options: "i" },
//       role: "shopper",
//     };
//     const count = await UserModel.countDocuments(options);
//     const users = await UserModel.find(options)
//       .skip(limit ? offset * limit : 0)
//       .limit(limit);
//     return {
//       code: statusCode.OK,
//       success: true,
//       count,
//       message: "Fetch successfully.",
//       users,
//     };
//   } catch (err) {
//     return {
//       code: statusCode.INTERNAL_ERROR,
//       success: false,
//       count: 0,
//       message: "Something went wrong.",
//     };
//   }
// };
