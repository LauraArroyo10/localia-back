import type { NextFunction, Request, Response } from "express";

import { z } from "zod";

/**
 * Valida el cuerpo de la petición contra un esquema Zod.
 */
export const validateBody = (schema: z.ZodTypeAny) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = schema.parse(req.body);
			req.body = validatedData;
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					message: "Validation failed",
					errors: error.issues,
				});
			}
			next(error);
		}
	};
};

/**
 * Valida los parámetros de ruta contra un esquema Zod.
 */
export const validateParams = (schema: z.ZodTypeAny) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.params);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					message: "Invalid parameters",
					errors: error.issues,
				});
			}
			next(error);
		}
	};
};

/**
 * Valida las query parameters contra un esquema Zod.
 */
export const validateQuery = (schema: z.ZodTypeAny) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.query);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					message: "Invalid query parameters",
					errors: error.issues,
				});
			}
			next(error);
		}
	};
};

