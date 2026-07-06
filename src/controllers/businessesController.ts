import { Request, Response, NextFunction } from "express";
import { and, eq, ilike, sql, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { businesses, reviews } from "../db/schema";
import { z } from "zod";
import { categoryEnum, businessTypeEnum } from "../db/schema";

/**
 * Esquemas de validación Zod para crear y actualizar negocios.
 */
export const createBusinessBodySchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").optional().nullable(),
    category: z.enum(categoryEnum.enumValues as [string, ...string[]]),
    type: z.enum(businessTypeEnum.enumValues as [string, ...string[]]),
    phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos").optional().nullable(),
    image_url: z.string().url("URL de imagen inválida").optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    lat: z.coerce.number().min(-90, "Latitud inválida").max(90, "Latitud inválida").optional().nullable(),
    lng: z.coerce.number().min(-180, "Longitud inválida").max(180, "Longitud inválida").optional().nullable(),
});

export const updateBusinessBodySchema = createBusinessBodySchema.partial();

export const idParamSchema = z.object({
    id: z.string().uuid("El formato del ID proporcionado debe ser un UUID válido"),
});

export const businessQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    category: z.enum(categoryEnum.enumValues as [string, ...string[]]).optional(),
    type: z.enum(businessTypeEnum.enumValues as [string, ...string[]]).optional(),
    city: z.string().optional(),
    search: z.string().optional(),
});


/**
 * Lista negocios con filtros dinámicos y paginación.
 */
export const getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, category, type, city, search } = req.query as any;
        const offset = (page - 1) * limit;
        const conditions = [];

        if (category) conditions.push(eq(businesses.category, category));
        if (type) conditions.push(eq(businesses.type, type));
        if (city) conditions.push(ilike(businesses.city, `%${city}%`));
        if (search) {
            conditions.push(sql`(${ilike(businesses.name, `%${search}%`)} OR ${ilike(businesses.description, `%${search}%`)})`);
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const data = await db
            .select()
            .from(businesses)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(businesses.created_at));

        return res.json({
            message: "Businesses fetched successfully",
            meta: { page, limit },
            data,
        });
    } catch (error) {
        next(error);
    }
};



/**
 * Recupera los negocios destacados ordenados por calificación promedio.
 */
export const getFeaturedBusinesses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featured = await db
            .select({
                id: businesses.id,
                name: businesses.name,
                image_url: businesses.image_url,
                category: businesses.category,
                city: businesses.city,
                avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)::numeric(2,1)`,
            })
            .from(businesses)
            .leftJoin(reviews, eq(businesses.id, reviews.business_id))
            .groupBy(businesses.id)
            .orderBy(desc(sql`coalesce(avg(${reviews.rating}), 0)`))
            .limit(6);

        return res.json({
            message: "Featured businesses fetched successfully",
            data: featured,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene un negocio por su ID e incluye cálculos de reseñas.
 */
export const getBusinessById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as any;

        const businessResult = await db
            .select({
                business: businesses,
                avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)::numeric(2,1)`,
                totalReviews: sql<number>`count(${reviews.id})::int`,
            })
            .from(businesses)
            .leftJoin(reviews, eq(businesses.id, reviews.business_id))
            .where(eq(businesses.id, id))
            .groupBy(businesses.id);

        if (businessResult.length === 0) {
            return res.status(404).json({ message: "Business not found" });
        }

        return res.json({
            message: "Detailed info fetched successfully",
            data: businessResult[0],
        });
    } catch (error) {
        next(error);
    }
};



/**
 * Crea un nuevo negocio para el vendedor autenticado.
 */
export const createBusiness = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ message: "Access denied. Only sellers can create businesses." });
        }

        const imageUrl = req.file
			? `/uploads/businesses/${req.file.filename}`
			: null;

        const newBusiness = await db
            .insert(businesses)
            .values({ ...req.body, owner_id: req.user.id, image_url: imageUrl })
            .returning();

        return res.status(201).json({
            message: "Business created successfully",
            data: newBusiness[0],
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualiza un negocio existente solo si el vendedor es su propietario.
 */
export const updateBusiness = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as any;

        if (req.user?.role !== "seller") {
            return res.status(403).json({ message: "Access denied. Only sellers can update businesses." });
        }

        const existingBusiness = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);

        if (existingBusiness.length === 0) {
            return res.status(404).json({ message: "Business not found" });
        }

        if (existingBusiness[0].owner_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized. You do not own this business." });
        }

        const imageUrl = req.file
        ? `/uploads/businesses/${req.file.filename}`
        : undefined;

        const updatedBusiness = await db
            .update(businesses)
            .set({ ...req.body, ...(imageUrl && {image_url: imageUrl}) ,updated_at: new Date() })
            .where(eq(businesses.id, id))
            .returning();

        return res.json({
            message: "Business updated successfully",
            data: updatedBusiness[0],
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un negocio solo si el vendedor autenticado es el propietario.
 */
export const deleteBusiness = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as any;

        if (req.user?.role !== "seller") {
            return res.status(403).json({ message: "Access denied." });
        }

        const existingBusiness = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);

        if (existingBusiness.length === 0) {
            return res.status(404).json({ message: "Business not found" });
        }

        if (existingBusiness[0].owner_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized. You do not own this business." });
        }

        await db.delete(businesses).where(eq(businesses.id, id));
        return res.json({ message: "Business deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * Devuelve el negocio asociado al vendedor autenticado.
 */
export const getMyBusiness = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ message: "Access denied. Only sellers have a business profile." });
        }

        /**
         * Busca el negocio donde el owner_id coincida con el usuario autenticado.
         */
        const myBusiness = await db
            .select()
            .from(businesses)
            .where(eq(businesses.owner_id, req.user.id))
            .limit(1);

        if (myBusiness.length === 0) {
            return res.status(404).json({ message: "No business profile found for this seller." });
        }

        return res.json({
            message: "Your business fetched successfully",
            data: myBusiness[0],
        });
    } catch (error) {
        next(error);
    }
};
