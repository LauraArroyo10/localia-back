import { Router } from "express";
import { updateAvatar } from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";
import { uploadTouristImage } from "../middleware/upload";

/**
 * Ruta de usuario para actualizar la foto de avatar.
 */
const router = Router();

router.put(
  "/update-avatar",
  authenticateToken,
  uploadTouristImage.single("image"),
  updateAvatar
);

export default router;
