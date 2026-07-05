import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import db from "../db/connection";
import { users } from "../db/schema";

// 🟢 Creamos una interfaz que extiende la Request estándar para incluir req.user
interface AuthenticatedRequest extends Request {
    user?: {
        id: string; // O string, según manejes tus IDs en la base de datos de Neon
        email?: string;
        role?: string;
    };
}

// PUT /users/update-avatar
// 🟢 Cambiamos el tipo de 'req' de Request a AuthenticatedRequest
export const updateAvatar = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Ahora TypeScript sabe perfectamente qué es req.user y no dará error
        const userId = req.user?.id; 
        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        // Validamos que Multer haya procesado el archivo físico
        if (!req.file) {
            return res.status(400).json({ message: "No se seleccionó ninguna imagen física" });
        }

        // Construimos la ruta estática para guardar en la columna avatar
        const localAvatarUrl = `/uploads/tourists/${req.file.filename}`;

        // Modificamos directamente la columna avatar del usuario actual
        const [updatedUser] = await db
            .update(users)
            .set({ avatar: localAvatarUrl })
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                avatar: users.avatar,
            });

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "¡Foto de perfil actualizada con éxito!",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error al actualizar la foto de perfil:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};