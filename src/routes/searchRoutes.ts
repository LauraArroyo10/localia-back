import { Router } from "express";
import { validateQuery } from "../middleware/validations";
import { z } from "zod";
import { categoryEnum } from "../db/schema";

/**
 * Rutas de búsqueda y filtros disponibles.
 */
import { searchBusinesses, getCategories, getNearbyBusinesses } from "../controllers/searchController";

const globalSearchQuerySchema = z.object({
	q: z.string().optional().default(""),
	category: z.enum(categoryEnum.enumValues as [string, ...string[]]).optional(),
	type: z.string().optional(),
	city: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(10),
});


const nearbyQuerySchema = z.object({
	lat: z.coerce.number().min(-90).max(90),
	lng: z.coerce.number().min(-180).max(180),
	radius: z.coerce.number().positive().default(5),
	minReviews: z.coerce.number().int().nonnegative().default(3),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(10),
});




const router = Router();

/**
 * Endpoint de búsqueda general, categorías y negocios cercanos.
 */
router.get("/businesses", validateQuery(globalSearchQuerySchema), searchBusinesses);
router.get("/categories", getCategories);
router.get("/nearby", validateQuery(nearbyQuerySchema), getNearbyBusinesses);

export default router;