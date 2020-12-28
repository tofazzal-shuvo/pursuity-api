import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
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
    ref: "Category",
  },
});

const CategoryModel = mongoose.model("Category", CategorySchema);
const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);

export { CategoryModel, SubcategoryModel };
