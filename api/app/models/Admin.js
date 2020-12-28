import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminRole from "../constant/adminRole";

const SuperUserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    avater: { type: String, default: "" },
    role: {
      type: String,
      default: adminRole.admin,
      enum: [adminRole.superAdmin, adminRole.admin],
    },
    password: String,
    email: { type: String, unique: true },
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//generating auth token
SuperUserSchema.methods.generateAuthToken = function ({ newEmail } = {}) {
  const token = jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      role: this.role,
      timestamps: Date.now(),
      newEmail,
    },
    "screateKey"
  );
  return token;
};

SuperUserSchema.statics.findByCredentials = async function (email, password) {
  const user = await AdminModel.findOne({ email });
  if (!user) throw new Error("User not found.");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Passowrd mismatch.");
  return user;
};

//user data validation
SuperUserSchema.statics.validator = function (inputData) {
  if (inputData.password && inputData.password.length < 6) {
    throw new Error("Minimum password length is 6 characters.");
  } else if (inputData.email && !validator.isEmail(inputData.email)) {
    throw new Error("Email is badly formated.");
  }
};

//hashing password
SuperUserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(8);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

const AdminModel = mongoose.model("SuperUsers", SuperUserSchema);
export default AdminModel;
