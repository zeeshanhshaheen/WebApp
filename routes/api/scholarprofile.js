const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const ScholarProfile = require("../../models/ScholarProfile");
const Scholar = require("../../models/Scholar");

// @route   GET api/scholarprofile/all
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await ScholarProfile.findOne({
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

// @route   POST api/scolarprofile
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
    const { location, bio, skills, school, experience } = req.body;

    // build profile object

    const profileFields = {};

    profileFields.user = req.user.id;

    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    if (school) profileFields.school = school;
    if (experience) profileFields.experience = experience;

    try {
      let profile = await ScholarProfile.findOne({ user: req.user.id });
      if (profile) {
        // update
        profile = await ScholarProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
      // create
      profile = new ScholarProfile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    res.send("Hello");
  }
);

// @route   GET api/scholarprofile
// @desc    Get all profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await ScholarProfile.find().populate("user", [
      "name",
      "avatar",
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/scholarprofile
// @desc    Delete profile, user & posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts

    // remove profile
    await ScholarProfile.findOneAndRemove({ user: req.user.id });

    // remove user

    await Scholar.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "user deleted..." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
