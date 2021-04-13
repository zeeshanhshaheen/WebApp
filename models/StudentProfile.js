const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
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
});

module.exports = StudentProfile = mongoose.model(
  "studentprofile",
  StudentProfileSchema
);
