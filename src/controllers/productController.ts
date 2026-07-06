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

/**
 * Crea un producto nuevo para un vendedor autenticado.
 * Verifica la propiedad del negocio y guarda la imagen asociada.
 */
export const createProduct = async (
	req: any,
	res: Response,
	next: NextFunction,
) => {
	try {
		/**
		 * Requiere rol seller para poder publicar productos.
		 */
		if (req.user?.role !== "seller") {
			return res.status(403).json({
				message: "Only sellers can create products",
			});
		}

		/**
		 * Valida el cuerpo de la solicitud con el esquema definido.
		 */
		const parsed = createProductBodySchema.parse(req.body);

		/**
		 * Busca el negocio que recibimos en el body para asociar el producto.
		 */
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

		/**
		 * Confirma que el negocio pertenece al usuario autenticado.
		 */
		if (business[0].owner_id !== req.user.id) {
			return res.status(403).json({
				message: "Not your business",
			});
		}

		/**
		 * Crea la URL local de la imagen en caso de que se haya subido un archivo.
		 */
		const imageUrl = req.file
			? `/uploads/products/${req.file.filename}`
			: null;

		if (!imageUrl) {
			return res.status(400).json({
				message: "Product image is required",
			});
		}

		/**
		 * Inserta el producto en la base de datos y devuelve el registro creado.
		 */
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

/**
 * Obtiene los productos de un negocio específico.
 */
export const getProductsByBusiness = async (
	req: Request,
	res: Response,
	next: NextFunction,
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

/**
 * Elimina un producto sólo si el usuario autenticado es dueño del negocio.
 */
export const deleteProduct = async (
	req: any,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		/**
		 * Requiere rol seller para borrar productos.
		 */
		if (req.user?.role !== "seller") {
			return res.status(403).json({
				message: "Only sellers can delete products",
			});
		}

		/**
		 * Busca el producto por su ID.
		 */
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

		/**
		 * Verifica que exista el negocio del producto.
		 */
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

		/**
		 * Verifica que el negocio pertenezca al usuario autenticado.
		 */
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