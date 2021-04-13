const mongoose = require("mongoose");

const ScholarProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "scholar",
  },

  location: {
    type: String,
  },

  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  school: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
});

module.exports = ScholarProfile = mongoose.model(
  "scholarprofile",
  ScholarProfileSchema
);
