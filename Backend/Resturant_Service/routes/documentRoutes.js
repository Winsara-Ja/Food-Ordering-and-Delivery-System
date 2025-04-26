const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig"); // use above multer config
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");
const {
  uploadDocument,
  getAllDocuments,
  approveDocument,
  rejectDocument
} = require("../controllers/documentController");

router.post("/upload", verifyToken, upload.single("document"), uploadDocument);
router.get("/", verifyToken, allowRoles("admin"), getAllDocuments);
router.put("/:id/approve", verifyToken, allowRoles("admin"), approveDocument);
router.put("/:id/reject", verifyToken, allowRoles("admin"), rejectDocument);

module.exports = router;
