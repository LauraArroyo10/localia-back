import type { NextFunction, Request, Response } from "express";
import { type CustomJWTPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
	user?: CustomJWTPayload;
}

/**
 * Middleware que requiere un JWT válido para continuar.
 * Si no hay token o el token no es válido, responde con 401.
 */
export const authenticateToken = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			message: "no token provided",
		});
	}

	try {
		const payload = await verifyToken(token);
		req.user = payload;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token inválido o expirado" });
	}
};

/**
 * Middleware opcional de autenticación.
 * Si hay un token válido añade req.user, sino continúa como invitado.
 */
export const authenticateTokenOptional = async (
	req: AuthenticatedRequest,
	_res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return next();
	}

	try {
		const payload = await verifyToken(token);
		req.user = payload;
	} catch {
		/**
		 * El token opcional no es válido.
		 * No bloquea la ruta; el usuario continúa como invitado.
		 */
	}

	next();
};
