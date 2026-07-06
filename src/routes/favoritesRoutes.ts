import { Router } from "express";
import { z } from "zod";

import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoritesController";

import { authenticateToken } from "../middleware/auth";
import { validateParams } from "../middleware/validations";

const router = Router();

const businessIdSchema = z.object({
  businessId: z.string().uuid(),
});

/**
 * Rutas para gestionar la lista de favoritos del usuario autenticado.
 */
router.get("/me/favorites", authenticateToken, getFavorites);
router.post("/me/favorites/:businessId", authenticateToken, validateParams(businessIdSchema), addFavorite);
router.delete("/me/favorites/:businessId", authenticateToken, validateParams(businessIdSchema), removeFavorite);

export default router;