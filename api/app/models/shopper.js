import mongoose from "mongoose";

const shopperSchema = new mongoose.Schema(
  {
    spendLimit: {
      type: Number,
      default: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    billing: {
      address: {
        type: String,
        default: "333 Fremont Street",
      },
      city: { type: String, default: "San Francisco" },
      state: { type: String, default: "California" },
      postalCode: { type: String, default: "94105" },
      country: { type: String, default: "US" },
    },
  },
  { timestamps: true }
);

const ShopperModel = mongoose.model("Shopper", shopperSchema);

export default ShopperModel;
