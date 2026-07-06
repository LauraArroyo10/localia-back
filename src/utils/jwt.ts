/**
 * Generación y verificación de tokens JWT para la autenticación.
 */
import { createSecretKey } from "node:crypto";
import { type JWTPayload as JoseJWTPayload, jwtVerify, SignJWT } from "jose";
import env from "../../env";

/**
 * Payload personalizado que incluye datos del usuario.
 */
export interface CustomJWTPayload extends JoseJWTPayload {
	id: string;
	email: string;
	role: string;
}

/**
 * Genera un JWT firmado con el secreto de la aplicación.
 */
export const generateToken = async (payload: CustomJWTPayload) => {
	const secret = env.JWT_SECRET;
	const secretKey = createSecretKey(secret, "utf-8");
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(env.JWT_EXPIRES_IN)
		.sign(secretKey);
	return token;
};

/**
 * Verifica un JWT y devuelve su payload tipado.
 */
export const verifyToken = async (token: string): Promise<CustomJWTPayload> => {
	const secret = env.JWT_SECRET;
	const secretKey = createSecretKey(secret, "utf-8");
	const { payload } = await jwtVerify(token, secretKey);
	return payload as CustomJWTPayload;
};

