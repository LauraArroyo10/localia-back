import type { NextFunction, Request, Response } from "express";
import { type CustomJWTPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
	user?: CustomJWTPayload;
}

export const authenticateToken = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	//get authorization header from the rrequest
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

export const authenticateTokenOptional = async (
	req: AuthenticatedRequest,
	_res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return next(); // no hay token, sigue como invitado
	}

	try {
		const payload = await verifyToken(token);
		req.user = payload;
	} catch {
		// token inválido/expirado: lo ignoramos, sigue como invitado en vez de bloquear
	}

	next();
};