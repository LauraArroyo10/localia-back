import { Router } from "express";
import { z } from "zod";

import { login, register } from "../controllers/authController";
import { validateBody } from "../middleware/validations";

/**
 * Rutas de autenticación: registro e inicio de sesión.
 */
const router = Router();

/**
 * Schemas de validación para registro y login.
 */
const registerSchema = z.object({
	name: z.string().min(1, "El nombre es requerido"),
	email: z.email("Correo inválido"),
	password: z
	.string()
		.min(8, "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			"La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número",
		),
	role: z.enum(["tourist", "seller", "guest"]),
});

const loginSchema = z.object({
	email: z.email("Correo inválido"),
	password: z.string().min(1, "La contraseña es requerida"),
});

/**
 * POST /auth/register - Registra un nuevo usuario.
 * POST /auth/login - Inicia sesión y devuelve JWT.
 * GET /auth/me - Devuelve datos del usuario autenticado.
 */
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
