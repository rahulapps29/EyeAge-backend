const EyeEntry = require("../models/EyeEntry");
const User = require("../models/User");

exports.createEntry = async (req, res) => {
  try {
    const entry = new EyeEntry({ ...req.body, user: req.user._id });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.shareEntry = async (req, res) => {
  try {
    const { emails } = req.body;
    const entry = await EyeEntry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    const users = await User.find({ email: { $in: emails } });
    const userIds = users.map((u) => u._id);

    entry.sharedWith.push(
      ...userIds.filter((id) => !entry.sharedWith.includes(id))
    );
    await entry.save();

    res
      .status(200)
      .json({
        message: "Entry shared successfully",
        sharedWith: entry.sharedWith,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyEntries = async (req, res) => {
  try {
    const entries = await EyeEntry.find({ user: req.user._id });
    res.status(200).json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSharedEntries = async (req, res) => {
  try {
    const entries = await EyeEntry.find({ sharedWith: req.user._id });
    res.status(200).json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
