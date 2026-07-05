import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

import db from "../db/connection";
import { users } from "../db/schema";
import { generateToken } from "../utils/jwt";
import { comparePasswords, hashPassword } from "../utils/passwords";
import { businesses } from "../db/schema";

// POST /auth/register
// Crea un nuevo usuario, hashea su contraseña, guarda en DB y devuelve JWT + datos del usuario
export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password, role } = req.body;

		const hashedPassword = await hashPassword(password);

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

if (role === "seller") {
  const biz = await db
    .select()
    .from(businesses)
    .where(eq(businesses.owner_id, user.id))
    .limit(1);

  business = biz[0] || null;
}

		const token = await generateToken({
			id: user.id,
			email: user.email,
			role: user.role,
			avatar: user.avatar
		});

		return res.status(201).json({
			message: "User registered",
			user,
			business,
			token,
		});
	} catch (error: any) {
//   Postgres: código 23505 = violación de unique constraint (ej. email repetido)
  if (error?.code === "23505") {
    return res.status(409).json({ message: "El correo ya está registrado" });
  }
  console.error("Error during registration", error);
  return res.status(500).json({ message: "El correo ya está registrado" });
}
};

// POST /auth/login
// Busca usuario por email, verifica contraseña y devuelve JWT + datos del usuario
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});
console.log("Email recibido:", email);
console.log("Usuario encontrado:", user);
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await comparePasswords(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		let business = null;

if (user.role === "seller") {
  const biz = await db
    .select()
    .from(businesses)
    .where(eq(businesses.owner_id, user.id))
    .limit(1);

  business = biz[0] || null;
}

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
