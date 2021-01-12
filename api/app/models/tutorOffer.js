import mongoose from "mongoose";

const TutorOfferStatus = ["Active", "Paused"];

const TutorOfferSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  hourlyRate: {
    type: Number,
    default: 10,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategories",
  },
  status: {
    type: String,
    default: TutorOfferStatus[0],
    enum: TutorOfferStatus,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutors",
  },
});

const TutorOfferModel = mongoose.model("tutorOffers", TutorOfferSchema);

export default TutorOfferModel;
