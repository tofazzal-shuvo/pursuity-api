import { SubcategoryModel, TutorModel, UserModel } from "../../models";
import { statusCode, userRole } from "../../constant";

export const FetchUserById = async (_, { id }) => {
  try {
    const result = await UserModel.findById(id).populate({
      path: "student tutor",
      populate: {
        path: "subjectsForTutor offers",
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
    options.age = { $gte: filter?.minAge || 0, $lte: filter?.maxAge || 100000 };
    if (filter.gender) options.gender = filter.gender;
    options.role = userRole.tutor;
    const user = await UserModel.find(options);

    // find subjects
    const subjects = await SubcategoryModel.find({
      name: { $regex: filter.subject || "", $options: "i" },
    });

    // find tutor
    const $and = [
        {
          hourlyRate: {
            $gte: filter?.minHourlyRate || 0,
            $lte: filter?.maxHourlyRate || 10000,
          },
        },
        { user: { $in: user } },
      ],
      $or = [{ subjectsForTutor: { $in: subjects } }];

    if (filter.tutorLavel) $and.push({ tutorLavel: filter.tutorLavel });
    if (filter?.day?.length > 0)
      $and.push({ availability: { $elemMatch: { day: { $in: filter.day } } } });

    if (filter.subject) {
      $or.push(
        { bio: { $regex: filter.subject, $options: "i" } },
        { title: { $regex: filter.subject, $options: "i" } }
      );
    }

    $and.push({ $or });
    // console.log($and)
    // await TutorModel.updateMany({}, {hourlyRate: 1})
    const count = await TutorModel.countDocuments({ $and });
    const result = await TutorModel.find({ $and })
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
