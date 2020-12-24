import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const StudentModel = mongoose.model("Students", studentSchema);

export default StudentModel;
