import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      default: ""
    },
    instituteName: {
      type: String,
      default: ""
    },
    subject: {
      type: String,
      default: ""
    },
    isGraduate: {
      type: Boolean,
      default: false
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users"
    }
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

const TutorModel = mongoose.model("Tutors", tutorSchema);

export default TutorModel;
