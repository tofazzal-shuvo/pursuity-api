import { UserModel } from "../../models";
import { statusCode } from "../../constant";

export const FetchCurrentUser = async (_, {}, { user }) => {
  try {
    const result = await UserModel.findById(user?._id).populate({
      path: "student tutor",
      populate: {
        path: "subjectsForTutor",
        model: "Subcategory",
        populate: { path: "category", model: "Category" },
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
//         .skip(limit ? offset * limit : 0)
//         .limit(limit);
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
