import mongoose from "mongoose";

const TutorOfferSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  hourlyRate: {
    type: Number,
    default: 0,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategories",
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutors",
  },
});

const TutorOfferModel = mongoose.model("tutorOffers", TutorOfferSchema);

export default TutorOfferModel;
