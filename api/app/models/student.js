import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const StudentModel = mongoose.model("students", studentSchema);

export default StudentModel;
