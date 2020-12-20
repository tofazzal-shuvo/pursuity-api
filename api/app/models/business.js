import mongoose from "mongoose";
import { emailType } from "../constant";

const businessSchema = new mongoose.Schema(
  {
    verificationImg: String,
    verificationType: String,
    businessUrl: String,
    businessName: {
      type: String,
      required: true,
      default: "Unnamed",
    },
    apiKey: String,
    marchentStatus: {
      type: String,
      default: "INACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    bvn: String,
    bvnVerified: {
      type: Boolean,
      default: false,
    },
    banks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
    availableBalance: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

//activating marchent status
// businessSchema.pre("save", async function (next) {
//   let flag =
//     !!this.verificationImg &&
//     !!this.verificationType &&
//     !!this.businessUrl &&
//     !!this.businessName &&
//     !!this.banks.length > 0;
//   this.marchentStatus = flag ? "ACTIVE" : "INACTIVE";
//   next();
// });

const BusinessModel = mongoose.model("Business", businessSchema);

export default BusinessModel;
