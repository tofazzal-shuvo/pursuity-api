import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "../utility";
import statusCode from "../constant/statusCode";

const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    address: String,
    mobile: {
      type: String,
      default: "",
    },
    avater: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
      enum: ["shopper", "business"],
    },
    password: {
      type: String,
      required: true,
    },
    email: { type: String, unique: true },
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
    instagram: {
      type: String,
      default: "",
      validate: {
        validator: (value) => {
          if (value.length > 30) {
            throw new CustomError(
              "{{PATH}} cannot be more than 30 character",
              statusCode.VALIDATION_ERROR
            );
          }

          if (value.includes("http")) {
            throw new CustomError(
              "Provide only username!",
              statusCode.VALIDATION_ERROR
            );
          }
          return true;
        },
        message:
          "{{PATH}} do not specify this field, it will be set automatically",
      },
    },
    isInstagramVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    uniqueId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["restricted", "active", "inactive"],
      default: "active",
    },
    shopper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shopper",
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
  },
  { timestamps: true }
);

//generating auth token
userSchema.methods.generateAuthToken = function (ip) {
  const token = jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      role: this.role,
      timestamps: Date.now(),
      ip,
    },
    "screateKey",
    { expiresIn: "30m" }
  );
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await UserModel.findOne({ email }).populate({
    path: "business shopper",
    populate: {
      path: "cards",
      model: "Card",
    },
  });
  if (!user) throw new CustomError("User not found.", statusCode.NOT_FOUND);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new CustomError(
      "Incorrect email or password.",
      statusCode.VALIDATION_ERROR
    );
  return user;
};

//user data validation
userSchema.statics.validator = function (inputData) {
  if (inputData.password) {
    if (inputData.password.length < 8) {
      throw new CustomError(
        "Minimum password length is 8 characters.",
        statusCode.VALIDATION_ERROR
      );
    }
    if (!passwordReg.test(inputData.password)) {
      throw new CustomError(
        "Password is too week!",
        statusCode.VALIDATION_ERROR
      );
    }
  } else if (inputData.email && !validator.isEmail(inputData.email)) {
    throw new CustomError(
      "Email is badly formated.",
      statusCode.VALIDATION_ERROR
    );
  }
};

//hashing password
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(8);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
