import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

import db from "../db/connection";
import { users } from "../db/schema";
import { generateToken } from "../utils/jwt";
import { comparePasswords, hashPassword } from "../utils/passwords";
import { businesses } from "../db/schema";

/**
 * Registro de usuario: hashea la contraseña, guarda el usuario y devuelve JWT.
 * Si el rol es seller, también busca el negocio asociado para devolverlo.
 */
export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password, role } = req.body;

		/**
		 * Convierte la contraseña en un hash seguro antes de guardarla.
		 */
		const hashedPassword = await hashPassword(password);

		/**
		 * Inserta el nuevo usuario en la base de datos y guarda solo los campos necesarios.
		 */
		const [user] = await db
			.insert(users)
			.values({
				name,
				email,
				password: hashedPassword,
				role,
			})
			.returning({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				avatar: users.avatar,
				location: users.location,
				created_at: users.created_at,
			});

		let business = null;

		/**
		 * Si el usuario es vendedor, busca en la base de datos su negocio asociado.
		 */
		if (role === "seller") {
			const biz = await db
				.select()
				.from(businesses)
				.where(eq(businesses.owner_id, user.id))
				.limit(1);

			business = biz[0] || null;
		}

		/**
		 * Genera el token JWT para autenticar al usuario en futuras solicitudes.
		 */
		const token = await generateToken({
			id: user.id,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
		});

		return res.status(201).json({
			message: "User registered",
			user,
			business,
			token,
		});
	} catch (error: any) {
		/**
		 * Maneja el error de correo duplicado con un status claro para el cliente.
		 */
		if (error?.code === "23505") {
			return res.status(409).json({ message: "El correo ya está registrado" });
		}

		console.error("Error during registration", error);
		return res.status(500).json({ message: "El correo ya está registrado" });
	}
};

/**
 * Login de usuario: verifica credenciales, genera JWT y devuelve datos.
 */
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		/**
		 * Busca al usuario por correo electrónico para validar credenciales.
		 */
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		/**
		 * Compara la contraseña enviada con el hash almacenado.
		 */
		const isPasswordValid = await comparePasswords(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		let business = null;

		/**
		 * Si el usuario es seller, trae su negocio asociado para la respuesta.
		 */
		if (user.role === "seller") {
			const biz = await db
				.select()
				.from(businesses)
				.where(eq(businesses.owner_id, user.id))
				.limit(1);

			business = biz[0] || null;
		}

		/**
		 * Genera el token JWT con datos del usuario autenticado.
		 */
		const token = await generateToken({
			id: user.id,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
		});

		return res.status(200).json({
			message: "Login successful",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				location: user.location,
			},
			business,
			token,
		});
	} catch (error) {
		console.error("Error during login", error);
		return res.status(500).json({ message: "Failed to login" });
	}
};
