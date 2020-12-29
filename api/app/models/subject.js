import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
    },
  ],
});

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
  },
});

const CategoryModel = mongoose.model("categories", CategorySchema);
const SubcategoryModel = mongoose.model("subcategories", SubcategorySchema);

export { CategoryModel, SubcategoryModel };
