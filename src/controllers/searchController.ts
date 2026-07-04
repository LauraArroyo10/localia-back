import { Request, Response, NextFunction } from "express";
import { and, eq, ilike, sql, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { businesses, categoryEnum, reviews } from "../db/schema";

//GET /api/search/businesses (Búsqueda Full-Text y filtros)
export const searchBusinesses = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { q, category, type, city } = req.query as any;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const conditions = [];

		if (category) conditions.push(eq(businesses.category, category));
		if (type) conditions.push(eq(businesses.type, type));
		if (city) conditions.push(ilike(businesses.city, `%${city}%`));

		if (q) {
			conditions.push(
				sql`(${ilike(businesses.name, `%${q}%`)} OR 
				      ${ilike(businesses.description, `%${q}%`)} OR 
				      ${ilike(businesses.address, `%${q}%`)})`
			);
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const results = await db
			.select({
				id: businesses.id,
				name: businesses.name,
				description: businesses.description,
				category: businesses.category,
				type: businesses.type,
				image_url: businesses.image_url,
				city: businesses.city,
				avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)::numeric(2,1)`,
				totalReviews: sql<number>`count(${reviews.id})::int`,
			})
			.from(businesses)
			.leftJoin(reviews, eq(businesses.id, reviews.business_id))
			.where(whereClause)
			.groupBy(businesses.id)
			.orderBy(desc(businesses.created_at))
			.limit(limit)
			.offset(offset);

		return res.json({
			message: "Search query executed successfully",
			meta: { page, limit, queryTerm: q },
			data: results,
		});
	} catch (error) {
		next(error);
	}
};

// GET /api/search/categories (Lista dinámica de categorías)
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const categories = categoryEnum.enumValues;

		return res.json({
			message: "Categories list fetched successfully",
			data: categories,
		});
	} catch (error) {
		next(error);
	}
};

// GET /api/search/nearby (Negocios cercanos con suficientes reseñas)
export const getNearbyBusinesses = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const lat = Number(req.query.lat);
		const lng = Number(req.query.lng);
		const radius = Number(req.query.radius) || 300;
		const minReviews = Number(req.query.minReviews) || 0;
		const limit = Number(req.query.limit) || 10;
		const category = req.query.category as string | undefined;

		if (Number.isNaN(lat) || Number.isNaN(lng)) {
			return res.status(400).json({ message: "lat and lng are required and must be valid numbers" });
		}

		const distanceExpr = sql<number>`
			(6371 * acos(
				LEAST(1.0, GREATEST(-1.0,
					cos(radians(${lat})) * cos(radians(${businesses.lat}::float)) *
					cos(radians(${businesses.lng}::float) - radians(${lng})) +
					sin(radians(${lat})) * sin(radians(${businesses.lat}::float))
				))
			))
		`;

		const whereClause = category ? eq(businesses.category, category as any) : undefined;

		const results = await db
			.select({
				id: businesses.id,
				name: businesses.name,
				description: businesses.description,
				category: businesses.category,
				type: businesses.type,
				image_url: businesses.image_url,
				city: businesses.city,
				lat: businesses.lat,
				lng: businesses.lng,
				distance: distanceExpr.as("distance"),
				avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)::numeric(2,1)`,
				totalReviews: sql<number>`count(${reviews.id})::int`,
			})
			.from(businesses)
			.leftJoin(reviews, eq(businesses.id, reviews.business_id))
			.where(whereClause)
			.groupBy(businesses.id)
			.having(sql`count(${reviews.id}) >= ${minReviews} AND ${distanceExpr} <= ${radius}`)
			.orderBy(sql`distance ASC`)
			.limit(limit);

		return res.json({
			message: "Nearby businesses with enough reviews fetched successfully",
			meta: { lat, lng, radius, minReviews, limit, category },
			data: results,
		});
	} catch (error) {
		console.error("Nearby query error:", error);
		console.error("Cause:", (error as any)?.cause);
		next(error);
	}
};