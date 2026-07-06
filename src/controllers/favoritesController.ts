import type { Response } from "express";
import { and, eq } from "drizzle-orm";

import db from "../db/connection";
import { favorites, businesses } from "../db/schema";
import type { AuthenticatedRequest } from "../middleware/auth";

/**
 * Lista los negocios favoritos del usuario autenticado.
 */
export const getFavorites = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ message: "No autenticado" });
		}

		/**
		 * Recupera los favoritos junto con los datos del negocio relacionado.
		 */
		const userFavorites = await db.query.favorites.findMany({
			where: eq(favorites.user_id, userId),
			with: {
				business: true,
			},
		});

		/**
		 * Da formato a la respuesta omitiendo datos innecesarios.
		 */
		const formattedFavorites = userFavorites.map((f) => ({
			favoriteId: f.id,
			businessId: f.business.id,
			name: f.business.name,
			description: f.business.description,
			category: f.business.category,
			type: f.business.type,
			image_url: f.business.image_url,
			city: f.business.city,
		}));

		return res.status(200).json({ data: formattedFavorites });
	} catch (error) {
		console.error("Error fetching favorites", error);
		return res.status(500).json({ message: "Failed to fetch favorites" });
	}
};

/**
 * Agrega un negocio a la lista de favoritos del usuario.
 */
export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const businessId = req.params.businessId as string;

		if (!userId) {
			return res.status(401).json({ message: "No autenticado" });
		}

		/**
		 * Evita duplicar favoritos cuando ya existe el registro.
		 */
		const existing = await db.query.favorites.findFirst({
			where: and(eq(favorites.user_id, userId), eq(favorites.business_id, businessId)),
		});

		if (existing) {
			return res.status(409).json({ message: "Ya está en favoritos" });
		}

		const [favorite] = await db
			.insert(favorites)
			.values({ user_id: userId, business_id: businessId })
			.returning();

		return res.status(201).json({ message: "Favorito agregado", data: favorite });
	} catch (error) {
		console.error("Error adding favorite", error);
		return res.status(500).json({ message: "Failed to add favorite" });
	}
};

/**
 * Elimina un favorito existente del usuario autenticado.
 */
export const removeFavorite = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const businessId = req.params.businessId as string;

		if (!userId) {
			return res.status(401).json({ message: "No autenticado" });
		}

		/**
		 * Verifica que el favorito existe antes de borrar.
		 */
		const existing = await db.query.favorites.findFirst({
			where: and(eq(favorites.user_id, userId), eq(favorites.business_id, businessId)),
		});

		if (!existing) {
			return res.status(404).json({ message: "Favorito no encontrado" });
		}

		await db
			.delete(favorites)
			.where(and(eq(favorites.user_id, userId), eq(favorites.business_id, businessId)));

		return res.status(200).json({ message: "Favorito eliminado" });
	} catch (error) {
		console.error("Error removing favorite", error);
		return res.status(500).json({ message: "Failed to remove favorite" });
	}
};
