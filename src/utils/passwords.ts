import bcrypt from "bcrypt";
import env from "../../env";

/**
 * Hashea una contraseña usando el factor de costo definido en el entorno.
 */
export const hashPassword = async (password: string) => {
	return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

/**
 * Compara una contraseña en texto plano con un hash almacenado.
 */
export const comparePasswords = async (
	password: string,
	hashedPassword: string,
) => {
	return bcrypt.compare(password, hashedPassword);
};

