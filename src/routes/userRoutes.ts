import { Router } from "express";
import { updateAvatar } from "../controllers/userController"; // Aquí importa tu controlador
import { authenticateToken } from "../middleware/auth"; 
import { uploadTouristImage } from "../middleware/upload"; 

const router = Router();

// Define el camino y llama a tu función del controlador
router.put(
  "/update-avatar", 
  authenticateToken, 
  uploadTouristImage.single("image"), 
  updateAvatar // Tu función se ejecuta aquí
);

export default router; // Esto arregla el error en server.ts