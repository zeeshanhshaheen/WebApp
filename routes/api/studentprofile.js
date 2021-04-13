const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const StudentProfile = require("../../models/StudentProfile");
const Student = require("../../models/Student");

// @route   GET api/studentprofile/student
// @desc    Get current users profile
// @access  Private
router.get("/student", auth, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "No profile found..." });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/studentprofile
// @desc    Create or update a profile
// @access  Private
router.post(
  "/",
  [auth, [check("skills", "skills is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {
      location,
      bio,

      skills,
    } = req.body;

    // build profile object

    const profileFields = {};

    profileFields.user = req.user.id;

    if (location) profileFields.location = location;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // build social object

    try {
      let profile = await StudentProfile.findOne({ user: req.user.id });
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new StudentProfile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    res.send("Hello");
  }
);

// @route   DELETE api/studentprofile
// @desc    Delete profile, user & posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });

    // remove profile
    await StudentProfile.findOneAndRemove({ user: req.user.id });

    // remove user

    await Student.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "Deleted Successfully..." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
