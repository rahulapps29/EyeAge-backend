const express = require("express");
const router = express.Router();
const eyeController = require("../controllers/eyeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, eyeController.createEntry);
router.post("/share/:entryId", protect, eyeController.shareEntry);
router.get("/my-entries", protect, eyeController.getMyEntries);
router.get("/shared-with-me", protect, eyeController.getSharedEntries);

module.exports = router;
