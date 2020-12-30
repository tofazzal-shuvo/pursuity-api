import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      default: "",
    },
    graduateInstituteName: {
      type: String,
      default: "",
    },
    graduateSubject: {
      type: String,
      default: "",
    },
    postInstituteName: {
      type: String,
      default: "",
    },
    postSubject: {
      type: String,
      default: "",
    },
    header: {
      type: String,
      default: "",
    },
    hourlyRate: { type: Number, default: 0 },
    rateAverage: { type: Number, default: 0 },
    rateCount: { type: Number, default: 0 },
    sucessTutoring: { type: Number, default: 0 },
    tutorLevel: {
      type: String,
      default: "Any",
      enum: tutorLevelEnum,
    },
    subjectsForTutor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategories",
      },
    ],
    isFlaxible: { type: Boolean, default: true },
    availability: [
      {
        day: {
          type: String,
          enum: availableDayEnum,
        },
        time: {
          type: [String],
          enum: availableTime,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },

  { timestamps: true }
);

//activating marchent status
// tutorSchema.pre("save", async function (next) {
//   let flag =
//     !!this.verificationImg &&
//     !!this.verificationType &&
//     !!this.businessUrl &&
//     !!this.businessName &&
//     !!this.banks.length > 0;
//   this.marchentStatus = flag ? "ACTIVE" : "INACTIVE";
//   next();
// });

const TutorModel = mongoose.model("tutors", tutorSchema);

export default TutorModel;

const tutorLevelEnum = [
  "Any",
  "Elementary",
  "Middle_School",
  "High_School",
  "College",
  "Adult",
];

const availableDayEnum = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const availableTime = ["Morning", "Afternoon", "Evening"];
