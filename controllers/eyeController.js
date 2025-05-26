const EyeEntry = require("../models/EyeEntry");
const User = require("../models/User");

// Create Eye Entry
exports.createEntry = async (req, res) => {
  try {
    const entry = new EyeEntry({ ...req.body, user: req.user._id });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Share Entry With Users by Email
exports.shareEntry = async (req, res) => {
  try {
    const { emails } = req.body;
    const entry = await EyeEntry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    const users = await User.find({ email: { $in: emails } });
    const userIds = users.map((u) => u._id);

    // Avoid duplicates
    entry.sharedWith.push(
      ...userIds.filter((id) => !entry.sharedWith.includes(id))
    );

    await entry.save();

    res.status(200).json({
      message: "Entry shared successfully",
      sharedWith: entry.sharedWith,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Entries Created by Logged-in User
exports.getMyEntries = async (req, res) => {
  try {
    const entries = await EyeEntry.find({ user: req.user._id }).populate(
      "sharedWith",
      "email firstName"
    );
    res.status(200).json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Entries Shared With Logged-in User
exports.getSharedEntries = async (req, res) => {
  try {
    const entries = await EyeEntry.find({ sharedWith: req.user._id }).populate(
      "user",
      "firstName lastName email"
    );
    res.status(200).json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
