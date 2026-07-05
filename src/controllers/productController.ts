import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { products, businesses } from "../db/schema";
import { z } from "zod";

export const idParamSchema = z.object({
	id: z.string().uuid("Invalid product ID"),
});

export const createProductBodySchema = z.object({
	business_id: z.string().uuid("Invalid business ID"),
	name: z.string().min(2, "Name too short"),
	description: z.string().min(1, "Description is required"),
	price: z.string().min(1, "Price is required"),
});

//crear producto
export const createProduct = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		// Solo los vendedores pueden crear productos
		if (req.user?.role !== "seller") {
			return res.status(403).json({
				message: "Only sellers can create products",
			});
		}

		// Validar datos enviados
		const parsed = createProductBodySchema.parse(req.body);

		// Buscar el negocio
		const business = await db
			.select()
			.from(businesses)
			.where(eq(businesses.id, parsed.business_id))
			.limit(1);

		if (!business.length) {
			return res.status(404).json({
				message: "Business not found",
			});
		}

		// Verificar que el negocio pertenezca al usuario
		if (business[0].owner_id !== req.user.id) {
			return res.status(403).json({
				message: "Not your business",
			});
		}

		// Obtener la ruta de la imagen subida
		const imageUrl = req.file
			? `/uploads/products/${req.file.filename}`
			: null;

		if (!imageUrl) {
			return res.status(400).json({
				message: "Product image is required",
			});
		}

		// Guardar producto
		const [newProduct] = await db
			.insert(products)
			.values({
				business_id: parsed.business_id,
				name: parsed.name,
				description: parsed.description,
				image: imageUrl,
				price: parsed.price,
			})
			.returning();

		return res.status(201).json({
			message: "Product created successfully",
			data: newProduct,
		});
	} catch (error) {
		next(error);
	}
};

// Obtener productos de un negocio
export const getProductsByBusiness = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const businessId = req.params.businessId as string;

		const data = await db
			.select()
			.from(products)
			.where(eq(products.business_id, businessId));

		return res.json({
			message: "Products fetched successfully",
			data,
		});
	} catch (error) {
		next(error);
	}
};

// Eliminar producto
export const deleteProduct = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		// Solo los vendedores pueden eliminar productos
		if (req.user?.role !== "seller") {
			return res.status(403).json({
				message: "Only sellers can delete products",
			});
		}

		// Buscar el producto
		const product = await db
			.select()
			.from(products)
			.where(eq(products.id, id))
			.limit(1);

		if (!product.length) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		// Buscar el negocio al que pertenece
		const business = await db
			.select()
			.from(businesses)
			.where(eq(businesses.id, product[0].business_id))
			.limit(1);

		if (!business.length) {
			return res.status(404).json({
				message: "Business not found",
			});
		}

		// Verificar que el negocio sea del usuario autenticado
		if (business[0].owner_id !== req.user.id) {
			return res.status(403).json({
				message: "You are not allowed to delete this product",
			});
		}

		const [deleted] = await db
			.delete(products)
			.where(eq(products.id, id))
			.returning();

		return res.json({
			message: "Product deleted successfully",
			data: deleted,
		});
	} catch (error) {
		next(error);
	}
};